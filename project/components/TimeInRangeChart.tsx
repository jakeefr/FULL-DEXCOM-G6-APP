import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimeInRangeData {
  inRange: number;
  high: number;
  low: number;
}

interface TimeInRangeChartProps {
  data: TimeInRangeData;
}

export default function TimeInRangeChart({ data }: TimeInRangeChartProps) {
  if (!data) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No time in range data available</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={[styles.barSegment, styles.inRangeSegment, { flex: data.inRange / 100 }]} />
        <View style={[styles.barSegment, styles.highSegment, { flex: data.high / 100 }]} />
        <View style={[styles.barSegment, styles.lowSegment, { flex: data.low / 100 }]} />
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.inRangeSegment]} />
          <Text style={styles.legendText}>In Range</Text>
          <Text style={styles.legendValue}>{data.inRange}%</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.highSegment]} />
          <Text style={styles.legendText}>High</Text>
          <Text style={styles.legendValue}>{data.high}%</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.lowSegment]} />
          <Text style={styles.legendText}>Low</Text>
          <Text style={styles.legendValue}>{data.low}%</Text>
        </View>
      </View>
      
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>70 mg/dL</Text>
        <Text style={styles.rangeLabel}>180 mg/dL</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barContainer: {
    height: 24,
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  barSegment: {
    height: '100%',
  },
  inRangeSegment: {
    backgroundColor: '#34C759', // Green
  },
  highSegment: {
    backgroundColor: '#FF9500', // Orange
  },
  lowSegment: {
    backgroundColor: '#FF3B30', // Red
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 4,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  noDataText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rangeLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
});