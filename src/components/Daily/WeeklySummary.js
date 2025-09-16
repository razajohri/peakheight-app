import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function WeeklySummary({ styles, colors, plan, selectedWeek, weeklyStreak, setSelectedWeek }) {
  if (!plan) return null;

  const week = plan.weeks[selectedWeek - 1];
  const totalDays = week.days.length;
  const completedDays = week.days.filter(d => d.completed).length;
  const completionPct = Math.round((completedDays / totalDays) * 100);

  const totalTasks = week.days.reduce((sum, d) => sum + d.blocks.reduce((s, b) => s + b.tasks.length, 0), 0);
  const doneTasks = week.days.reduce((sum, d) => sum + d.blocks.reduce((s, b) => s + b.tasks.filter(t => t.done).length, 0), 0);

  const size = 72;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - completionPct / 100);

  return (
    <View style={styles.weeklySummarySection}>
      <View style={styles.weeklySummaryHeader}>
        <Text style={[styles.weeklySummaryTitle, { color: colors.textPrimary }]}>Weekly Summary</Text>
        <Text style={[styles.weeklySummaryWeek, { color: colors.textSecondary }]}>Week {selectedWeek}</Text>
      </View>

      <View style={[styles.weeklySummaryCard, { backgroundColor: colors.surface }]}>
        <View style={styles.weeklySummaryProgress}>
          <Svg width={size} height={size}>
            <Circle cx={size/2} cy={size/2} r={radius} stroke={colors.border} strokeWidth={stroke} fill="none" />
            <Circle
              cx={size/2}
              cy={size/2}
              r={radius}
              stroke={colors.accent}
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
          <View style={styles.weeklySummaryProgressText}>
            <Text style={[styles.weeklySummaryPercentage, { color: colors.textPrimary }]}>{completionPct}% complete</Text>
            <Text style={[styles.weeklySummaryDays, { color: colors.textSecondary }]}>{completedDays}/{totalDays} days</Text>
          </View>
        </View>

        <View style={styles.weeklySummaryStats}>
          <View>
            <Text style={[styles.weeklySummaryStatLabel, { color: colors.textSecondary }]}>Tasks</Text>
            <Text style={[styles.weeklySummaryStatValue, { color: colors.textPrimary }]}>{doneTasks}/{totalTasks}</Text>
          </View>
          <View>
            <Text style={[styles.weeklySummaryStatLabel, { color: colors.textSecondary }]}>Streak</Text>
            <Text style={[styles.weeklySummaryStatValue, { color: colors.textPrimary }]}>🔥 {weeklyStreak}</Text>
          </View>
        </View>

        {completedDays === totalDays && plan.weeks[selectedWeek] && plan.weeks[selectedWeek].days.every(d => d.locked) && (
          <TouchableOpacity onPress={() => setSelectedWeek(selectedWeek + 1)} style={[styles.weeklyNextWeekButton, { backgroundColor: colors.accent }]}>
            <Text style={[styles.weeklyNextWeekButtonText, { color: colors.surfaceElevated }]}>Start Week {selectedWeek + 1}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
