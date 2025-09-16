import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function WeeklyPlan({
  styles,
  colors,
  plan,
  selectedWeek,
  selectedDayIndex,
  setSelectedDayIndex,
  toggleTask,
  completeDay,
  formatDayLabel
}) {
  if (!plan) {
    return (
      <View style={styles.weeklyLoadingContainer}>
        <View style={[styles.weeklyLoadingCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.weeklyLoadingTitle, { color: colors.textPrimary }]}>Week 1 (Preview)</Text>
          <Text style={[styles.weeklyLoadingText, { color: colors.textSecondary }]}>Tap days to view tasks once plan loads</Text>
        </View>
        {Array.from({ length: 3 }).map((_, idx) => (
          <View key={`loading-${idx}`} style={[styles.weeklyLoadingCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.weeklyLoadingDayTitle, { color: colors.textPrimary }]}>Day {idx + 1} – Pending</Text>
            <Text style={[styles.weeklyLoadingDayText, { color: colors.textSecondary }]}>Stretching • Sleep • Nutrition</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.weeklyDaysContainer}>
      {plan.weeks[selectedWeek - 1].days.map((d, idx) => (
        <TouchableOpacity
          key={`day-${d.date}-${idx}`}
          onPress={() => setSelectedDayIndex(selectedDayIndex === idx ? null : idx)}
          disabled={d.locked}
          style={[styles.weeklyDayCard, { backgroundColor: colors.surface, opacity: d.locked ? 0.6 : 1 }]}
        >
          <View style={styles.weeklyDayHeader}>
            <View>
              <Text style={[styles.weeklyDayTitle, { color: colors.textPrimary }]}>Day {idx + 1} – {formatDayLabel(d.date)}</Text>
              <Text style={[styles.weeklyDayStatus, { color: colors.textSecondary }]}>{d.completed ? 'Completed ✅' : (d.locked ? 'Locked 🔒' : 'Pending')}</Text>
            </View>
            <Text style={[styles.weeklyDayToggle, { color: colors.textSecondary }]}>{selectedDayIndex === idx ? 'Hide' : 'View'}</Text>
          </View>

          {selectedDayIndex === idx && (
            <View style={styles.weeklyDayBlocks}>
              {d.blocks.map((b) => (
                <View key={b.id} style={[styles.weeklyBlock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.weeklyBlockTitle, { color: colors.textPrimary }]}>{b.title}</Text>
                  {b.tasks.map((t) => (
                    <TouchableOpacity
                      key={t.id}
                      onPress={() => toggleTask(selectedWeek - 1, idx, b.id, t.id)}
                      style={styles.weeklyTask}
                      disabled={d.locked}
                    >
                      <View style={[styles.weeklyTaskCheckbox, { borderColor: colors.accent, backgroundColor: t.done ? colors.accent : 'transparent' }]}>
                        {t.done && (<Text style={styles.weeklyTaskCheckmark}>✓</Text>)}
                      </View>
                      <Text style={[styles.weeklyTaskText, { color: t.done ? colors.textSecondary : colors.textPrimary, textDecorationLine: t.done ? 'line-through' : 'none' }]}>
                        {t.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

              {!d.completed && !d.locked && (
                <TouchableOpacity onPress={() => completeDay(selectedWeek - 1, idx)} style={[styles.weeklyCompleteButton, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.weeklyCompleteButtonText, { color: colors.surfaceElevated }]}>Complete Day</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
