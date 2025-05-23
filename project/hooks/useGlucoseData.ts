import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { GlucoseReading, HistoricalData } from '@/types/glucose';
import { mockGlucoseData } from '@/utils/mockData';
import { useSettings } from './useSettings';

export function useGlucoseData() {
  const [todayReadings, setTodayReadings] = useState<GlucoseReading[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connected, setConnected] = useState(false);
  const { settings } = useSettings();
  
  // Function to calculate today's average
  const calculateAverage = (readings: GlucoseReading[]): number | null => {
    if (!readings || readings.length === 0) return null;
    
    const sum = readings.reduce((total, reading) => total + reading.value, 0);
    return Math.round(sum / readings.length);
  };
  
  // Get current reading (most recent)
  const currentReading = todayReadings.length > 0 
    ? todayReadings[todayReadings.length - 1] 
    : null;
  
  // Calculate today's average
  const todayAverage = calculateAverage(todayReadings);
  
  // Function to connect to Dexcom
  const connectToDexcom = async () => {
    // In a real app, this would handle HealthKit permissions and Dexcom API authorization
    
    // For this demo, we'll just simulate connecting after a delay
    setIsLoading(true);
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Simulate a successful connection by loading mock data
        const data = mockGlucoseData();
        setHistoricalData(data.historicalData);
        setTodayReadings(data.todayReadings);
        setConnected(true);
        setLastUpdated(new Date());
        setIsLoading(false);
        resolve();
      }, 2000);
    });
  };
  
  // Function to refresh data
  const refreshData = async () => {
    setIsLoading(true);
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const data = mockGlucoseData();
        setHistoricalData(data.historicalData);
        setTodayReadings(data.todayReadings);
        setLastUpdated(new Date());
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };
  
  // Load initial data
  useEffect(() => {
    connectToDexcom();
    
    // Set up automatic refresh interval
    const refreshInterval = setInterval(() => {
      if (connected) {
        refreshData();
      }
    }, settings.refreshInterval * 60 * 1000); // Convert minutes to milliseconds
    
    return () => clearInterval(refreshInterval);
  }, [settings.refreshInterval]);
  
  return {
    todayReadings,
    historicalData,
    isLoading,
    todayAverage,
    currentReading,
    lastUpdated,
    connected,
    connectToDexcom,
    refreshData,
  };
}