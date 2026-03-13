import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../UI/Icon';

export default function ProfileSettings({ styles, onFeedbackPress, HapticFeedback }) {
  return (
    <View className="section" style={styles.section}>
      <Text style={styles.sectionTitle}>SETTINGS</Text>
      <View style={styles.settingsCard}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => {
            HapticFeedback?.light?.();
            onFeedbackPress?.();
          }}
        >
          <View style={styles.settingLeft}>
            <View style={styles.settingIconContainer}><Icon name="chatbubble-ellipses-outline" size={20} color="#3B5FE3" /></View>
            <Text style={styles.settingLabel}>Send Feedback</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#999999" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
