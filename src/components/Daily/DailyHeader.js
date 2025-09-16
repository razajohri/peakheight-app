import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DailyHeader({ styles, colors, currentDay, phase, onPressSettings }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Day {currentDay} of 120</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{phase}</Text>
      </View>
      <TouchableOpacity style={styles.settingsButton} onPress={onPressSettings}>
        <Icon name="settings-outline" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}
