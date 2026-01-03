
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onVerified: () => void;
}

const BiometricHold: React.FC<Props> = ({ onVerified }) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startHold = () => {
    setHolding(true);
    if ("vibrate" in navigator) navigator.vibrate(50);
    timerRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleSuccess();
          return 100;
        }
        if ("vibrate" in navigator) navigator.vibrate(10);
        return prev + 2;
      });
    }, 50);
  };

  const stopHold = () => {
    setHolding(false);
    setProgress(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSuccess = () => {
    setConfirmed(true);
    if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
    setTimeout(() => {
      onVerified();
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-[60] bg-black flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-xl font-black flicker uppercase tracking-tighter">Identity_Verification_Required</h2>
        <p className="text-[10px] text-neutral-500 uppercase max-w-xs">
          Place thumb on scanner to authorize biometric handshake. do not remove until handshake is complete.
        </p>
      </div>

      <div className="relative group">
        {/* Laser Animation */}
        {holding && !confirmed && (
          <div 
            className="absolute left-[-20%] right-[-20%] h-0.5 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] z-10 pointer-events-none"
            style={{ 
              top: `${progress}%`,
              transition: 'top 0.05s linear'
            }}
          />
        )}

        <button
          onPointerDown={startHold}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          className={`relative w-32 h-44 border-2 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
            ${confirmed ? 'border-green-500 bg-green-900/20' : holding ? 'border-red-500 bg-red-900/10' : 'border-neutral-700'}
          `}
        >
          {/* Fingerprint Icon Simulation */}
          <div className="opacity-20 flex flex-col space-y-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-1 w-12 rounded-full bg-white" style={{ opacity: 1 - (i * 0.08) }} />
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-white/10 transition-all duration-75" style={{ height: `${progress}%` }} />
          
          <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px] uppercase">
            {confirmed ? "IDENT_CONFIRMED" : holding ? "SCANNING..." : "HOLD_THUMB"}
          </div>
        </button>
      </div>

      {confirmed && (
        <div className="mt-8 text-green-500 font-bold text-xs animate-pulse">
          SUBJECT_RECOGNIZED: ACCESS_GRANTED
        </div>
      )}
    </div>
  );
};

export default BiometricHold;
