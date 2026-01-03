import React, { useEffect } from 'react';
import { APP_CONFIG } from '../constants';

export const ConclusionScreen: React.FC = () => {
  
  // Urgent SOS Vibration Logic
  useEffect(() => {
    const vibrate = () => {
      // Pattern: 3 Short (100ms), 3 Long (300ms), 3 Short (100ms) - SOS
      // With gaps in between
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([
          100, 50, 100, 50, 100, 200, // S
          300, 100, 300, 100, 300, 200, // O
          100, 50, 100, 50, 100 // S
        ]);
      }
    };

    // Start immediately
    vibrate();

    // Repeat pattern every 2.5 seconds (approx length of pattern + pause)
    const interval = setInterval(vibrate, 2500);

    return () => {
      clearInterval(interval);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(0);
      }
    };
  }, []);

  const handleExit = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-6 text-center">
        <div className="max-w-md w-full border border-sys-grey p-8 relative">
            {/* Corners */}
            <div className="absolute top-[-1px] left-[-1px] w-4 h-4 border-t-2 border-l-2 border-sys-white"></div>
            <div className="absolute top-[-1px] right-[-1px] w-4 h-4 border-t-2 border-r-2 border-sys-white"></div>
            <div className="absolute bottom-[-1px] left-[-1px] w-4 h-4 border-b-2 border-l-2 border-sys-white"></div>
            <div className="absolute bottom-[-1px] right-[-1px] w-4 h-4 border-b-2 border-r-2 border-sys-white"></div>

            <div className="mb-6 space-y-2">
                <p className="text-sys-red text-sm font-bold tracking-widest animate-pulse">SESSION_TERMINATED</p>
                <h1 className="text-2xl font-mono mb-4">DIAGNOSTIC CYCLE: 01</h1>
                <div className="h-px w-full bg-sys-grey my-4"></div>
                <p className="text-sm text-gray-400 font-mono leading-relaxed">
                    RESULT: <span className="text-white">NEGATIVE.</span><br/>
                    ANALYSIS: Subject data holds zero proprietary value.<br/> 
                    Disconnecting...
                </p>
            </div>

            <a 
                href={APP_CONFIG.INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExit}
                className="block w-full bg-sys-white text-sys-black font-bold py-3 px-4 hover:bg-gray-200 transition-colors uppercase text-sm tracking-wider"
            >
                [ SYSTEM_EXIT / {APP_CONFIG.INSTAGRAM_HANDLE} ]
            </a>
            
            <div className="mt-4 text-[10px] text-gray-600 uppercase">
                ERR_CODE: 503_HUMAN_NOT_FOUND
            </div>
        </div>
    </div>
  );
};