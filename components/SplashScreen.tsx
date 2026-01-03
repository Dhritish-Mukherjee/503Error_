import React, { useEffect, useState, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'VOID' | 'GLITCH'>('VOID');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep the latest callback ref to handle parent re-renders without resetting the timer
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // 0ms: VOID (Dead air)
    
    // 200ms: Trigger Hardware Glitch
    const glitchTimer = setTimeout(() => {
      setPhase('GLITCH');
    }, 200);

    // 1100ms: Total Sequence End
    // Using empty dependency array [] ensures this runs exactly once on mount
    const endTimer = setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 1100);

    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(endTimer);
    };
  }, []); 

  // Canvas Noise Generator (High ISO Simulation)
  useEffect(() => {
    if (phase !== 'GLITCH') return;
    
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
  
  // 1. VOID: Pure Black
  if (phase === 'VOID') {
    return <div className="fixed inset-0 bg-black z-[100]" />;
  }

  // 2. GLITCH: Tearing Black Mask revealing App behind + Canvas Noise overlay
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      
      {/* 
         The Black Mask:
         This covers the app. The 'animate-tear' uses clip-path to slice holes in this mask.
         Where the mask is sliced (transparent), the pre-loaded Dashboard (rendered in App.tsx) 
         is visible underneath. The SVG filter distorts the edges of the mask.
      */}
      <div 
        className="absolute inset-0 bg-black animate-tear z-10" 
        style={{ filter: 'url(#hardware-displacement)' }}
      ></div>

      {/* 
         Inverted Flash:
         Occasional white full-screen flash using a reversed tear animation for contrast.
      */}
      <div 
        className="absolute inset-0 bg-white opacity-20 animate-tear mix-blend-exclusion z-20"
        style={{ animationDirection: 'reverse', animationDuration: '0.1s' }}
      ></div>

      {/* 
         Canvas Sensor Noise:
         Overlays everything with digital grain.
      */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-50 opacity-50 mix-blend-overlay"
      />
      
    </div>
  );
};