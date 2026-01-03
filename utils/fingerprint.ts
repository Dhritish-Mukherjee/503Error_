import { HardwareData } from '../types';

export const generateFingerprint = (hardware: HardwareData): string => {
  // Combine immutable hardware characteristics
  // We avoid mutable data like battery level or IP
  const components = [
    hardware.model,             // e.g. APPLE_IPHONE_15_PRO
    hardware.gpu,               // e.g. Apple GPU
    hardware.screenRes,         // e.g. 390x844
    hardware.platform,          // e.g. iPhone
    hardware.cores,             // e.g. 6
    navigator.language          // e.g. en-US
  ];

  const signature = components.join('|');

  // Simple string hashing (DJB2 variant) for client-side ID generation
  let hash = 5381;
  for (let i = 0; i < signature.length; i++) {
    hash = (hash * 33) ^ signature.charCodeAt(i);
  }

  // Convert to hex and pad
  const hashHex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  
  // Prefix with 'UID-' for clinical aesthetic
  return `UID-${hashHex}`;
};