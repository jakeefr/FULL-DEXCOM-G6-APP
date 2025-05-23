import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { getGlucoseTrendIcon, getGlucoseStatusColor } from '@/utils/glucoseCalculations';

interface GlucoseDisplayProps {
  currentValue?: number;
  trend?: string;
  isLoading: boolean;
}

export default function GlucoseDisplay({ currentValue, trend, isLoading }: GlucoseDisplayProps) {
  const scaleAnim = new Animated.Value(1);
  const colorAnim = new Animated.Value(0);
  
  useEffect(() => {
    // Animate when glucose value changes
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, [currentValue]);
  
  const statusColor = getGlucoseStatusColor(currentValue);
  const trendIcon = getGlucoseTrendIcon(trend);
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  if (!currentValue) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No Data</Text>
        <Text style={styles.noDataSubtext}>Connect to Dexcom G6 to see your glucose</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Glucose</Text>
      
      <View style={styles.valueContainer}>
        <Animated.Text
          style={[
            styles.value,
            { 
              transform: [{ scale: scaleAnim }],
              color: statusColor
            }
          ]}
        >
          {currentValue}
        </Animated.Text>
        
        <Text style={styles.unit}>mg/dL</Text>
      </View>
      
      <View style={styles.trendContainer}>
        {trendIcon && (
          <Text style={styles.trendIcon}>{trendIcon}</Text>
        )}
        <Text style={styles.trendLabel}>
          {trend ? `${trend}` : 'No trend data'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  value: {
    fontSize: 72,
    fontWeight: '600',
    color: '#007AFF',
    lineHeight: 72,
  },
  unit: {
    fontSize: 20,
    color: '#8E8E93',
    marginLeft: 8,
    marginBottom: 12,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  trendLabel: {
    fontSize: 16,
    color: '#636366',
  },
  loadingText: {
    fontSize: 18,
    color: '#8E8E93',
    marginVertical: 40,
  },
  noDataText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8E8E93',
    marginVertical: 16,
  },
  noDataSubtext: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
});