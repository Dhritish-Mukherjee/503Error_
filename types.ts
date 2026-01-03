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
  model: string;
}

export interface EnvironmentalData {
  moonPhase: string;
  weatherStatus: string;
  localTime: string;
}

export interface BehavioralData {
  touchVelocity: number; // pixels per ms * 100 or similar scale
  surfacePressure: number; // Synthetic pressure value (0.0 - 1.0+)
  orientation: {
    alpha: number | null;
    beta: number | null; // Front/Back tilt
    gamma: number | null; // Left/Right tilt
  };
  kinetics: {
    accelerationMag: number; // Total G-Force magnitude
    kineticState: 'SEDENTARY' | 'LOCOMOTION' | 'AGITATED';
    postureReport: string; // Combined inferred state (e.g. STATIC_UPRIGHT)
    tremorScore: number; // 0.0 - 1.0 jitter intensity
    confidence: number; // % confidence in reading
  };
  hasFocus: boolean;
}

export interface SessionData {
  fingerprint: string;
  visitCount: number;
  status: 'CONNECTING' | 'SYNCED' | 'OFFLINE';
}

export type AppPhase = 'OBSERVING' | 'PURGING' | 'DISCONNECTED';