import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlucoseReading } from '@/types/glucose';
import { getGlucoseStatusColor } from '@/utils/glucoseCalculations';

interface TrendCardProps {
  readings: GlucoseReading[];
}

export default function TrendCard({ readings }: TrendCardProps) {
  if (!readings || readings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Today's Readings</Text>
        <Text style={styles.noDataText}>No readings available</Text>
      </View>
    );
  }
  
  // Get the last 8 readings
  const recentReadings = readings.slice(-8).reverse();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Readings</Text>
      
      {recentReadings.map((reading, index) => {
        const readingTime = new Date(reading.timestamp);
        const formattedTime = `${readingTime.getHours().toString().padStart(2, '0')}:${readingTime.getMinutes().toString().padStart(2, '0')}`;
        const statusColor = getGlucoseStatusColor(reading.value);
        
        return (
          <View key={index} style={styles.readingRow}>
            <Text style={styles.readingTime}>{formattedTime}</Text>
            <Text style={[styles.readingValue, { color: statusColor }]}>
              {reading.value} mg/dL
            </Text>
            <View 
              style={[
                styles.statusIndicator, 
                { backgroundColor: statusColor }
              ]} 
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1C1C1E',
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  readingTime: {
    fontSize: 16,
    color: '#8E8E93',
    width: 60,
  },
  readingValue: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  noDataText: {
    fontSize: 16,
    color: '#8E8E93',
    marginVertical: 16,
    textAlign: 'center',
  },
});