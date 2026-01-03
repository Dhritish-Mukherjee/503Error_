
export enum AppStage {
  BOOT = 'BOOT',
  CONNECTION = 'CONNECTION',
  STABILIZING = 'STABILIZING',
  ACTIVE = 'ACTIVE',
  FAILURE = 'FAILURE',
  SHATTERED = 'SHATTERED'
}

export interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export interface HardwareInfo {
  ram: number | string;
  battery: number | string;
  isp: string;
  timeOnSite: number;
}
