
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppStage, TouchPoint, HardwareInfo } from './types';
import BootSequence from './components/BootSequence';
import ConnectionManager from './components/ConnectionManager';
import MonitoringDashboard from './components/MonitoringDashboard';
import RedFailure from './components/RedFailure';
import ShatterScreen from './components/ShatterScreen';
import SystemPopups from './components/SystemPopups';
import BiometricHold from './components/BiometricHold';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.BOOT);
  const [touches, setTouches] = useState<TouchPoint[]>([]);
  const [currentTouch, setCurrentTouch] = useState<{x: number, y: number} | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [hardware, setHardware] = useState<HardwareInfo>({
    ram: 'Unknown',
    battery: 'Unknown',
    isp: 'Local Node',
    timeOnSite: 0
  });
  const [showBrightnessAttack, setShowBrightnessAttack] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const startTimeRef = useRef<number>(Date.now());

  // Capture Hardware & Browser Info
  useEffect(() => {
    const updateStats = async () => {
      // @ts-ignore
      const ram = navigator.deviceMemory || '4+';
      const isp = 'Comcast/Xfinity Restricted Node';
      
      let battery: number | string = 'Unknown';
      if ('getBattery' in navigator) {
        try {
          const b = await (navigator as any).getBattery();
          battery = b.level;
        } catch (e) {
          console.debug("Battery API not supported or blocked");
        }
      }
      
      setHardware(prev => ({
        ...prev,
        ram,
        isp,
        battery,
        timeOnSite: Math.floor((Date.now() - startTimeRef.current) / 1000)
      }));
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  // Tracking Touches
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const newTouch = { x: e.clientX, y: e.clientY, time: Date.now() };
    setCurrentTouch({ x: e.clientX, y: e.clientY });
    setTouches(prev => [...prev.slice(-100), newTouch]);
  }, []);

  // System Pranks
  const triggerBrightnessAttack = useCallback(() => {
    setShowBrightnessAttack(true);
    setFlashMessage("I SEE YOU BETTER IN THE LIGHT.");
    setTimeout(() => {
      setShowBrightnessAttack(false);
      setFlashMessage(null);
    }, 1500);
  }, []);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  return (
    <div 
      className={`relative w-screen h-screen overflow-hidden select-none touch-none ${stage === AppStage.FAILURE ? 'bg-red-900' : 'bg-black'}`}
      onPointerMove={handlePointerMove}
    >
      <div className="absolute inset-0 scanline z-50 pointer-events-none opacity-30" />
      
      {/* Heartbeat Pulse Effect */}
      <div className={`w-full h-full heartbeat ${stage === AppStage.ACTIVE ? 'opacity-100' : 'opacity-0'}`}>
        <MonitoringDashboard 
          touches={touches} 
          currentTouch={currentTouch}
          hardware={hardware}
          stream={mediaStream}
          onShatter={() => setStage(AppStage.SHATTERED)}
        />
      </div>

      {stage === AppStage.BOOT && (
        <BootSequence onComplete={() => setStage(AppStage.CONNECTION)} />
      )}

      {stage === AppStage.CONNECTION && (
        <ConnectionManager 
          onSuccess={(stream) => {
            setMediaStream(stream);
            setStage(AppStage.STABILIZING);
          }} 
          onFailure={() => setStage(AppStage.FAILURE)}
        />
      )}

      {stage === AppStage.STABILIZING && (
        <BiometricHold onVerified={() => setStage(AppStage.ACTIVE)} />
      )}

      {stage === AppStage.FAILURE && (
        <RedFailure />
      )}

      {stage === AppStage.SHATTERED && (
        <ShatterScreen />
      )}

      {/* Overlays */}
      <SystemPopups stage={stage} hardware={hardware} onFlash={triggerBrightnessAttack} />

      {/* Brightness Attack */}
      {showBrightnessAttack && (
        <div className="fixed inset-0 bg-white z-[999] flex items-center justify-center">
          <h1 className="text-black font-extrabold text-4xl text-center px-10">
            {flashMessage}
          </h1>
        </div>
      )}

      {/* Mix-Blend Filter */}
      <div 
        className="fixed pointer-events-none mix-diff bg-white w-40 h-40 rounded-full blur-3xl opacity-20 transition-all duration-75"
        style={{
          left: (currentTouch?.x || 0) - 80,
          top: (currentTouch?.y || 0) - 80,
        }}
      />
    </div>
  );
};

export default App;
