import { GlucoseReading, HistoricalData } from '@/types/glucose';

// Generate mock glucose data
export function mockGlucoseData() {
  const trends = [
    'Rising Rapidly',
    'Rising',
    'Rising Slightly',
    'Stable',
    'Falling Slightly',
    'Falling',
    'Falling Rapidly'
  ];
  
  // Generate today's readings (every 5 minutes for the last 24 hours)
  const todayReadings: GlucoseReading[] = [];
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  
  // Generate a smooth curve for glucose values
  const generateGlucoseValue = (hour: number, minute: number) => {
    // Base value
    let value = 120;
    
    // Morning rise (dawn phenomenon)
    if (hour >= 4 && hour < 7) {
      value += 30 * Math.sin((hour - 4) / 3 * Math.PI);
    }
    
    // After breakfast spike (around 8am)
    if (hour >= 8 && hour < 10) {
      value += 50 * Math.sin((hour - 8) / 2 * Math.PI);
    }
    
    // Lunch spike (around 12-2pm)
    if (hour >= 12 && hour < 14) {
      value += 40 * Math.sin((hour - 12) / 2 * Math.PI);
    }
    
    // Dinner spike (around 6-8pm)
    if (hour >= 18 && hour < 20) {
      value += 45 * Math.sin((hour - 18) / 2 * Math.PI);
    }
    
    // Add some randomness
    value += (Math.random() * 30) - 15;
    
    return Math.round(value);
  };
  
  // Generate today's readings
  for (let i = 0; i < 288; i++) { // 288 readings in a day (every 5 minutes)
    const minutesPassed = i * 5;
    const timestamp = new Date(startOfDay);
    timestamp.setMinutes(minutesPassed);
    
    if (timestamp > now) break; // Don't generate future readings
    
    const hour = Math.floor(minutesPassed / 60);
    const minute = minutesPassed % 60;
    
    todayReadings.push({
      value: generateGlucoseValue(hour, minute),
      timestamp: timestamp.toISOString(),
      trend: trends[Math.floor(Math.random() * trends.length)]
    });
  }
  
  // Generate historical data (last 30 days)
  const historicalData: HistoricalData = {};
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Skip today as we already have today's readings
    if (i === 0) {
      historicalData[dateString] = todayReadings;
      continue;
    }
    
    // Generate readings for past days
    const dayReadings: GlucoseReading[] = [];
    const startOfPastDay = new Date(date);
    startOfPastDay.setHours(0, 0, 0, 0);
    
    for (let j = 0; j < 288; j++) {
      const minutesPassed = j * 5;
      const timestamp = new Date(startOfPastDay);
      timestamp.setMinutes(minutesPassed);
      
      const hour = Math.floor(minutesPassed / 60);
      const minute = minutesPassed % 60;
      
      dayReadings.push({
        value: generateGlucoseValue(hour, minute),
        timestamp: timestamp.toISOString(),
        trend: trends[Math.floor(Math.random() * trends.length)]
      });
    }
    
    historicalData[dateString] = dayReadings;
  }
  
  return { todayReadings, historicalData };
}