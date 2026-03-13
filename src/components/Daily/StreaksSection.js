import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Flame } from 'lucide-react-native';

export default function StreaksSection({ styles, colors, streak, showCelebration, onViewProgress }) {
  return (
    <View style={styles.streaksSection}>
      <View style={styles.streaksHeader}>
        <View style={styles.streaksTitle}>
          {!showCelebration && (
            <Flame size={20} color="#FF6B35" />
          )}
          <Text style={[styles.streaksLabel, { color: colors.textPrimary }]}>Streak</Text>
        </View>
        <View style={[styles.streakBadge, { backgroundColor: colors.accent }]}>
          <Text style={[styles.streakNumber, { color: colors.surfaceElevated }]}>{streak}</Text>
        </View>
      </View>
    </View>
  );
}
