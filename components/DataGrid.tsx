import React from 'react';
import { DiagnosticTile } from './DiagnosticTile';
import { NetworkData, HardwareData, EnvironmentalData, BehavioralData } from '../types';

interface DataGridProps {
  network: NetworkData;
  hardware: HardwareData;
  environment: EnvironmentalData;
  behavioral: BehavioralData;
}

export const DataGrid: React.FC<DataGridProps> = ({ network, hardware, environment, behavioral }) => {
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
        label="GPU_RENDERER // UNMASKED"
        value={hardware.gpu}
        subValue={`RES: ${hardware.screenRes} | PLATFORM: ${hardware.platform}`}
      />
      
      <DiagnosticTile 
        className="col-span-1 lg:col-span-1"
        label="LOGIC_CORES"
        value={`${hardware.cores} THREADS`}
      />
       <DiagnosticTile 
        className="col-span-1 lg:col-span-1"
        label="RAM_BUFFER"
        value={hardware.memory}
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
        label="CONTACT_RADIUS"
        value={behavioral.contactRadius}
        subValue="SURFACE IMPACT AREA"
      />
      <DiagnosticTile 
        className="col-span-2"
        label="DEVICE_GYRO"
        value={behavioral.orientation.beta ? 
               `X:${behavioral.orientation.beta} Y:${behavioral.orientation.gamma}` : 
               "GYRO_LOCKED_OR_STATIONARY"}
        subValue="AXIAL TILT"
      />

      {/* --- ENVIRONMENT LAYER --- */}
      <DiagnosticTile 
        className="col-span-2"
        label="LOCAL_TIME_SYNC"
        value={environment.localTime}
        subValue={`ZONE: ${network.timezone} | CURRENCY: ${network.currency}`}
      />
      <DiagnosticTile 
        className="col-span-1"
        label="LUNAR_PHASE"
        value={environment.moonPhase}
      />
      <DiagnosticTile 
        className="col-span-1"
        label="ATMOSPHERE"
        value={environment.weatherStatus}
      />
    </div>
  );
};
