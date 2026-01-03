
import React, { useEffect, useState } from 'react';

const ShatterScreen: React.FC = () => {
  const [shattered, setShattered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShattered(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${shattered ? 'bg-neutral-900' : 'bg-black'}`}>
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        
        {!shattered ? (
          <div className="text-center space-y-4 px-10">
            <h1 className="text-2xl font-black uppercase flicker">Analysis Complete</h1>
            <div className="h-0.5 bg-white w-full animate-grow" />
            <p className="text-xs text-neutral-400 font-mono">
              DATA UPLOAD 100% COMPLETE. SUBJECT IS BORING. NO FURTHER SURVEILLANCE REQUIRED.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-1000">
            <div className="text-neutral-500 font-mono text-xs text-center space-y-1">
               <div>[SYSTEM_POWERED_OFF]</div>
               <div>REMAINING_SESSIONS: 0</div>
            </div>
            
            <a 
              href="https://instagram.com/503Error_HumanNotFound" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white border-b border-neutral-700 pb-1 text-sm font-bold tracking-tighter hover:text-blue-500 transition-colors"
            >
              [RECOVER_HUMANITY: @503Error_HumanNotFound]
            </a>
            
            <button 
              onClick={() => window.location.reload()}
              className="text-[9px] text-neutral-700 uppercase"
            >
              re-initialize_hostility
            </button>
          </div>
        )}

        {/* Fake Shatter Fragments */}
        {!shattered && (
          <div className="absolute inset-0 pointer-events-none">
             {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute bg-white opacity-0"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 50}px`,
                    height: `${Math.random() * 2}px`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `flicker ${0.1 + Math.random()}s infinite`
                  }}
                />
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShatterScreen;
