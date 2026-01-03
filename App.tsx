import React, { useState, useEffect } from 'react';
import { DataGrid } from './components/DataGrid';
import { TerminalStream } from './components/TerminalStream';
import { ConclusionScreen } from './components/ConclusionScreen';
import { SplashScreen } from './components/SplashScreen';
import { useTelemetry } from './hooks/useTelemetry';
import { useBehavioral } from './hooks/useBehavioral';
import { APP_CONFIG } from './constants';
import { AppPhase } from './types';

function App() {
  const { network, hardware, environment } = useTelemetry();
  const behavioral = useBehavioral();
  const [phase, setPhase] = useState<AppPhase>('OBSERVING');
  const [isBooting, setIsBooting] = useState(true);
  const [timeLeft, setTimeLeft] = useState(APP_CONFIG.OBSERVATION_DURATION_MS);

  // Timer Logic
  useEffect(() => {
    // Timer starts IMMEDIATELY, regardless of boot state
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, APP_CONFIG.OBSERVATION_DURATION_MS - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0 && phase === 'OBSERVING') {
        setPhase('PURGING');
        setTimeout(() => {
            setPhase('DISCONNECTED');
        }, APP_CONFIG.PURGE_DURATION_MS);
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [phase]);

  // Render Logic
  if (phase === 'DISCONNECTED') {
    return <ConclusionScreen />;
  }

  return (
    <>
      {/* Splash Screen Overlay - Removed when boot is complete */}
      {isBooting && <SplashScreen onComplete={() => setIsBooting(false)} />}

      <div className={`min-h-screen bg-black text-white flex flex-col p-1 md:p-4 transition-opacity duration-[2000ms] ${phase === 'PURGING' ? 'opacity-0 scale-95 grayscale' : 'opacity-100'}`}>
        
        {/* Header / Status Bar */}
        <header className="flex justify-between items-end border-b border-sys-grey pb-2 mb-2 px-2">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tighter">CLINICAL_OBSERVER</h1>
            <p className="text-[10px] text-gray-500">
              SESSION_ID: {Date.now().toString(16).toUpperCase()} // MODE: PASSIVE
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-sys-red animate-pulse">
               RECORDING_ACTIVE
            </div>
            <div className="text-2xl font-mono">
               {(timeLeft / 1000).toFixed(2)}s
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col md:flex-row gap-2 overflow-hidden">
          
          {/* Left Col: Data Grid */}
          <div className="flex-[3] border border-sys-grey bg-black/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-1 bg-sys-white text-sys-black text-[10px] font-bold z-10">
                  LIVE_TELEMETRY
               </div>
               <DataGrid 
                  network={network}
                  hardware={hardware}
                  environment={environment}
                  behavioral={behavioral}
               />
          </div>

          {/* Right Col: Terminal (Mobile: Bottom) */}
          <div className="flex-1 h-48 md:h-auto min-h-[200px] border-t md:border-t-0 md:border-l border-sys-grey">
              <TerminalStream hasFocus={behavioral.hasFocus} phase={phase} />
          </div>

        </main>

        {/* Footer */}
        <footer className="mt-2 text-[10px] text-gray-600 flex justify-between px-2 uppercase">
          <span>sys_v1.0.4 // build_release</span>
          <span>{behavioral.hasFocus ? "SUBJECT_FOCUSED" : "SUBJECT_DISTRACTED"}</span>
        </footer>

      </div>
    </>
  );
}

export default App;