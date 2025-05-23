import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlucoseData } from '@/hooks/useGlucoseData';
import StatisticCard from '@/components/StatisticCard';
import { calculateAverageStats } from '@/utils/glucoseCalculations';
import LoadingScreen from '@/components/LoadingScreen';
import TimeInRangeChart from '@/components/TimeInRangeChart';
import AverageByHourChart from '@/components/AverageByHourChart';

export default function StatsScreen() {
  const { historicalData, isLoading } = useGlucoseData();
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', '3months'
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  const stats = calculateAverageStats(historicalData, timeRange);
  
  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      {['week', 'month', '3months'].map((range) => (
        <TouchableOpacity
          key={range}
          style={[
            styles.timeRangeButton,
            timeRange === range && styles.activeTimeRange
          ]}
          onPress={() => setTimeRange(range)}
        >
          <Text 
            style={[
              styles.timeRangeText,
              timeRange === range && styles.activeTimeRangeText
            ]}
          >
            {range === 'week' ? '1W' : range === 'month' ? '1M' : '3M'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {renderTimeRangeSelector()}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time in Range</Text>
          <TimeInRangeChart data={stats.timeInRangeData} />
        </View>
        
        <View style={styles.statsGrid}>
          <StatisticCard 
            title="Average Glucose"
            value={stats.average ? `${stats.average} mg/dL` : 'No data'}
            icon="bar-chart-2"
            color="#007AFF"
            style={styles.statsCard}
          />
          <StatisticCard 
            title="Estimated A1C"
            value={stats.estimatedA1C ? `${stats.estimatedA1C}%` : 'No data'}
            icon="activity"
            color="#5AC8FA"
            style={styles.statsCard}
          />
          <StatisticCard 
            title="Standard Deviation"
            value={stats.standardDeviation ? `${stats.standardDeviation} mg/dL` : 'No data'}
            icon="git-branch"
            color="#FF9500"
            style={styles.statsCard}
          />
          <StatisticCard 
            title="Coefficient of Variation"
            value={stats.coefficientOfVariation ? `${stats.coefficientOfVariation}%` : 'No data'}
            icon="percent"
            color="#5856D6"
            style={styles.statsCard}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Average by Hour of Day</Text>
          <AverageByHourChart data={stats.averageByHour} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7'
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1C1C1E',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTimeRange: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTimeRangeText: {
    color: '#007AFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '48%',
    marginBottom: 16,
  },
});