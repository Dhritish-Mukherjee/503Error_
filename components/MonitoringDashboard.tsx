
import React, { useEffect, useRef, useState } from 'react';
import { TouchPoint, HardwareInfo } from '../types';

interface Props {
  touches: TouchPoint[];
  currentTouch: { x: number, y: number } | null;
  hardware: HardwareInfo;
  onShatter: () => void;
}

const MonitoringDashboard: React.FC<Props> = ({ touches, currentTouch, hardware, onShatter }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error("Camera access failed", e);
      }
    };
    startCamera();

    const handleOrientation = (e: DeviceOrientationEvent) => {
      setOrientation({
        alpha: e.alpha || 0,
        beta: e.beta || 0,
        gamma: e.gamma || 0
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Effect for the final countdown to shatter
  useEffect(() => {
    if (hardware.timeOnSite > 120) {
      onShatter();
    }
  }, [hardware.timeOnSite, onShatter]);

  return (
    <div 
      className="relative w-full h-full flex flex-col p-4 font-mono transition-transform duration-75"
      style={{
        transform: `perspective(1000px) rotateY(${orientation.gamma / 5}deg) rotateX(${-orientation.beta / 5}deg)`
      }}
    >
      {/* Background Camera Feed (High Contrast) */}
      <div className="absolute inset-0 z-0 opacity-40 overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="w-full h-full object-cover grayscale contrast-[300%] brightness-[50%]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-red-600 w-48 h-64 opacity-50">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-right-2 border-red-600" />
          <div className="absolute -top-6 left-0 text-[10px] text-red-600">FACE_TARGET: LOCKED</div>
          <div className="absolute -bottom-6 right-0 text-[10px] text-red-600">TEMP: 37.4°C</div>
        </div>
      </div>

      {/* UI Elements */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        <div className="flex justify-between items-start text-[10px]">
          <div className="space-y-1">
            <div className="flicker">[SURVEILLANCE_ACTIVE]</div>
            <div>NET_NODE: {hardware.isp}</div>
            <div>LOC: UNKNOWN_PROXY</div>
          </div>
          <div className="text-right">
            <div>UPLOADING_TELEMETRY...</div>
            <div className="text-xs font-bold">{Math.min(hardware.timeOnSite * 2, 99)}%</div>
          </div>
        </div>

        {/* Mind Reading: Pointer Follower */}
        {currentTouch && (
          <div 
            className="absolute text-[9px] text-white opacity-80 pointer-events-none whitespace-nowrap translate-y-4"
            style={{ left: currentTouch.x, top: currentTouch.y }}
          >
            &gt; YOU ARE THINKING ABOUT TAPPING HERE
          </div>
        )}

        <div className="mt-auto space-y-4 pb-20">
          <div className="border-t border-neutral-800 pt-4">
            <h2 className="text-xs font-bold mb-2">[BIO_FEEDBACK_LOG]</h2>
            <div className="text-[9px] text-neutral-400 space-y-1">
              <div>&gt; High sweat-gland activity detected at coordinates {currentTouch?.x || 0}, {currentTouch?.y || 0}</div>
              <div>&gt; Pulse simulation estimating 112 BPM</div>
              <div>&gt; Pupil dilation suggests moderate anxiety</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-neutral-800 p-2">
              <div className="text-[8px] text-neutral-500 mb-1">SYSTEM_MEM</div>
              <div className="text-xs">{hardware.ram}GB WASTED ON ME</div>
            </div>
            <div className="border border-neutral-800 p-2">
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
            className="absolute bg-red-600 rounded-full blur-md opacity-20"
            style={{
              left: t.x - 5,
              top: t.y - 5,
              width: 10,
              height: 10,
              opacity: Math.max(0, 0.3 - (Date.now() - t.time) / 10000)
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
