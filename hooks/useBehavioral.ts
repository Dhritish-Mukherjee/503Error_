import { useState, useEffect, useRef } from 'react';
import { BehavioralData } from '../types';
import { APP_CONFIG } from '../constants';

export const useBehavioral = () => {
  const [data, setData] = useState<BehavioralData>({
    touchVelocity: 0,
    surfacePressure: 0.0,
    orientation: { alpha: 0, beta: 0, gamma: 0 },
    kinetics: {
      accelerationMag: 0,
      kineticState: 'SEDENTARY',
      postureReport: 'ANALYZING...',
      tremorScore: 0,
      confidence: 100,
    },
    hasFocus: true,
  });

  const lastPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const throttleRef = useRef<number>(0);
  const motionThrottleRef = useRef<number>(0);

  useEffect(() => {
    // --- MOUSE / TOUCH LOGIC ---
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const now = Date.now();
      if (now - throttleRef.current < APP_CONFIG.UI_THROTTLE_MS) return;
      
      let x = 0, y = 0;
      let rawForce = 0;

      if ('touches' in e) {
        if (e.touches.length > 0) {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
          rawForce = (e.touches[0] as any).force || 0; 
        } else {
            return;
        }
      } else {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
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

      let pressure = 0;
      if (rawForce > 0) {
        pressure = rawForce;
      } else {
        const base = 0.35;
        const velocityFactor = Math.min(velocity, 10) / 20; 
        const noise = (Math.random() * 0.1) - 0.05;
        pressure = base + velocityFactor + noise;
      }

      lastPos.current = { x, y, time: now };
      throttleRef.current = now;

      setData(prev => ({
        ...prev,
        touchVelocity: parseFloat(velocity.toFixed(2)),
        surfacePressure: parseFloat(Math.max(0, pressure).toFixed(3)),
      }));
    };

    const handleFocus = () => setData(prev => ({ ...prev, hasFocus: true }));
    const handleBlur = () => setData(prev => ({ ...prev, hasFocus: false }));
    
    // --- GYRO (ORIENTATION) LOGIC ---
    const handleOrientation = (e: DeviceOrientationEvent) => {
        // We handle throttling inside the motion handler mostly, but lets keep orientation fresh
        // but not too frequent to avoid react churn if motion isn't firing
        if (Math.random() > 0.5) return; 

        setData(prev => ({
            ...prev,
            orientation: {
                alpha: e.alpha ? parseFloat(e.alpha.toFixed(1)) : null,
                beta: e.beta ? parseFloat(e.beta.toFixed(1)) : null,
                gamma: e.gamma ? parseFloat(e.gamma.toFixed(1)) : null,
            }
        }));
    };

    // --- ACCELEROMETER (MOTION) LOGIC ---
    const handleMotion = (e: DeviceMotionEvent) => {
      const now = Date.now();
      if (now - motionThrottleRef.current < 200) return; // 5Hz update for kinetics is enough for UI
      motionThrottleRef.current = now;

      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;

      // Calculate Magnitude (G-Force)
      const magnitude = Math.sqrt(x*x + y*y + z*z);
      // Standard gravity is ~9.8 m/s^2. Deviation implies movement.
      const delta = Math.abs(magnitude - 9.8);
      
      let kState: 'SEDENTARY' | 'LOCOMOTION' | 'AGITATED' = 'SEDENTARY';
      let tremor = 0;
      let confidence = 98;

      // Determine Kinetic State
      if (delta < 0.8) {
        kState = 'SEDENTARY';
        tremor = delta / 2; // Low noise
      } else if (delta >= 0.8 && delta < 2.5) {
        kState = 'LOCOMOTION';
        tremor = 0.3 + (delta / 10);
        confidence = 85; // Slight drop during movement
      } else {
        kState = 'AGITATED';
        tremor = Math.min(1.0, delta / 8);
        confidence = 45; // Sensors unreliable during heavy shake
      }

      // Determine Posture (combining Orientation + Kinetics)
      // Access current orientation from state setter closure would be stale or complex, 
      // so we rely on the last captured orientation in the state update cycle or assume 
      // orientation event fires nearby. 
      // Ideally we'd use a ref for orientation, but for this effect:
      
      setData(prev => {
        const beta = prev.orientation.beta || 0; // Front/Back tilt
        // const gamma = prev.orientation.gamma || 0; // Left/Right tilt
        
        let posture = "UNKNOWN";

        const isUpright = beta > 45 || beta < -45;
        const isFlat = Math.abs(beta) < 20;

        if (kState === 'AGITATED') {
           posture = "UNSTABLE_HANDLING";
        } else if (kState === 'LOCOMOTION') {
           posture = isFlat ? "MOBILE_CARRY" : "MOBILE_ACTIVE";
        } else {
           // Sedentary
           if (isUpright) posture = "STATIC_UPRIGHT";
           else if (isFlat) posture = "STATIC_RECLINED";
           else posture = "STATIC_IDLE";
        }

        return {
          ...prev,
          kinetics: {
            accelerationMag: parseFloat(magnitude.toFixed(2)),
            kineticState: kState,
            postureReport: posture,
            tremorScore: parseFloat(tremor.toFixed(2)),
            confidence: confidence
          }
        };
      });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return data;
};