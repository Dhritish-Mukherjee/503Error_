export interface NetworkData {
  ip: string;
  isp: string;
  asn: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currency: string;
}

export interface HardwareData {
  gpu: string;
  cores: number;
  memory: number | string; // memory can be 'Unknown' or number
  platform: string;
  screenRes: string;
}

export interface EnvironmentalData {
  moonPhase: string;
  weatherStatus: string;
  localTime: string;
}

export interface BehavioralData {
  touchVelocity: number; // pixels per ms * 100 or similar scale
  contactRadius: number;
  orientation: {
    alpha: number | null;
    beta: number | null; // Front/Back tilt
    gamma: number | null; // Left/Right tilt
  };
  hasFocus: boolean;
}

export type AppPhase = 'OBSERVING' | 'PURGING' | 'DISCONNECTED';
