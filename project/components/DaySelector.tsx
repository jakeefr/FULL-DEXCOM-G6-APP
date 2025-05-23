import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface DaySelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  timeRange: string;
}

export default function DaySelector({ selectedDate, onDateChange, timeRange }: DaySelectorProps) {
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: selectedDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    };
    
    if (timeRange === 'week') {
      // For week view, show the week range
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const startFormatted = startOfWeek.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      const endFormatted = endOfWeek.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: endOfWeek.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
      
      return `${startFormatted} - ${endFormatted}`;
    } else if (timeRange === 'month') {
      // For month view, show just the month and year
      return selectedDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    }
    
    // Default for day view
    return selectedDate.toLocaleDateString('en-US', options);
  };
  
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    
    if (timeRange === 'day') {
      newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (timeRange === 'week') {
      newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (timeRange === 'month') {
      newDate.setMonth(selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    
    onDateChange(newDate);
  };
  
  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigateDate('prev')}
      >
        <ChevronLeft size={24} color="#007AFF" />
      </TouchableOpacity>
      
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{formatDate()}</Text>
        {isToday() && <Text style={styles.todayBadge}>Today</Text>}
      </View>
      
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigateDate('next')}
      >
        <ChevronRight size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  navButton: {
    padding: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  todayBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    overflow: 'hidden',
  },
});