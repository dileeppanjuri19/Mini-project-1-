import { MoistureStatus, SoilProfile, SoilReading } from '@/types/soil';

export const analyzeMoisture = (
  moisture: number,
  profile: SoilProfile
): { status: MoistureStatus; recommendation: string } => {
  if (moisture < profile.criticalMin) {
    return {
      status: 'too-dry',
      recommendation: '🚨 Critical! Water immediately - soil is dangerously dry'
    };
  }
  
  if (moisture < profile.optimalMin) {
    return {
      status: 'dry',
      recommendation: '💧 Water needed - soil is below optimal moisture'
    };
  }
  
  if (moisture <= profile.optimalMax) {
    return {
      status: 'optimal',
      recommendation: '✅ Perfect moisture level - maintain current schedule'
    };
  }
  
  if (moisture <= profile.criticalMax) {
    return {
      status: 'moist',
      recommendation: '⚠️ Slightly wet - reduce watering frequency'
    };
  }
  
  return {
    status: 'too-wet',
    recommendation: '🌊 Too wet! Stop watering - risk of root rot'
  };
};

export const simulateMoistureReading = (profile: SoilProfile): number => {
  // Simulate realistic moisture readings with slight bias toward optimal range
  const range = profile.criticalMax - profile.criticalMin;
  const optimalMid = (profile.optimalMin + profile.optimalMax) / 2;
  
  // 60% chance of being in optimal range
  if (Math.random() < 0.6) {
    return Math.floor(
      profile.optimalMin + Math.random() * (profile.optimalMax - profile.optimalMin)
    );
  }
  
  // 40% chance of being outside optimal (but usually not critical)
  const randomValue = Math.floor(
    profile.criticalMin + Math.random() * range
  );
  
  return randomValue;
};

export const getStatusColor = (status: MoistureStatus): string => {
  switch (status) {
    case 'too-dry':
      return 'hsl(var(--soil-dry))';
    case 'dry':
      return 'hsl(var(--warning))';
    case 'optimal':
      return 'hsl(var(--soil-good))';
    case 'moist':
      return 'hsl(var(--accent))';
    case 'too-wet':
      return 'hsl(var(--soil-wet))';
  }
};
