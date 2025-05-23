import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlucoseChart from '@/components/GlucoseChart';
import { useGlucoseData } from '@/hooks/useGlucoseData';
import DaySelector from '@/components/DaySelector';
import StatisticCard from '@/components/StatisticCard';
import { calculateDailyStatistics } from '@/utils/glucoseCalculations';
import LoadingScreen from '@/components/LoadingScreen';

export default function HistoryScreen() {
  const { historicalData, isLoading } = useGlucoseData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeRange, setTimeRange] = useState('day'); // 'day', 'week', 'month'
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  const dateData = historicalData[selectedDate.toISOString().split('T')[0]] || [];
  const stats = calculateDailyStatistics(dateData);
  
  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      {['day', 'week', 'month'].map((range) => (
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
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {renderTimeRangeSelector()}
        
        <DaySelector 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          timeRange={timeRange}
        />
        
        <GlucoseChart 
          data={dateData}
          timeRange={timeRange}
        />
        
        <View style={styles.statsGrid}>
          <StatisticCard 
            title="Average"
            value={stats.average ? `${stats.average} mg/dL` : 'No data'}
            icon="bar-chart-2"
            color="#007AFF"
            style={styles.statsCard}
          />
          <StatisticCard 
            title="Highest"
            value={stats.max ? `${stats.max} mg/dL` : 'No data'}
            icon="trending-up"
            color="#FF3B30"
            style={styles.statsCard}
          />
          <StatisticCard 
            title="Lowest"
            value={stats.min ? `${stats.min} mg/dL` : 'No data'}
            icon="trending-down"
            color="#34C759"
            style={styles.statsCard}
          />
          <StatisticCard 
            title="In Range"
            value={stats.timeInRange ? `${stats.timeInRange}%` : 'No data'}
            icon="activity"
            color="#5AC8FA"
            style={styles.statsCard}
          />
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
    marginTop: 16,
  },
  statsCard: {
    width: '48%',
    marginBottom: 16,
  },
});