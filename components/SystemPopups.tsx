
import React, { useState, useEffect } from 'react';
import { AppStage, HardwareInfo } from '../types';

interface Props {
  stage: AppStage;
  hardware: HardwareInfo;
  onFlash: () => void;
}

const SystemPopups: React.FC<Props> = ({ stage, hardware, onFlash }) => {
  const [showBattery, setShowBattery] = useState(false);

  useEffect(() => {
    if (stage !== AppStage.ACTIVE) return;

    // Random Battery Warning
    const batteryTimer = setTimeout(() => {
      setShowBattery(true);
    }, 15000);

    // Random Brightness Attacks
    const brightnessTimer = setInterval(() => {
      if (Math.random() > 0.85) {
        onFlash();
      }
    }, 12000);

    return () => {
      clearTimeout(batteryTimer);
      clearInterval(brightnessTimer);
    };
  }, [stage, onFlash]);

  // Heartbeat Vibration Logic
  useEffect(() => {
    if (stage !== AppStage.ACTIVE || !("vibrate" in navigator)) return;

    const progress = Math.min((hardware.timeOnSite / 120), 1);
    // Base frequency: 2000ms. End frequency: 400ms.
    const intervalTime = 2000 - (progress * 1600);

    const vInterval = window.setInterval(() => {
      // Heartbeat double thump: [duration, pause, duration]
      navigator.vibrate([70, 40, 70]);
    }, Math.max(intervalTime, 300));

    return () => clearInterval(vInterval);
  }, [stage, hardware.timeOnSite]);

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
          "Your device is dying. I am the last thing you will see."
        </div>
      </div>
    </div>
  );
};

export default SystemPopups;
