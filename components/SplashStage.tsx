
import React from 'react';

interface Props {
  onStart: () => void;
}

export const SplashStage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-black">
      <div className="mb-8 p-4 border border-white max-w-xs">
        <h1 className="text-xl font-black mb-2 tracking-tighter">UNAUTHORIZED_ACCESS_DETECTED</h1>
        <p className="text-xs text-gray-400">HOST: IDGAFFORAWEBSITE.IN</p>
        <p className="text-xs text-gray-400 mt-2">LOCAL_LAYER: MOBILE_EXTERN_01</p>
      </div>
      
      <button 
        onClick={onStart}
        className="group relative px-10 py-4 bg-white text-black font-black text-lg hover:bg-gray-200 active:scale-95 transition-all"
      >
        DECRYPTING_ACCESS
        <div className="absolute -inset-1 border border-white group-hover:inset-0 transition-all pointer-events-none"></div>
      </button>

      <div className="mt-12 animate-pulse text-[10px] text-gray-500 font-mono">
        WAITING_FOR_USER_INPUT_TID: 0x82FF
      </div>
    </div>
  );
};
