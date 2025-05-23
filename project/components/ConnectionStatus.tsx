import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, WifiOff } from 'lucide-react-native';

interface ConnectionStatusProps {
  connected: boolean;
  lastUpdated: Date | null;
}

export default function ConnectionStatus({ connected, lastUpdated }: ConnectionStatusProps) {
  const formatTimeAgo = (date: Date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <View style={[
      styles.container,
      connected ? styles.connectedContainer : styles.disconnectedContainer
    ]}>
      {connected ? (
        <View style={styles.statusContent}>
          <Clock size={16} color="#8E8E93" />
          <Text style={styles.statusText}>
            Updated {lastUpdated ? formatTimeAgo(lastUpdated) : 'Never'}
          </Text>
        </View>
      ) : (
        <View style={styles.statusContent}>
          <WifiOff size={16} color="#FF3B30" />
          <Text style={styles.disconnectedText}>
            Not connected to Dexcom G6
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  connectedContainer: {
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
  },
  disconnectedContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 6,
  },
  disconnectedText: {
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 6,
  },
});