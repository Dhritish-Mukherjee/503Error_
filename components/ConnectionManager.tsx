
import React, { useState } from 'react';

interface Props {
  onSuccess: () => void;
  onFailure: () => void;
}

const ConnectionManager: React.FC<Props> = ({ onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("CONNECTION_UNSTABLE");

  const requestStabilization = async () => {
    setLoading(true);
    setStatus("STABILIZING_GYROSCOPE...");
    
    try {
      // 1. Motion Sensors
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') throw new Error("Motion Denied");
      }

      setStatus("SCANNING_SUBJECT_PRESENCE...");
      
      // 2. Camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (stream) {
        // We'll keep the stream and use it in Dashboard
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      onFailure();
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter flicker">SIGNAL_LOSS</h1>
        <p className="text-neutral-400 text-xs max-w-xs uppercase">
          Device telemetry is currently fragmented. Stabilize the internal bridge to maintain subject synchronization.
        </p>
      </div>

      <button 
        onClick={requestStabilization}
        disabled={loading}
        className="px-10 py-4 border-2 border-white hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-widest disabled:opacity-50"
      >
        {loading ? status : "STABILIZE_CONNECTION"}
      </button>

      <div className="text-[10px] text-neutral-600 font-mono absolute bottom-12">
        FAILURE TO STABILIZE MAY RESULT IN [DATA_CORRUPTION]
      </div>
    </div>
  );
};

export default ConnectionManager;
