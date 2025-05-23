import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface TargetRange {
  min: number;
  max: number;
}

interface Settings {
  targetRange: TargetRange;
  notificationsEnabled: boolean;
  appleHealthEnabled: boolean;
  refreshInterval: number; // minutes
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    targetRange: { min: 70, max: 180 },
    notificationsEnabled: true,
    appleHealthEnabled: Platform.OS === 'ios',
    refreshInterval: 5
  });
  
  const updateTargetRange = (min: number, max: number) => {
    setSettings(prev => ({
      ...prev,
      targetRange: { min, max }
    }));
  };
  
  const toggleNotifications = () => {
    setSettings(prev => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled
    }));
  };
  
  const toggleAppleHealthSync = () => {
    setSettings(prev => ({
      ...prev,
      appleHealthEnabled: !prev.appleHealthEnabled
    }));
  };
  
  const updateRefreshInterval = (minutes: number) => {
    setSettings(prev => ({
      ...prev,
      refreshInterval: minutes
    }));
  };
  
  // Load settings from storage on init
  useEffect(() => {
    // In a real app, we would load from AsyncStorage or another persistence mechanism
    // For this demo, we'll just use the default values
  }, []);
  
  // Save settings when they change
  useEffect(() => {
    // In a real app, we would save to AsyncStorage or another persistence mechanism
  }, [settings]);
  
  return {
    settings,
    updateTargetRange,
    toggleNotifications,
    toggleAppleHealthSync,
    updateRefreshInterval
  };
}