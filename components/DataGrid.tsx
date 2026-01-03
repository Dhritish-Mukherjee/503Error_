import React from 'react';
import { DiagnosticTile } from './DiagnosticTile';
import { NetworkData, HardwareData, EnvironmentalData, BehavioralData, SessionData } from '../types';

interface DataGridProps {
  network: NetworkData;
  hardware: HardwareData;
  environment: EnvironmentalData;
  behavioral: BehavioralData;
  session: SessionData;
}

export const DataGrid: React.FC<DataGridProps> = ({ network, hardware, environment, behavioral, session }) => {
  const { kinetics, orientation } = behavioral;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-2 md:p-4 h-full md:h-auto overflow-y-auto pb-20">
      
      {/* --- NETWORK LAYER --- */}
      <DiagnosticTile 
        className="col-span-2 md:col-span-2"
        label="IP_ADDRESS // IDENTITY"
        value={network.ip}
        subValue={`${network.isp} [ASN: ${network.asn}]`}
      />
      <DiagnosticTile 
        className="col-span-1"
        label="LAT_COORDS"
        value={network.latitude.toFixed(4)}
      />
      <DiagnosticTile 
        className="col-span-1"
        label="LNG_COORDS"
        value={network.longitude.toFixed(4)}
      />

      {/* --- HARDWARE LAYER --- */}
      <DiagnosticTile 
        className="col-span-2 md:col-span-3 lg:col-span-4"
        label="HARDWARE_IDENTITY // SIGNATURE"
        value={`ID: ${hardware.model}`}
        subValue={`GPU: ${hardware.gpu} | RES: ${hardware.screenRes} | CORES: ${hardware.cores}`}
      />
      
       <DiagnosticTile 
        className="col-span-1 lg:col-span-1"
        label="RAM_BUFFER"
        value={hardware.memory}
      />
      {/* Logic cores moved to main hardware tile for better layout, replaced with platform */}
      <DiagnosticTile 
        className="col-span-1 lg:col-span-1"
        label="KERNEL_ARCH"
        value={hardware.platform.toUpperCase()}
      />

      {/* --- DATABASE LAYER (NEW) --- */}
      <DiagnosticTile 
        className="col-span-2 border-sys-red/30"
        label="SESSION_HISTORY // DB_RECORD"
        value={
          session.status === 'SYNCED' 
            ? `VISIT_COUNT: ${session.visitCount.toString().padStart(3, '0')}` 
            : 'ESTABLISHING_UPLINK...'
        }
        subValue={session.status === 'SYNCED' ? `UID: ${session.fingerprint}` : 'HANDSHAKE_PENDING'}
        isAlert={session.status === 'SYNCED' && session.visitCount > 1}
      />

      {/* --- BEHAVIORAL LAYER --- */}
      <DiagnosticTile 
        className="col-span-1"
        label="INPUT_VELOCITY"
        value={behavioral.touchVelocity}
        subValue="PX/MS (SMOOTHED)"
        isAlert={behavioral.touchVelocity > 3}
      />
      <DiagnosticTile 
        className="col-span-1"
        label="SURFACE_PRESSURE"
        value={behavioral.surfacePressure}
        subValue="KPA_EQUIVALENT"
        isAlert={behavioral.surfacePressure > 0.8}
      />
      
      {/* --- KINETIC & SPATIAL INTELLIGENCE --- */}
      <div className="col-span-2 border border-sys-grey bg-sys-black p-4 relative overflow-hidden group hover:border-sys-white transition-colors duration-300">
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-sys-white opacity-50"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-sys-white opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-sys-white opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-sys-white opacity-50"></div>

          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs text-gray-500 uppercase tracking-widest">BIO_KINETICS // SPATIAL</h3>
            <div className="text-[10px] text-sys-red animate-pulse">
                CONFIDENCE: {kinetics.confidence}%
            </div>
          </div>

          <div className="flex items-center gap-4">
              {/* Wireframe Cube Visualization */}
              <div className="w-12 h-12 perspective-[100px] relative shrink-0">
                  <div 
                    className="w-8 h-8 absolute top-2 left-2 border border-sys-white/80 transition-transform duration-100 ease-linear"
                    style={{
                        transform: `
                            rotateX(${orientation.beta || 0}deg) 
                            rotateY(${orientation.gamma || 0}deg)
                            translate3d(${Math.random() * kinetics.tremorScore * 5}px, ${Math.random() * kinetics.tremorScore * 5}px, 0)
                        `
                    }}
                  >
                      {/* Inner Crosshair */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-50">
                          <div className="w-full h-px bg-sys-white"></div>
                          <div className="h-full w-px bg-sys-white absolute"></div>
                      </div>
                  </div>
              </div>

              {/* Text Data */}
              <div className="font-mono flex-1">
                  <div className="text-sm font-bold text-white leading-none mb-1">
                      {kinetics.postureReport}
                  </div>
                  <div className="text-[10px] text-gray-400">
                      STATE: <span className={kinetics.kineticState === 'AGITATED' ? 'text-sys-red animate-pulse' : 'text-sys-white'}>
                          {kinetics.kineticState}
                      </span>
                  </div>
                  <div className="text-[10px] text-gray-400">
                      LOAD: {kinetics.accelerationMag.toFixed(2)} G
                  </div>
              </div>
          </div>

          {/* Kinetic Waveform / Jitter Bar */}
          <div className="mt-3 w-full h-1 bg-sys-grey/30 relative overflow-hidden">
              <div 
                  className={`absolute top-0 left-0 h-full bg-sys-white transition-all duration-75 ease-out ${kinetics.kineticState === 'AGITATED' ? 'bg-sys-red' : ''}`}
                  style={{ width: `${Math.min(100, (kinetics.tremorScore * 100) + 5)}%` }}
              ></div>
          </div>
      </div>


      {/* --- ENVIRONMENT LAYER --- */}
      <DiagnosticTile 
        className="col-span-2"
        label="LOCAL_TIME_SYNC"
        value={environment.localTime}
        subValue={`ZONE: ${network.timezone} | CURRENCY: ${network.currency}`}
      />
      {/* Removed Moon Phase to make room for DB Record, Atmosphere remains */}
      <DiagnosticTile 
        className="col-span-2"
        label="ATMOSPHERE"
        value={environment.weatherStatus}
      />
    </div>
  );
};