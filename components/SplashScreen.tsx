import React, { useEffect, useState, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'VOID' | 'GLITCH' | 'WAITING'>('VOID');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // 0ms: VOID (Dead air)
    
    // 200ms: Trigger Hardware Glitch
    const glitchTimer = setTimeout(() => {
      setPhase('GLITCH');
    }, 200);

    // 1500ms: Settles to Waiting for Input
    const waitTimer = setTimeout(() => {
      setPhase('WAITING');
    }, 1500);

    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(waitTimer);
    };
  }, []); 

  // Handle User Interaction to Unlock Browser APIs (Vibration/Audio)
  const handleInteraction = () => {
    if (phase !== 'WAITING') return;

    // Trigger a micro-vibration to unlock the API
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(50);
      } catch (e) {
        // Ignore
      }
    }

    onComplete();
  };

  // Canvas Noise Generator (High ISO Simulation)
  useEffect(() => {
    if (phase === 'VOID') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const w = canvas.width;
      const h = canvas.height;
      
      const idata = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;

      // Generate raw sensor noise
      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.15) {
          // Intense white noise
          buffer32[i] = 0xffffffff;
        } else if (Math.random() < 0.05) {
          // Occasional chromatic noise (blue/red artifacts)
          buffer32[i] = Math.random() > 0.5 ? 0xff0000ff : 0xffff0000;
        } else {
          // Transparent
          buffer32[i] = 0x00000000;
        }
      }

      ctx.putImageData(idata, 0, 0);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [phase]);

  // Render Logic
  
  if (phase === 'VOID') {
    return <div className="fixed inset-0 bg-black z-[100]" />;
  }

  return (
    <div 
      className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-black"
      onClick={handleInteraction}
    >
      {/* 
         The Black Mask & Glitch Layers
      */}
      {phase === 'GLITCH' && (
        <>
          <div 
            className="absolute inset-0 bg-black animate-tear z-10" 
            style={{ filter: 'url(#hardware-displacement)' }}
          ></div>
          <div 
            className="absolute inset-0 bg-white opacity-20 animate-tear mix-blend-exclusion z-20"
            style={{ animationDirection: 'reverse', animationDuration: '0.1s' }}
          ></div>
        </>
      )}

      {/* 
         Waiting State UI
      */}
      {phase === 'WAITING' && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="text-center">
            <div className="text-sys-red text-xs tracking-[0.2em] font-bold animate-pulse">
              SYSTEM_READY
            </div>
            <div className="mt-2 text-white text-lg font-mono tracking-tighter border border-white px-4 py-2 bg-black/50 backdrop-blur-sm">
              [ TAP_TO_CONNECT ]
            </div>
            <div className="mt-1 text-[8px] text-gray-500 uppercase">
              ALLOW_HAPTIC_FEEDBACK
            </div>
          </div>
        </div>
      )}

      {/* 
         Canvas Sensor Noise (Always visible after VOID)
      */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-50 opacity-50 mix-blend-overlay pointer-events-none"
      />
      
    </div>
  );
};