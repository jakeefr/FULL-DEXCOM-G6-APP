import { GlucoseReading, DailyStatistics, TimeInRangeData, GlucoseStats } from '@/types/glucose';

// Calculate time in range percentage
export function calculateTimeInRange(readings: GlucoseReading[]): number | null {
  if (!readings || readings.length === 0) return null;
  
  const targetLow = 70;
  const targetHigh = 180;
  
  const inRangeCount = readings.filter(
    reading => reading.value >= targetLow && reading.value <= targetHigh
  ).length;
  
  return Math.round((inRangeCount / readings.length) * 100);
}

// Calculate daily statistics
export function calculateDailyStatistics(readings: GlucoseReading[]): DailyStatistics {
  if (!readings || readings.length === 0) {
    return {
      average: null,
      min: null,
      max: null,
      timeInRange: null
    };
  }
  
  const values = readings.map(reading => reading.value);
  const average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const timeInRange = calculateTimeInRange(readings);
  
  return {
    average,
    min,
    max,
    timeInRange
  };
}

// Get color based on glucose value
export function getGlucoseStatusColor(value: number | undefined): string {
  if (value === undefined) return '#8E8E93'; // Gray for no data
  
  if (value < 54) return '#FF3B30'; // Red for dangerously low
  if (value < 70) return '#FF9500'; // Orange for low
  if (value <= 180) return '#34C759'; // Green for in range
  if (value <= 250) return '#FF9500'; // Orange for high
  return '#FF3B30'; // Red for very high
}

// Get icon for glucose trend
export function getGlucoseTrendIcon(trend: string | undefined): string | null {
  if (!trend) return null;
  
  switch (trend) {
    case 'Rising Rapidly': return '↑↑';
    case 'Rising': return '↑';
    case 'Rising Slightly': return '↗';
    case 'Stable': return '→';
    case 'Falling Slightly': return '↘';
    case 'Falling': return '↓';
    case 'Falling Rapidly': return '↓↓';
    default: return null;
  }
}

// Calculate estimated A1C from average glucose
export function calculateEstimatedA1C(averageGlucose: number): number {
  // Formula: A1C = (Average glucose + 46.7) / 28.7
  return parseFloat(((averageGlucose + 46.7) / 28.7).toFixed(1));
}

// Calculate standard deviation
export function calculateStandardDeviation(readings: GlucoseReading[]): number {
  if (!readings || readings.length === 0) return 0;
  
  const values = readings.map(reading => reading.value);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  const squareDiffs = values.map(value => {
    const diff = value - avg;
    return diff * diff;
  });
  
  const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
  return Math.round(Math.sqrt(avgSquareDiff));
}

// Calculate coefficient of variation
export function calculateCoefficientOfVariation(avg: number, stdDev: number): number {
  if (avg === 0) return 0;
  return Math.round((stdDev / avg) * 100);
}

// Calculate average statistics for a time period
export function calculateAverageStats(historicalData: Record<string, GlucoseReading[]>, timeRange: string): GlucoseStats {
  // Combine all readings based on time range
  let allReadings: GlucoseReading[] = [];
  const now = new Date();
  const dates = Object.keys(historicalData);
  
  let daysToInclude: number;
  switch (timeRange) {
    case 'week':
      daysToInclude = 7;
      break;
    case 'month':
      daysToInclude = 30;
      break;
    case '3months':
      daysToInclude = 90;
      break;
    default:
      daysToInclude = 7;
  }
  
  // Sort dates in descending order and take only the required number of days
  dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const relevantDates = dates.slice(0, daysToInclude);
  
  // Collect all readings from relevant dates
  relevantDates.forEach(date => {
    allReadings = [...allReadings, ...historicalData[date]];
  });
  
  if (allReadings.length === 0) {
    return {
      average: null,
      estimatedA1C: null,
      standardDeviation: null,
      coefficientOfVariation: null,
      timeInRangeData: { inRange: 0, high: 0, low: 0 },
      averageByHour: new Array(24).fill(0)
    };
  }
  
  // Calculate basic statistics
  const values = allReadings.map(r => r.value);
  const average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  const stdDev = calculateStandardDeviation(allReadings);
  const cv = calculateCoefficientOfVariation(average, stdDev);
  const estimatedA1C = calculateEstimatedA1C(average);
  
  // Calculate time in range data
  const targetLow = 70;
  const targetHigh = 180;
  
  const inRangeCount = allReadings.filter(
    reading => reading.value >= targetLow && reading.value <= targetHigh
  ).length;
  
  const highCount = allReadings.filter(
    reading => reading.value > targetHigh
  ).length;
  
  const lowCount = allReadings.filter(
    reading => reading.value < targetLow
  ).length;
  
  const totalCount = allReadings.length;
  
  const timeInRangeData = {
    inRange: Math.round((inRangeCount / totalCount) * 100),
    high: Math.round((highCount / totalCount) * 100),
    low: Math.round((lowCount / totalCount) * 100)
  };
  
  // Calculate average by hour of day
  const hourlyReadings: GlucoseReading[][] = Array(24).fill(0).map(() => []);
  
  allReadings.forEach(reading => {
    const hour = new Date(reading.timestamp).getHours();
    hourlyReadings[hour].push(reading);
  });
  
  const averageByHour = hourlyReadings.map(hourReadings => {
    if (hourReadings.length === 0) return 0;
    const hourValues = hourReadings.map(r => r.value);
    return Math.round(hourValues.reduce((sum, val) => sum + val, 0) / hourValues.length);
  });
  
  return {
    average,
    estimatedA1C,
    standardDeviation: stdDev,
    coefficientOfVariation: cv,
    timeInRangeData,
    averageByHour
  };
}