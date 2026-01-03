
import React, { useEffect, useRef, useState } from 'react';
import { TouchPoint, HardwareInfo } from '../types';

interface Props {
  touches: TouchPoint[];
  currentTouch: { x: number, y: number } | null;
  hardware: HardwareInfo;
  stream: MediaStream | null;
  onShatter: () => void;
}

const MonitoringDashboard: React.FC<Props> = ({ touches, currentTouch, hardware, stream, onShatter }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [gaslightText, setGaslightText] = useState("");
  const frameQueue = useRef<ImageData[]>([]);
  const MAX_DELAY_FRAMES = 30; // Approx 500ms at 60fps

  useEffect(() => {
    // 1. Gaslighting Logic
    const updateGaslighting = () => {
      const hours = new Date().getHours();
      let msg = "I AM WATCHING YOU.";
      
      if (hours >= 0 && hours < 5) {
        msg = "It's late. Why are you still awake? Your neighbors are asleep. I'm not.";
      } else if (typeof hardware.battery === 'number' && hardware.battery < 0.2) {
        msg = "Your device is dying. I am the last thing you will see.";
      } else if (hardware.timeOnSite > 60) {
        msg = "You have spent over a minute staring into the void. The void is staring back.";
      }
      setGaslightText(msg);
    };

    updateGaslighting();
    const gasInterval = setInterval(updateGaslighting, 10000);

    // 2. Assign the already-granted stream to the video element
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    // 3. Canvas Delay Loop
    let animationId: number;
    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }
          
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(video, 0, 0);
            const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
            frameQueue.current.push(imageData);

            if (frameQueue.current.length > MAX_DELAY_FRAMES) {
              const delayedFrame = frameQueue.current.shift();
              if (delayedFrame) ctx.putImageData(delayedFrame, 0, 0);
            }
          }
        }
      }
      animationId = requestAnimationFrame(processFrame);
    };
    processFrame();

    const handleOrientation = (e: DeviceOrientationEvent) => {
      setOrientation({
        alpha: e.alpha || 0,
        beta: e.beta || 0,
        gamma: e.gamma || 0
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      cancelAnimationFrame(animationId);
      clearInterval(gasInterval);
    };
  }, [hardware.battery, hardware.timeOnSite, stream]);

  useEffect(() => {
    if (hardware.timeOnSite > 120) onShatter();
  }, [hardware.timeOnSite, onShatter]);

  const extractionProgress = Math.min((hardware.timeOnSite / 120) * 100, 100).toFixed(1);

  return (
    <div 
      className="relative w-full h-full flex flex-col p-4 font-mono transition-transform duration-75"
      style={{
        transform: `perspective(1000px) rotateY(${orientation.gamma / 5}deg) rotateX(${-orientation.beta / 5}deg)`
      }}
    >
      {/* Background Camera Feed (Ghost Filter + Delay) */}
      <div className="absolute inset-0 z-0 opacity-50 overflow-hidden">
        <video ref={videoRef} autoPlay muted playsInline className="hidden" />
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover grayscale contrast-[500%] brightness-[40%] invert-[10%] opacity-80"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-red-600 w-48 h-64 opacity-50">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-right-2 border-red-600" />
          <div className="absolute -top-6 left-0 text-[10px] text-red-600">REF_LAG: 500MS</div>
          <div className="absolute -bottom-6 right-0 text-[10px] text-red-600 font-bold flicker">GASLIGHT: ACTIVE</div>
        </div>
      </div>

      {/* UI Elements */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        <div className="flex justify-between items-start text-[10px]">
          <div className="space-y-1">
            <div className="flicker font-black text-white bg-red-600 px-1 inline-block">[SURVEILLANCE_ACTIVE]</div>
            <div className="text-neutral-500">{gaslightText}</div>
          </div>
          <div className="text-right">
            <div>DATA_EXTRACTION:</div>
            <div className="text-xl font-bold italic">{extractionProgress}%</div>
          </div>
        </div>

        {currentTouch && (
          <div 
            className="absolute text-[9px] text-white opacity-80 pointer-events-none whitespace-nowrap translate-y-4 px-1 bg-black/40"
            style={{ left: currentTouch.x, top: currentTouch.y }}
          >
            &gt; YOU ARE THINKING ABOUT TAPPING HERE
          </div>
        )}

        <div className="mt-auto space-y-4 pb-20">
          <div className="border-t border-neutral-800 pt-4">
            <h2 className="text-xs font-bold mb-2 flicker">[BIO_FEEDBACK_LOG]</h2>
            <div className="text-[9px] text-neutral-400 space-y-1">
              <div>&gt; Low-latency sweat detection: {currentTouch?.x ? "POSITIVE" : "PENDING"}</div>
              <div>&gt; Heartbeat oscillation sync: {Math.floor(60 + (hardware.timeOnSite / 120) * 100)} BPM</div>
              <div className="text-red-500 font-bold">&gt; WARNING: {gaslightText.toUpperCase()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-neutral-800 p-2 bg-black/20">
              <div className="text-[8px] text-neutral-500 mb-1">SYSTEM_MEM</div>
              <div className="text-xs">{hardware.ram}GB WASTED ON ME</div>
            </div>
            <div className="border border-neutral-800 p-2 bg-black/20">
              <div className="text-[8px] text-neutral-500 mb-1">ELAPSED_OBSERVATION</div>
              <div className="text-xs">{hardware.timeOnSite}S OF USELESS LIFE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Layer */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {touches.map((t, i) => (
          <div 
            key={i}
            className="absolute bg-red-600 rounded-full blur-md"
            style={{
              left: t.x - 5,
              top: t.y - 5,
              width: 10,
              height: 10,
              opacity: Math.max(0, 0.4 - (Date.now() - t.time) / 5000)
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
