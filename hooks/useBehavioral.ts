import { useState, useEffect, useRef } from 'react';
import { BehavioralData } from '../types';
import { APP_CONFIG } from '../constants';

export const useBehavioral = () => {
  const [data, setData] = useState<BehavioralData>({
    touchVelocity: 0,
    contactRadius: 0,
    orientation: { alpha: 0, beta: 0, gamma: 0 },
    hasFocus: true,
  });

  const lastPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const throttleRef = useRef<number>(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const now = Date.now();
      if (now - throttleRef.current < APP_CONFIG.UI_THROTTLE_MS) return;
      
      let x, y, radius = 0;

      if ('touches' in e) {
        if (e.touches.length > 0) {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
          // Approximating radius if supported, else 1.0
          radius = (e.touches[0] as any).radiusX || 1.0; 
        } else {
            return;
        }
      } else {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
        radius = 0.1; // Mouse is precise
      }

      let velocity = 0;
      if (lastPos.current) {
        const dx = x - lastPos.current.x;
        const dy = y - lastPos.current.y;
        const dt = now - lastPos.current.time;
        if (dt > 0) {
            velocity = Math.sqrt(dx * dx + dy * dy) / dt;
        }
      }

      lastPos.current = { x, y, time: now };
      throttleRef.current = now;

      setData(prev => ({
        ...prev,
        touchVelocity: parseFloat(velocity.toFixed(2)),
        contactRadius: parseFloat(radius.toFixed(2)),
      }));
    };

    const handleFocus = () => setData(prev => ({ ...prev, hasFocus: true }));
    const handleBlur = () => setData(prev => ({ ...prev, hasFocus: false }));
    
    // Passive orientation (if available without permission)
    const handleOrientation = (e: DeviceOrientationEvent) => {
        // We throttle this too
        const now = Date.now();
        // Check if throttle time passed (using a separate simple check or reuse existing logic)
        // For orientation, we update slightly less frequently to avoid jitter
        if (Math.random() > 0.1) return; 

        setData(prev => ({
            ...prev,
            orientation: {
                alpha: e.alpha ? parseFloat(e.alpha.toFixed(1)) : null,
                beta: e.beta ? parseFloat(e.beta.toFixed(1)) : null,
                gamma: e.gamma ? parseFloat(e.gamma.toFixed(1)) : null,
            }
        }));
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return data;
};
