import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface AverageByHourProps {
  data: number[];
}

export default function AverageByHourChart({ data }: AverageByHourProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No hourly average data available</Text>
      </View>
    );
  }
  
  const screenWidth = Dimensions.get('window').width - 64; // Full width minus padding
  
  // Format data for the chart - take every 2 hours for better display
  const hours = ['12am', '2am', '4am', '6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'];
  const values = [
    data[0], data[2], data[4], data[6], data[8], data[10],
    data[12], data[14], data[16], data[18], data[20], data[22]
  ];
  
  const chartData = {
    labels: hours,
    datasets: [
      {
        data: values,
        color: () => '#007AFF', // Primary blue
        strokeWidth: 2
      }
    ],
    legend: ['Avg Glucose']
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={200}
        yAxisSuffix=" mg/dL"
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#FFFFFF',
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: '#E5E5EA',
            strokeWidth: 1
          },
          // Make x-axis labels rotated to fit better
          propsForLabels: {
            fontSize: 10,
            rotation: -45,
            origin: [0, 0],
            y: 12
          }
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    paddingBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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
});