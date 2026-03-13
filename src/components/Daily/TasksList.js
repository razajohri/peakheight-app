import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle, HelpCircle } from 'lucide-react-native';
import TaskDetailModal from './TaskDetailModal';

export default function TasksList({
  styles,
  colors,
  dailyTasks,
  completedTasks,
  isDayCompleted,
  toggleTaskCompletion,
  onNavigateToHub,
}) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTaskPress = (task) => {
    // Always toggle completion on task press (no navigation here)
    toggleTaskCompletion(task.id);
  };

  const handleInfoPress = (task) => {
    // Show task details when clicking on the question mark
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const handleToggleComplete = (taskId) => {
    toggleTaskCompletion(taskId);
  };
  return (
    <View style={styles.tasksSection}>
      {dailyTasks.length > 0 ? (
        dailyTasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id);
          // Disable task if already completed - cannot undo completion
          const isTaskDisabled = isCompleted;
          const isSpecialHubTask = task.isSpecial && task.title === "Complete today's exercise from Hub";

          return (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskCard,
                {
                  backgroundColor: isDayCompleted && isCompleted ? colors.primary + '20' : colors.surface,
                  borderColor: isDayCompleted && isCompleted ? colors.primary : (isSpecialHubTask ? colors.accent : colors.border),
                  borderWidth: isSpecialHubTask ? 2 : 1,
                  opacity: isTaskDisabled ? 0.6 : 1, // Reduce opacity if disabled
                }
              ]}
              onPress={() => handleTaskPress(task)}
              disabled={isTaskDisabled} // Disable if already completed
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
                      <CheckCircle size={12} color={colors.surfaceElevated} />
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
                      <TouchableOpacity
                        onPress={() => {
                          if (typeof onNavigateToHub === 'function') onNavigateToHub();
                        }}
                        activeOpacity={0.8}
                        style={[styles.specialTaskBadge, { backgroundColor: colors.accent }]}
                      >
                        <Text style={[styles.specialTaskBadgeText, { color: colors.surfaceElevated }]}>Tap to go to Hub</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.infoButton}
                  onPress={() => handleInfoPress(task)}
                  disabled={false} // Always allow viewing task info
                >
                  <HelpCircle size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.noTasksContainer}>
          <Text style={[styles.noTasksText, { color: colors.textSecondary }]}>No tasks available for today</Text>
        </View>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        visible={modalVisible}
        onClose={handleCloseModal}
        task={selectedTask}
        isCompleted={selectedTask ? completedTasks.includes(selectedTask.id) : false}
        onToggleComplete={handleToggleComplete}
      />
    </View>
  );
}
