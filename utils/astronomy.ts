export const getMoonPhase = (date: Date): string => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 3) {
    year--;
    month += 12;
  }

  ++month;
  
  const c = 365.25 * year;
  const e = 30.6 * month;
  const jd = c + e + day - 694039.09; // jd is total days elapsed
  let b = jd / 29.5305882; // divide by the moon cycle
  b -= Math.floor(b); // get the decimal part (phase)
  b = Math.round(b * 8); // scale to 0-8

  if (b >= 8) b = 0;

  switch (b) {
    case 0: return 'NEW MOON';
    case 1: return 'WAXING CRESCENT';
    case 2: return 'FIRST QUARTER';
    case 3: return 'WAXING GIBBOUS';
    case 4: return 'FULL MOON';
    case 5: return 'WANING GIBBOUS';
    case 6: return 'LAST QUARTER';
    case 7: return 'WANING CRESCENT';
    default: return 'UNKNOWN_PHASE';
  }
};

export const getSolarStatus = (lat: number, lng: number, date: Date): string => {
  // A very rough approximation for visual flair
  const hours = date.getUTCHours();
  // Adjust for rough longitude time (15 deg per hour)
  const localSolarTime = (hours + (lng / 15)) % 24;
  
  if (localSolarTime > 6 && localSolarTime < 18) {
    return `SOLAR_ACTIVE ${(localSolarTime).toFixed(2)}h`;
  }
  return `LUNAR_CYCLE ${(localSolarTime).toFixed(2)}h`;
};
