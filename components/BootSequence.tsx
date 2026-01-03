
import React, { useState, useEffect } from 'react';

const BOOT_LOGS = [
  "INITIALIZING KERNEL_3.0.1...",
  "BYPASSING LOCAL_FIREWALL_v4...",
  "HOOKING SYSTEM_DOM_ELEMENTS...",
  "LOADING PSYCHOLOGICAL_PROFILES...",
  "ESTABLISHING HOSTILE_PRESENCE...",
  "READY."
];

const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < BOOT_LOGS.length) {
      const timeout = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 600 + Math.random() * 1000);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(onComplete, 1000);
    }
  }, [index, onComplete]);

  return (
    <div className="absolute inset-0 flex flex-col justify-center items-start p-8 font-mono space-y-2">
      <div className="w-full max-w-md">
        {BOOT_LOGS.slice(0, index + 1).map((log, i) => (
          <div key={i} className={`text-sm ${i === index ? 'flicker' : 'opacity-60'}`}>
            <span className="text-green-500 mr-2">[OK]</span>
            {log}
          </div>
        ))}
        <div className="mt-8 h-1 w-full bg-neutral-900 overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-500" 
            style={{ width: `${(index / BOOT_LOGS.length) * 100}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default BootSequence;
