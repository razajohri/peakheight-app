import React from 'react';
import { View, Text } from 'react-native';

export default function ProgressSummary({ styles, colors, completedCount, totalCount, progressPercentage }) {
  return (
    <View style={styles.progressSection}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressLabel, { color: colors.textPrimary }]}>Today's Tasks</Text>
        <Text style={[styles.progressCount, { color: colors.textSecondary }]}>
          {completedCount}/{totalCount} completed
        </Text>
      </View>
      <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressBar,
            { width: `${progressPercentage}%`, backgroundColor: colors.accent },
          ]}
        />
      </View>
    </View>
  );
}
