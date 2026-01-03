
import React, { useState, useEffect } from 'react';
import { AppStage } from '../types';

interface Props {
  stage: AppStage;
  onFlash: () => void;
}

const SystemPopups: React.FC<Props> = ({ stage, onFlash }) => {
  const [showBattery, setShowBattery] = useState(false);
  const [vibrateInterval, setVibrateInterval] = useState<number | null>(null);

  useEffect(() => {
    if (stage !== AppStage.ACTIVE) return;

    // Random Battery Warning
    const batteryTimer = setTimeout(() => {
      setShowBattery(true);
    }, 15000);

    // Random Brightness Attacks
    const brightnessTimer = setInterval(() => {
      if (Math.random() > 0.8) {
        onFlash();
      }
    }, 10000);

    // Heartbeat Vibration (Android Only)
    if ("vibrate" in navigator) {
      const vInterval = window.setInterval(() => {
        navigator.vibrate([100, 30, 100]);
      }, 2000);
      setVibrateInterval(vInterval);
    }

    return () => {
      clearTimeout(batteryTimer);
      clearInterval(brightnessTimer);
      if (vibrateInterval) clearInterval(vibrateInterval);
    };
  }, [stage, onFlash]);

  if (!showBattery) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-10">
      <div className="bg-[#2c2c2e] text-white rounded-2xl w-full max-w-[280px] overflow-hidden font-sans border border-neutral-700 shadow-2xl">
        <div className="p-5 text-center space-y-1">
          <h3 className="font-bold text-lg">Low Battery</h3>
          <p className="text-sm">1% of battery remaining.</p>
        </div>
        <div className="flex border-t border-neutral-700">
          <button 
            onClick={() => setShowBattery(false)}
            className="flex-1 py-3 text-[#0a84ff] font-bold active:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
        <div className="px-4 pb-4 text-[10px] text-center text-red-500 font-mono italic">
          "I'll let you go when the power dies."
        </div>
      </div>
    </div>
  );
};

export default SystemPopups;
