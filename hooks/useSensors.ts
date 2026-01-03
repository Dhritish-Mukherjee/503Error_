
import { useState, useEffect } from 'react';

export interface SensorState {
  battery: number;
  networkType: string;
  isp: string;
  orientation: { alpha: number; beta: number; gamma: number };
  touchRadius: number;
  light: number;
}

export const useSensors = (): SensorState => {
  const [state, setState] = useState<SensorState>({
    battery: 100,
    networkType: 'UNKNOWN',
    isp: 'GENERIC_ISP',
    orientation: { alpha: 0, beta: 0, gamma: 0 },
    touchRadius: 0,
    light: 0,
  });

  useEffect(() => {
    // Battery
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        setState(s => ({ ...s, battery: Math.floor(batt.level * 100) }));
        batt.addEventListener('levelchange', () => {
          setState(s => ({ ...s, battery: Math.floor(batt.level * 100) }));
        });
      });
    }

    // Network & ISP
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      setState(s => ({ 
        ...s, 
        networkType: conn.effectiveType?.toUpperCase() || 'WIRED',
        isp: 'CARRIER_UPLINK_0x1'
      }));
    }

    // Device Orientation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setState(s => ({
        ...s,
        orientation: {
          alpha: e.alpha || 0,
          beta: e.beta || 0,
          gamma: e.gamma || 0
        }
      }));
    };
    window.addEventListener('deviceorientation', handleOrientation);

    // Touch Pressure/Area
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setState(s => ({
          ...s,
          touchRadius: (touch as any).radiusX || 20
        }));
      }
    };
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('touchmove', handleTouch);

    // Light Sensor (Experimental/Mocked for Hostility)
    // Most browsers require a specific flag, so we mock dynamic noise based on accelerometer 
    // to simulate "seeing" the environment.
    const mockLight = setInterval(() => {
      setState(s => ({ ...s, light: Math.random() * 100 + (Math.abs(s.orientation.beta) * 2) }));
    }, 2000);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      clearInterval(mockLight);
    };
  }, []);

  return state;
};
