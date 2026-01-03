
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DiagnosticLog } from './components/DiagnosticLog';
import { SplashStage } from './components/SplashStage';
import { PermissionGauntlet } from './components/PermissionGauntlet';
import { MainInterface } from './components/MainInterface';
import { ShatterScreen } from './components/ShatterScreen';
import { useSensors } from './hooks/useSensors';

export enum AppStage {
  SPLASH,
  PERMISSIONS,
  ACTIVE,
  SHATTERED
}

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.SPLASH);
  const [logs, setLogs] = useState<string[]>([]);
  const [isGlitched, setIsGlitched] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const sensorData = useSensors();
  const timerRef = useRef<number | null>(null);

  const addLog = useCallback((msg: string) => {
    // FIX: Manually formatting milliseconds to avoid TypeScript error where 'fractionalSecondDigits' is missing from DateTimeFormatOptions
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour12: false });
    const ms = now.getMilliseconds().toString().padStart(3, '0');
    const timestamp = `${time}.${ms}`;
    setLogs(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 50));
    
    // Haptic feedback (Android only)
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  }, []);

  useEffect(() => {
    // Tab Manipulation - Ghost notifications
    let interval: number;
    if (stage === AppStage.ACTIVE) {
      interval = window.setInterval(() => {
        const titles = [
          "(1) Instagram: New Message",
          "SYSTEM MALFUNCTION",
          "RE-SYNCING...",
          "DATA EXTRACTION 84%"
        ];
        document.title = titles[Math.floor(Math.random() * titles.length)];
      }, 3000);
    } else {
      document.title = "HOSTILE_ENTITY";
    }
    return () => clearInterval(interval);
  }, [stage]);

  const triggerGlitch = useCallback(() => {
    setIsGlitched(true);
    setTimeout(() => setIsGlitched(false), 200);
  }, []);

  const triggerAlert = useCallback(() => {
    setIsAlert(true);
    setTimeout(() => setIsAlert(false), 100);
    addLog("ERR: USER_RESISTANCE_DETECTED. RE-ATTEMPTING...");
  }, [addLog]);

  const handleStart = () => {
    // Request Fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    setStage(AppStage.PERMISSIONS);
    addLog("DECRYPTING_ACCESS: Initializing host handshake...");
  };

  const handlePermissionsGranted = () => {
    setStage(AppStage.ACTIVE);
    addLog("AUTH_SUCCESS: All biometric links established.");
    
    // Set timer for the Indifference Ending
    timerRef.current = window.setTimeout(() => {
      setStage(AppStage.SHATTERED);
    }, 45000);
  };

  return (
    <div className={`relative h-screen w-screen bg-black text-white font-mono uppercase overflow-hidden select-none touch-none ${isAlert ? 'bg-red-900/50' : ''}`}>
      <div className={`scanline ${stage === AppStage.ACTIVE ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className={`h-full w-full transition-transform duration-75 ${isGlitched ? 'glitch-tear active' : ''}`}>
        {stage === AppStage.SPLASH && (
          <SplashStage onStart={handleStart} />
        )}

        {stage === AppStage.PERMISSIONS && (
          <PermissionGauntlet 
            onGranted={handlePermissionsGranted} 
            onDenied={triggerAlert}
            addLog={addLog}
          />
        )}

        {stage === AppStage.ACTIVE && (
          <MainInterface 
            sensorData={sensorData} 
            logs={logs} 
            addLog={addLog} 
          />
        )}

        {stage === AppStage.SHATTERED && (
          <ShatterScreen />
        )}
      </div>

      {/* Persistent Bottom Log Overlay for Active Stage */}
      {stage === AppStage.ACTIVE && (
        <div className="absolute bottom-0 left-0 w-full p-4 pointer-events-none">
          <DiagnosticLog logs={logs} />
        </div>
      )}
    </div>
  );
};

export default App;
