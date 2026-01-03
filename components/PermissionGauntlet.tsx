
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onGranted: () => void;
  onDenied: () => void;
  addLog: (msg: string) => void;
}

export const PermissionGauntlet: React.FC<Props> = ({ onGranted, onDenied, addLog }) => {
  const [currentPrompt, setCurrentPrompt] = useState<'LOC' | 'CAM' | 'MIC'>('LOC');
  const [attempts, setAttempts] = useState(0);
  const isRequesting = useRef(false);

  const requestNext = async () => {
    if (isRequesting.current) return;
    isRequesting.current = true;

    try {
      if (currentPrompt === 'LOC') {
        addLog("[PROMPT]: REQUESTING_LOCATION_SYNC");
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        setCurrentPrompt('CAM');
        addLog("[AUTH]: GEOLOCATION_LINK_SECURED");
      } else if (currentPrompt === 'CAM') {
        addLog("[PROMPT]: ESTABLISHING_BIOMETRIC_VISUAL");
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCurrentPrompt('MIC');
        addLog("[AUTH]: OPTICAL_FEED_STABLE");
      } else if (currentPrompt === 'MIC') {
        addLog("[PROMPT]: ANALYZING_AMBIENT_SPECTRUM");
        await navigator.mediaDevices.getUserMedia({ audio: true });
        addLog("[AUTH]: ACOUSTIC_CAPTURE_LIVE");
        onGranted();
      }
    } catch (err) {
      onDenied();
      setAttempts(prev => prev + 1);
    } finally {
      isRequesting.current = false;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      requestNext();
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentPrompt, attempts]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-black">
      <div className="w-full max-w-sm border border-white p-6 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span>TASK_SEQUENCE</span>
          <span className="animate-pulse">RUNNING</span>
        </div>
        
        <div className="h-2 w-full bg-gray-900 overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-500" 
            style={{ width: `${(attempts % 10) * 10}%` }}
          />
        </div>

        <div className="py-10 text-center">
          <div className="text-4xl font-black mb-2">
            {currentPrompt === 'LOC' && 'SYNC_LOC'}
            {currentPrompt === 'CAM' && 'LINK_EYE'}
            {currentPrompt === 'MIC' && 'LINK_EAR'}
          </div>
          <p className="text-xs text-gray-400">
            {attempts > 0 ? `RE-ATTEMPTING: CYCLE_${attempts}` : 'WAITING_FOR_OS_CONSENT...'}
          </p>
        </div>

        <button 
          onClick={requestNext}
          className="w-full py-4 bg-white text-black font-bold active:bg-red-600 active:text-white transition-colors"
        >
          BYPASS_PERMISSION_BLOCK
        </button>
      </div>
    </div>
  );
};
