import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity, ChartBar as BarChart2, TrendingDown, TrendingUp, Percent, GitBranch } from 'lucide-react-native';

interface StatisticCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  style?: object;
}

export default function StatisticCard({ title, value, icon, color, style }: StatisticCardProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'trending-up':
        return <TrendingUp size={24} color={color} />;
      case 'trending-down':
        return <TrendingDown size={24} color={color} />;
      case 'activity':
        return <Activity size={24} color={color} />;
      case 'bar-chart-2':
        return <BarChart2 size={24} color={color} />;
      case 'percent':
        return <Percent size={24} color={color} />;
      case 'git-branch':
        return <GitBranch size={24} color={color} />;
      default:
        return <Activity size={24} color={color} />;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        {renderIcon()}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
    fontWeight: '500',
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
  },
});