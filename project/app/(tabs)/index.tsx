import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlucoseDisplay from '@/components/GlucoseDisplay';
import { useGlucoseData } from '@/hooks/useGlucoseData';
import StatisticCard from '@/components/StatisticCard';
import TrendCard from '@/components/TrendCard';
import { calculateTimeInRange } from '@/utils/glucoseCalculations';
import LoadingScreen from '@/components/LoadingScreen';
import ConnectionStatus from '@/components/ConnectionStatus';

export default function TodayScreen() {
  const { 
    todayAverage, 
    currentReading, 
    isLoading, 
    lastUpdated, 
    refreshData,
    todayReadings,
    connected
  } = useGlucoseData();
  
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const timeInRange = calculateTimeInRange(todayReadings);

  if (isLoading && !refreshing) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
        }
      >
        <ConnectionStatus connected={connected} lastUpdated={lastUpdated} />
        
        <GlucoseDisplay 
          currentValue={currentReading?.value}
          trend={currentReading?.trend}
          isLoading={isLoading}
        />
        
        <View style={styles.statsContainer}>
          <StatisticCard 
            title="Today's Average"
            value={todayAverage ? `${todayAverage} mg/dL` : 'No data'}
            icon="trending-up"
            color="#007AFF"
          />
          
          <StatisticCard 
            title="Time in Range"
            value={timeInRange ? `${timeInRange}%` : 'No data'}
            icon="activity"
            color="#5AC8FA"
          />
        </View>
        
        <TrendCard readings={todayReadings} />
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
});