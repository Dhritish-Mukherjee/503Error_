import React from 'react';

interface DiagnosticTileProps {
  label: string;
  value: string | number | React.ReactNode;
  subValue?: string;
  className?: string;
  isAlert?: boolean;
}

export const DiagnosticTile: React.FC<DiagnosticTileProps> = ({ 
  label, 
  value, 
  subValue, 
  className = "",
  isAlert = false
}) => {
  return (
    <div className={`border border-sys-grey bg-sys-black p-4 flex flex-col justify-between h-full relative overflow-hidden group hover:border-sys-white transition-colors duration-300 ${className}`}>
      {/* Decorative Corner Markers */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-sys-white opacity-50"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-sys-white opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-sys-white opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-sys-white opacity-50"></div>

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs text-gray-500 uppercase tracking-widest">{label}</h3>
        {isAlert && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-fast"></div>}
      </div>
      
      <div className="font-mono break-all text-sys-white">
        <div className="text-sm md:text-base font-bold leading-tight">
          {value}
        </div>
        {subValue && (
          <div className="text-xs text-gray-400 mt-1">
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
};
