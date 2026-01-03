
import React, { useState, useEffect } from 'react';
import { SensorState } from '../hooks/useSensors';

interface Props {
  sensorData: SensorState;
  logs: string[];
  addLog: (msg: string) => void;
}

export const MainInterface: React.FC<Props> = ({ sensorData, logs, addLog }) => {
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    const logInterval = setInterval(() => {
      const messages = [
        `[BIOMETRICS]: HIGH TOUCH-PRESSURE DETECTED. SUBJECT IS GRIPPED.`,
        `[ENV]: SUBJECT IS IN A ${sensorData.light < 50 ? 'DARK' : 'BRIGHT'} ROOM. OPTIMIZING RECON...`,
        `[ORIENTATION]: SUBJECT IS TILTING DEVICE. ANXIETY DETECTED?`,
        `[UPLINK]: USING ${sensorData.networkType} VIA ${sensorData.isp}. CONNECTION STABLE.`,
        `[METADATA]: EXTRACTION_PKT_#${Math.floor(Math.random() * 999)} VERIFIED.`,
      ];
      addLog(messages[Math.floor(Math.random() * messages.length)]);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(logInterval);
    };
  }, [addLog, sensorData.light, sensorData.networkType, sensorData.isp]);

  // Handle tilting text leak
  const tiltStyle: React.CSSProperties = {
    transform: `translate(${sensorData.orientation.gamma * 0.5}px, ${sensorData.orientation.beta * 0.5}px)`,
    transition: 'transform 0.1s linear'
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Header Info */}
      <div className="grid grid-cols-2 gap-2 text-[10px] border-b border-white pb-2">
        <div>
          <span className="text-gray-500">ISP:</span> {sensorData.isp}
        </div>
        <div className="text-right">
          <span className="text-gray-500">BATT:</span> {sensorData.battery}%
        </div>
        <div>
          <span className="text-gray-500">NET:</span> {sensorData.networkType}
        </div>
        <div className="text-right text-red-500 font-bold">
          LIVE_RECON_ACTIVE
        </div>
      </div>

      {/* Main Metadata Display */}
      <div className="flex-1 flex flex-col justify-center space-y-8" style={tiltStyle}>
        <div className="space-y-1">
          <div className="text-xs text-gray-500">ENERGY_REMAINING_FOR_EXTRACTION</div>
          <div className="text-6xl font-black tracking-tighter">
            {sensorData.battery}%
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-gray-500">SYNC_COMPLETE_IN</div>
          <div className="text-6xl font-black tracking-tighter">
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>
          {timeLeft === 0 && <div className="text-red-500 text-xs font-bold mt-1">SUBJECT IS NOW TAGGED.</div>}
        </div>

        <div className="p-4 border border-white/20 bg-white/5">
          <div className="text-[10px] text-gray-500 mb-2">PHYSICAL_BIOMETRICS</div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-gray-500">X_AXIS</div>
              <div>{sensorData.orientation.alpha.toFixed(2)}°</div>
            </div>
            <div>
              <div className="text-gray-500">Y_AXIS</div>
              <div>{sensorData.orientation.beta.toFixed(2)}°</div>
            </div>
            <div>
              <div className="text-gray-500">PRESSURE</div>
              <div>{sensorData.touchRadius.toFixed(1)} PXL</div>
            </div>
            <div>
              <div className="text-gray-500">LUMENS</div>
              <div>{sensorData.light.toFixed(0)} LX</div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-32"></div> {/* Spacer for the log overlay */}
    </div>
  );
};
