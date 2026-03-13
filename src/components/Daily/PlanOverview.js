import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../UI/Icon';

export default function PlanOverview({
  styles,
  colors,
  currentDay,
  phaseText,
  descriptionText,
  onReset,
  onViewProgress
}) {
  return (
    <View style={styles.planSection}>
      <View style={styles.planHeader}>
        <View style={styles.planTitle}>
          <Icon name="calendar" size={20} color={colors.accent} />
          <Text style={[styles.planLabel, { color: colors.textPrimary }]}>My Custom Plan</Text>
        </View>
        <View style={[styles.planBadge, { backgroundColor: colors.accent }]}>
          <Text style={[styles.planNumber, { color: colors.surfaceElevated }]}>{currentDay}/120</Text>
        </View>
      </View>

      <View style={[styles.planProgressContainer, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.planProgressBar,
            { width: `${(currentDay / 120) * 100}%`, backgroundColor: colors.accent }
          ]}
        />
      </View>

      <View style={styles.planDetails}>
        {/* Phase text intentionally removed per request */}
        <Text style={[styles.planDescription, { color: colors.textSecondary }]}>{descriptionText}</Text>
      </View>

      <View style={styles.planManagement}>
        <TouchableOpacity
          style={[styles.planButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            onViewProgress && onViewProgress();
          }}
        >
          <Text style={styles.planButtonText}>View My Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

