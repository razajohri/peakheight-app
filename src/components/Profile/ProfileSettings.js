import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileSettings({ styles, notificationsEnabled, setNotificationsEnabled, onTestNotifications, HapticFeedback }) {
  return (
    <View className="section" style={styles.section}>
      <Text style={styles.sectionTitle}>SETTINGS</Text>
      <View style={styles.settingsCard}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => {
            HapticFeedback?.light?.();
            setNotificationsEnabled(!notificationsEnabled);
          }}
        >
          <View style={styles.settingLeft}>
            <View style={styles.settingIconContainer}><Icon name="notifications" size={20} color="#3B5FE3" /></View>
            <Text style={styles.settingLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => {
              HapticFeedback?.light?.();
              setNotificationsEnabled(value);
            }}
            trackColor={{ false: '#E5E5E5', true: '#3B5FE3' }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </TouchableOpacity>

        {/* Removed Test Notifications option */}
      </View>
    </View>
  );
}
