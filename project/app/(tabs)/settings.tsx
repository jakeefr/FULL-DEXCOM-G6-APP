import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '@/hooks/useSettings';
import { ChevronRight, RefreshCw } from 'lucide-react-native';
import { useGlucoseData } from '@/hooks/useGlucoseData';

export default function SettingsScreen() {
  const { 
    settings, 
    updateTargetRange, 
    toggleNotifications, 
    toggleAppleHealthSync,
    updateRefreshInterval
  } = useSettings();
  
  const { connectToDexcom, refreshData } = useGlucoseData();
  
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleDexcomConnect = async () => {
    setIsConnecting(true);
    try {
      await connectToDexcom();
      Alert.alert(
        "Success", 
        "Successfully connected to Dexcom G6",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Connection Failed", 
        "Could not connect to Dexcom G6. Please ensure the Dexcom app is installed and you have granted necessary permissions.",
        [{ text: "OK" }]
      );
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleTargetRangeChange = () => {
    Alert.alert(
      "Set Target Range",
      "Set your target blood glucose range",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Save",
          onPress: (value) => updateTargetRange(70, 180) // This would normally use input values
        }
      ]
    );
  };
  
  const renderSettingItem = (title, subtitle, onPress) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={20} color="#8E8E93" />
    </TouchableOpacity>
  );
  
  const renderSwitchItem = (title, value, onValueChange) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Switch
        trackColor={{ false: "#E5E5EA", true: "#34C759" }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E5E5EA"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Connection</Text>
          {renderSettingItem(
            "Connect to Dexcom G6",
            "Connect to receive glucose data",
            handleDexcomConnect
          )}
          <TouchableOpacity style={styles.settingItem} onPress={refreshData}>
            <Text style={styles.settingTitle}>Refresh Data</Text>
            <RefreshCw size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Glucose Settings</Text>
          {renderSettingItem(
            "Target Range",
            `${settings.targetRange.min} - ${settings.targetRange.max} mg/dL`,
            handleTargetRangeChange
          )}
          {renderSettingItem(
            "Refresh Interval",
            `${settings.refreshInterval} minutes`,
            () => updateRefreshInterval(5) // This would normally use an input value
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Notifications & Integration</Text>
          {renderSwitchItem(
            "Enable Notifications",
            settings.notificationsEnabled,
            toggleNotifications
          )}
          {renderSwitchItem(
            "Sync with Apple Health",
            settings.appleHealthEnabled,
            toggleAppleHealthSync
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>About</Text>
          {renderSettingItem("Version", "1.0.0", () => {})}
          {renderSettingItem("Privacy Policy", null, () => {})}
          {renderSettingItem("Terms of Service", null, () => {})}
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
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C7C7CC',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
});