export interface GlucoseReading {
  value: number;
  timestamp: string;
  trend?: string;
}

export interface DailyStatistics {
  average: number | null;
  min: number | null;
  max: number | null;
  timeInRange: number | null;
}

export interface TimeInRangeData {
  inRange: number;
  high: number;
  low: number;
}

export interface GlucoseStats {
  average: number | null;
  estimatedA1C: number | null;
  standardDeviation: number | null;
  coefficientOfVariation: number | null;
  timeInRangeData: TimeInRangeData;
  averageByHour: number[];
}

export type GlucoseTrend = 
  | 'Rising Rapidly'
  | 'Rising'
  | 'Rising Slightly'
  | 'Stable'
  | 'Falling Slightly'
  | 'Falling'
  | 'Falling Rapidly'
  | null;

export interface HistoricalData {
  [date: string]: GlucoseReading[];
}