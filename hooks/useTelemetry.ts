import { useState, useEffect, useRef } from 'react';
import { NetworkData, HardwareData, EnvironmentalData } from '../types';
import { DEFAULT_NETWORK_DATA } from '../constants';
import { getGpuRenderer } from '../utils/webgl';
import { getMoonPhase, getSolarStatus } from '../utils/astronomy';

export const useTelemetry = () => {
  const [network, setNetwork] = useState<NetworkData>(DEFAULT_NETWORK_DATA);
  const [hardware, setHardware] = useState<HardwareData>({
    gpu: 'ANALYZING...',
    cores: 0,
    memory: 0,
    platform: 'UNKNOWN',
    screenRes: '0x0',
  });
  const [environment, setEnvironment] = useState<EnvironmentalData>({
    moonPhase: 'CALCULATING...',
    weatherStatus: 'AWAITING_COORDS',
    localTime: new Date().toISOString(),
  });

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      setEnvironment(prev => ({
        ...prev,
        localTime: new Date().toLocaleTimeString('en-US', { hour12: false })
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hardware Fetch (Immediate)
  useEffect(() => {
    const nav = navigator as any;
    setHardware({
      gpu: getGpuRenderer(),
      cores: nav.hardwareConcurrency || 1,
      memory: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'UNAVAILABLE',
      platform: nav.platform || 'UNKNOWN_ARCH',
      screenRes: `${window.screen.width}x${window.screen.height}`
    });
  }, []);

  // Network & Weather Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. IP Logic
        const ipRes = await fetch('https://ipwho.is/');
        const ipData = await ipRes.json();

        if (ipData.success) {
          const netData: NetworkData = {
            ip: ipData.ip,
            isp: ipData.connection?.isp || ipData.connection?.org || 'UNKNOWN',
            asn: ipData.connection?.asn ? `ASN${ipData.connection.asn}` : '---',
            city: ipData.city,
            country: ipData.country,
            latitude: ipData.latitude,
            longitude: ipData.longitude,
            timezone: ipData.timezone?.id || 'UTC',
            currency: ipData.currency?.code || 'USD'
          };
          setNetwork(netData);

          // 2. Environment Logic (Dependent on Coords)
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${netData.latitude}&longitude=${netData.longitude}&current_weather=true`
          );
          const weatherData = await weatherRes.json();
          
          let wStatus = 'CLEAR';
          const wCode = weatherData.current_weather?.weathercode;
          // Simple WMO code mapping
          if (wCode > 0 && wCode <= 3) wStatus = 'PARTIALLY_OBSCURED';
          if (wCode > 3 && wCode < 50) wStatus = 'ATMOSPHERIC_HAZE';
          if (wCode >= 50 && wCode < 80) wStatus = 'PRECIPITATION_ACTIVE';
          if (wCode >= 80) wStatus = 'STORM_CELL_DETECTED';

          setEnvironment(prev => ({
            ...prev,
            moonPhase: getMoonPhase(new Date()),
            weatherStatus: `${wStatus} / TEMP:${weatherData.current_weather?.temperature}°C`,
          }));
        }
      } catch (err) {
        console.warn("Telemetry access limited by client network.");
        setNetwork(prev => ({ ...prev, city: "MASKED_BY_CLIENT" }));
      }
    };

    fetchData();
  }, []);

  return { network, hardware, environment };
};
