import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar, Flame, CheckCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenContainer from '../components/ScreenContainer';
import { useTheme } from '../hooks/useTheme';
import { generateDailyTasks } from '../services/chatgptService';

const { width } = Dimensions.get('window');

export default function DailyRoutineScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyTasks, setDailyTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generatingTasks, setGeneratingTasks] = useState(false);

  // Disable persistence to avoid any storage/db warnings while previewing UI.
  const PERSIST_ENABLED = false;

  // Generate dates for the week
  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = generateWeekDates();

  useEffect(() => {
    initializeDailyRoutine();
  }, []);

  useEffect(() => {
    loadDailyData();
  }, [selectedDate]);

  const initializeDailyRoutine = async () => {
    try {
      await loadStreak();
      await loadDailyData();
    } catch (error) {
      console.error('Error initializing daily routine:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStreak = async () => {
    try {
      if (!PERSIST_ENABLED) {
        setStreak(0);
        return;
      }
      const savedStreak = await AsyncStorage.getItem('daily_streak');
      setStreak(savedStreak ? parseInt(savedStreak) : 0);
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };

  const loadDailyData = async () => {
    try {
      const dateKey = selectedDate.toISOString().split('T')[0];
      const savedTasks = PERSIST_ENABLED ? await AsyncStorage.getItem(`daily_tasks_${dateKey}`) : null;
      const savedCompleted = PERSIST_ENABLED ? await AsyncStorage.getItem(`completed_tasks_${dateKey}`) : null;

      if (savedTasks) {
        setDailyTasks(JSON.parse(savedTasks));
      } else {
        // Generate new tasks for today if none exist
        if (isToday(selectedDate)) {
          await generateDailyTasksFromAPI();
        }
      }

      setCompletedTasks(savedCompleted ? JSON.parse(savedCompleted) : []);
    } catch (error) {
      console.error('Error loading daily data:', error);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const generateDailyTasksFromAPI = async () => {
    try {
      setGeneratingTasks(true);

      // Call ChatGPT API to generate personalized daily tasks
      const generatedTasks = await generateDailyTasks();

      setDailyTasks(generatedTasks);

      // Save tasks to AsyncStorage
      const dateKey = selectedDate.toISOString().split('T')[0];
      if (PERSIST_ENABLED) {
        await AsyncStorage.setItem(`daily_tasks_${dateKey}`, JSON.stringify(generatedTasks));
      }

    } catch (error) {
      console.error('Error generating daily tasks:', error);
      Alert.alert('Error', 'Failed to generate daily tasks. Please try again.');
    } finally {
      setGeneratingTasks(false);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const newCompletedTasks = completedTasks.includes(taskId)
        ? completedTasks.filter(id => id !== taskId)
        : [...completedTasks, taskId];

      setCompletedTasks(newCompletedTasks);

      // Save to AsyncStorage
      const dateKey = selectedDate.toISOString().split('T')[0];
      if (PERSIST_ENABLED) {
        await AsyncStorage.setItem(`completed_tasks_${dateKey}`, JSON.stringify(newCompletedTasks));
      }

      // Check if all tasks are completed for today
      if (isToday(selectedDate) && newCompletedTasks.length === dailyTasks.length) {
        await updateStreak();
      }

    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const updateStreak = async () => {
    try {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (PERSIST_ENABLED) {
        await AsyncStorage.setItem('daily_streak', newStreak.toString());
      }

      // Mark today as completed
      if (PERSIST_ENABLED) {
        const today = new Date().toISOString().split('T')[0];
        await AsyncStorage.setItem(`streak_completed_${today}`, 'true');
      }

      Alert.alert(
        '🎉 Streak Updated!',
        `Great job! Your streak is now ${newStreak} days!`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${day} ${month}`;
  };

  const isDateSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const progressPercentage = dailyTasks.length > 0 ? (completedTasks.length / dailyTasks.length) * 100 : 0;

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            Loading daily routine...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Daily routine
          </Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Icon name="settings-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateContainer}>
              {weekDates.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor: isDateSelected(date) ? colors.accent : colors.surface,
                      borderColor: isDateSelected(date) ? colors.accent : colors.border,
                    }
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      {
                        color: isDateSelected(date) ? colors.surfaceElevated : colors.textPrimary,
                      }
                    ]}
                  >
                    {formatDate(date)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Streaks Section */}
        <View style={styles.streaksSection}>
          <View style={styles.streaksHeader}>
            <View style={styles.streaksTitle}>
              <Flame size={20} color={colors.accent} />
              <Text style={[styles.streaksLabel, { color: colors.textPrimary }]}>
                Streaks
              </Text>
            </View>
            <View style={[styles.streakBadge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.streakNumber, { color: colors.surfaceElevated }]}>
                {streak}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.textPrimary }]}>
              In progress
            </Text>
            <Text style={[styles.progressCount, { color: colors.textSecondary }]}>
              {completedTasks.length}/{dailyTasks.length}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: colors.accent,
                }
              ]}
            />
          </View>
        </View>

        {/* Daily Tasks */}
        <View style={styles.tasksSection}>
          {generatingTasks ? (
            <View style={styles.loadingTasks}>
              <Text style={[styles.loadingTasksText, { color: colors.textSecondary }]}>
                Generating today's tasks...
              </Text>
            </View>
          ) : (
            dailyTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.taskCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => toggleTaskCompletion(task.id)}
              >
                <View style={styles.taskContent}>
                  <View style={styles.taskLeft}>
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: completedTasks.includes(task.id)
                            ? colors.accent
                            : 'transparent',
                          borderColor: colors.accent,
                        }
                      ]}
                    >
                      {completedTasks.includes(task.id) && (
                        <CheckCircle size={16} color={colors.surfaceElevated} />
                      )}
                    </View>
                    <Text style={styles.taskEmoji}>{task.emoji}</Text>
                    <Text
                      style={[
                        styles.taskTitle,
                        {
                          color: completedTasks.includes(task.id)
                            ? colors.textSecondary
                            : colors.textPrimary,
                          textDecorationLine: completedTasks.includes(task.id)
                            ? 'line-through'
                            : 'none',
                        }
                      ]}
                    >
                      {task.title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Generate Tasks Button (for testing) */}
        {isToday(selectedDate) && dailyTasks.length === 0 && (
          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: colors.accent }]}
            onPress={generateDailyTasksFromAPI}
            disabled={generatingTasks}
          >
            <Text style={[styles.generateButtonText, { color: colors.surfaceElevated }]}>
              {generatingTasks ? 'Generating...' : 'Generate Today\'s Tasks'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fabButton}>
        <View style={[styles.fabGradient, { backgroundColor: colors.accent }]}>
          <Icon name="chatbubble" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_400Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  settingsButton: {
    padding: 8,
  },
  dateSelector: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  streaksSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  streaksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streaksTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streaksLabel: {
    fontSize: 18,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  streakBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakNumber: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  progressCount: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_400Regular',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  tasksSection: {
    paddingHorizontal: 24,
    gap: 12,
  },
  loadingTasks: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingTasksText: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_400Regular',
  },
  taskCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_400Regular',
    flex: 1,
  },
  generateButton: {
    marginHorizontal: 24,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    alignItems: 'center',
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
