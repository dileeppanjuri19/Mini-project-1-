export type SoilType = 'clay' | 'sandy' | 'loamy' | 'silt' | 'peat';

export type MoistureStatus = 'too-dry' | 'dry' | 'optimal' | 'moist' | 'too-wet';

export interface SoilProfile {
  id: string;
  name: string;
  type: SoilType;
  description: string;
  optimalMin: number;
  optimalMax: number;
  criticalMin: number;
  criticalMax: number;
  icon: string;
}

export interface SoilReading {
  soilType: SoilType;
  moisture: number;
  status: MoistureStatus;
  recommendation: string;
  lastUpdated: Date;
}
