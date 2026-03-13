import React from 'react';
import { View, Text } from 'react-native';

export default function DayCompletionMessage({ styles, colors, isDayCompleted, currentDay, taskCount }) {
  if (!isDayCompleted) return null;
  return (
    <View style={[styles.completionMessage, { backgroundColor: '#FFFFFF' }]}>
      <View style={[styles.completionContent, { borderWidth: 0 }]}>
        <Text style={styles.completionEmoji}>🎉</Text>
        <Text style={[styles.completionTitle, { color: '#000000' }]}>Day {currentDay} Complete!</Text>
        <Text style={[styles.completionSubtitle, { color: '#64748B' }]}>
          Great job! You've completed all {taskCount} tasks for today.
        </Text>
        <Text style={[styles.completionText, { color: '#64748B' }]}>
          Come back tomorrow for Day {currentDay + 1} tasks!
        </Text>
      </View>
    </View>
  );
}
