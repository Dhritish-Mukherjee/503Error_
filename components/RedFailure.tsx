
import React from 'react';

const RedFailure: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-red-900 flex flex-col items-center justify-center p-8 text-white font-mono">
      <div className="border-4 border-white p-6 max-w-sm text-center space-y-4">
        <h1 className="text-4xl font-black italic underline">SYSTEM_FAILURE</h1>
        <p className="text-sm font-bold uppercase leading-tight">
          Subject is attempting to hide. Deploying alternative tracking. Encryption keys compromised. 
          Local authorities notified of non-compliance.
        </p>
        <div className="animate-pulse bg-white text-red-900 py-1 text-xs">
          ERASING_DEVICE_FOOTPRINT... 48%
        </div>
      </div>
      <div className="mt-12 text-[8px] opacity-50 uppercase">
        ID_0009231-FAIL-SEC-CRITICAL
      </div>
    </div>
  );
};

export default RedFailure;
