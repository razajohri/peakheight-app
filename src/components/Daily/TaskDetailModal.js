import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

export default function TaskDetailModal({
  visible,
  onClose,
  task,
  isCompleted,
  onToggleComplete
}) {
  const { colors } = useTheme();

  if (!task) return null;

  const handleToggleComplete = () => {
    onToggleComplete(task.id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskEmoji}>{task.emoji}</Text>
              <View style={styles.taskTitleContainer}>
                <Text style={[styles.taskTitle, { color: colors.text }]}>
                  {task.title}
                </Text>
                <View style={styles.taskMeta}>
                  <Text style={[styles.taskCategory, { color: colors.primary }]}>
                    {task.category?.toUpperCase()}
                  </Text>
                  <Text style={[styles.taskTime, { color: colors.textSecondary }]}>
                    {task.estimated_time}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Description */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                What to do:
              </Text>
              <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
                {task.description}
              </Text>
            </View>

            {/* Scientific Reasoning */}
            {task.science && (
              <View style={styles.section}>
                <View style={styles.scienceHeader}>
                  <Ionicons name="flask" size={16} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8 }]}>
                    Why this helps:
                  </Text>
                </View>
                <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
                  {task.science}
                </Text>
              </View>
            )}

            {/* Personalization */}
            {task.personalization && (
              <View style={styles.section}>
                <View style={styles.scienceHeader}>
                  <Ionicons name="person" size={16} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8 }]}>
                    Why for you:
                  </Text>
                </View>
                <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
                  {task.personalization}
                </Text>
              </View>
            )}

            {/* Tips */}
            <View style={styles.section}>
              <View style={styles.scienceHeader}>
                <Ionicons name="bulb" size={16} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8 }]}>
                  Pro tip:
                </Text>
              </View>
              <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
                {getProTip(task.category)}
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.completeButton,
                {
                  backgroundColor: isCompleted ? colors.textSecondary : colors.primary
                }
              ]}
              onPress={handleToggleComplete}
            >
              <Ionicons
                name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"}
                size={20}
                color={colors.background}
              />
              <Text style={[styles.completeButtonText, { color: colors.background }]}>
                {isCompleted ? 'Completed' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function getProTip(category) {
  const tips = {
    sleep: "Try to maintain the same bedtime every night, even on weekends, to regulate your body's internal clock.",
    nutrition: "Keep healthy snacks nearby so you can easily meet your nutrition goals throughout the day.",
    posture: "Set phone reminders every 2 hours to check and correct your posture - it becomes a habit quickly.",
    recovery: "Even 5 minutes of deep breathing can significantly reduce stress hormones that inhibit growth.",
    exercise: "Consistency is key - even 10 minutes daily is better than 1 hour once a week.",
    measurement: "Measure at the same time each day (preferably morning) for the most accurate tracking."
  };
  return tips[category] || "Consistency is the key to seeing real results. Small daily actions compound over time.";
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  taskHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  taskTitleContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskCategory: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  taskTime: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    maxHeight: height * 0.5,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  scienceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalFooter: {
    padding: 8,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    width: '100%',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
