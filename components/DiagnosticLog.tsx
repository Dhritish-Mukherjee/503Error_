
import React from 'react';

interface Props {
  logs: string[];
}

export const DiagnosticLog: React.FC<Props> = ({ logs }) => {
  return (
    <div className="w-full h-32 overflow-hidden flex flex-col-reverse space-y-reverse space-y-1">
      {logs.map((log, i) => (
        <div 
          key={i} 
          className={`text-[9px] font-mono whitespace-nowrap overflow-hidden transition-opacity duration-300 ${i === 0 ? 'text-white' : 'text-gray-600'}`}
          style={{ opacity: 1 - (i * 0.15) }}
        >
          {log}
        </div>
      ))}
    </div>
  );
};
