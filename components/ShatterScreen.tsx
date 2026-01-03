
import React, { useEffect, useState } from 'react';

export const ShatterScreen: React.FC = () => {
  const [shattered, setShattered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShattered(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center p-8">
      {/* Fragments container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {shattered && Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="shatter-fragment"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg) translate(${Math.random() * 500 - 250}px, ${Math.random() * 1000 + 200}px)`,
              opacity: 0,
              zIndex: 50
            }}
          />
        ))}
      </div>

      <div className={`transition-all duration-1000 ${shattered ? 'scale-90 opacity-100' : 'scale-110 opacity-0'}`}>
        <div className="bg-gray-800 border-2 border-gray-600 p-8 max-w-sm text-center space-y-6">
          <div className="text-xs text-gray-500 border-b border-gray-600 pb-2">SESSION_TERMINATED</div>
          
          <div className="text-sm font-bold text-gray-300 leading-relaxed">
            "DATA PACKET #842 CORRUPTED. RESULT: SUBJECT IS AVERAGE. DELETING LOCAL CACHE. YOU ARE FREE TO LEAVE."
          </div>

          <a 
            href="https://github.com" 
            className="block py-4 border border-gray-500 text-[10px] text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          >
            [CLOSE_CONNECTION_TO_@503Error_HumanNotFound]
          </a>
        </div>
      </div>
    </div>
  );
};
