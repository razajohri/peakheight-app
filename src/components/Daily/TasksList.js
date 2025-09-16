import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle } from 'lucide-react-native';

export default function TasksList({
  styles,
  colors,
  dailyTasks,
  completedTasks,
  isDayCompleted,
  toggleTaskCompletion
}) {
  return (
    <View style={styles.tasksSection}>
      {dailyTasks.length > 0 ? (
        dailyTasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id);
          const isTaskDisabled = isDayCompleted;
          const isSpecialHubTask = task.isSpecial && task.title === "Complete today's exercise from Hub";

          return (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskCard,
                {
                  backgroundColor: isDayCompleted ? colors.primary + '20' : colors.surface,
                  borderColor: isDayCompleted ? colors.primary : (isSpecialHubTask ? colors.accent : colors.border),
                  borderWidth: isSpecialHubTask ? 2 : 1,
                  opacity: isTaskDisabled ? 0.7 : 1,
                }
              ]}
              onPress={() => !isTaskDisabled && toggleTaskCompletion(task.id)}
              disabled={isTaskDisabled}
            >
              <View style={styles.taskContent}>
                <View style={styles.taskLeft}>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isCompleted ? colors.accent : 'transparent',
                        borderColor: colors.accent,
                      }
                    ]}
                  >
                    {isCompleted && (
                      <CheckCircle size={16} color={colors.surfaceElevated} />
                    )}
                  </View>
                  <Text style={styles.taskEmoji}>{task.emoji}</Text>
                  <View style={styles.taskTitleContainer}>
                    <Text
                      style={[
                        styles.taskTitle,
                        {
                          color: isCompleted ? colors.textSecondary : colors.textPrimary,
                          textDecorationLine: isCompleted ? 'line-through' : 'none',
                          fontWeight: task.isSpecial ? '600' : '400',
                        }
                      ]}
                    >
                      {task.title}
                    </Text>
                    {isSpecialHubTask && (
                      <View style={[styles.specialTaskBadge, { backgroundColor: colors.accent }]}>
                        <Text style={[styles.specialTaskBadgeText, { color: colors.surfaceElevated }]}>Tap to go to Hub</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.noTasksContainer}>
          <Text style={[styles.noTasksText, { color: colors.textSecondary }]}>No tasks available for today</Text>
        </View>
      )}
    </View>
  );
}
