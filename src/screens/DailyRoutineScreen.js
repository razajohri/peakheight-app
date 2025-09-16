import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar, Flame, CheckCircle } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenContainer from '../components/ScreenContainer';
import { useTheme } from '../hooks/useTheme';
import { DailyPlanService } from '../services/dailyPlanService';
import { useUser } from '../contexts/UserContext';
import HapticFeedback from '../utils/hapticFeedback';
import { supabase } from '../config/supabase';
import CelebrationModal from '../components/UI/CelebrationModal';
import DailyHeader from '../components/Daily/DailyHeader';
import DateSelector from '../components/Daily/DateSelector';
import PlanOverview from '../components/Daily/PlanOverview';
import TasksList from '../components/Daily/TasksList';
import WeeklyPlan from '../components/Daily/WeeklyPlan';
import WeeklySummary from '../components/Daily/WeeklySummary';
import NotificationService from '../services/notificationService';
import { SoundService } from '../services/soundService';
// useFocusEffect removed to avoid navigation dependency; using navigation listener instead

const { width } = Dimensions.get('window');

export default function DailyRoutineScreen({ navigation, onNavigateToProfile }) {
  const { colors } = useTheme();
  const { userProfile } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyTasks, setDailyTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [streak, setStreak] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(null);
  const [isDayCompleted, setIsDayCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  // Weekly plan state
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [plan, setPlan] = useState(null);
  const [weeklyStreak, setWeeklyStreak] = useState(0);

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
    if (userProfile) {
    initializeDailyRoutine();
      initializeWeeklyPlan();
    }
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile) return;
    if (!hasInitializedRef.current) return; // avoid duplicate load on first mount
    loadDailyData();
  }, [selectedDate, userProfile]);

  const hasInitializedRef = useRef(false);

  // Refresh streak from DB whenever this screen gains focus
  useEffect(() => {
    if (!navigation || !navigation.addListener) return;
    let isActive = true;
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        if (!userProfile) return;
        const latest = await DailyPlanService.getUserProgress(userProfile.id);
        if (isActive && latest) {
          setUserProgress(latest);
          setStreak(latest.current_streak || 0);
        }
      } catch {}
    });
    return () => {
      isActive = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [navigation, userProfile?.id]);

  const initializeDailyRoutine = async () => {
    try {
      setLoading(true);
      // Ensure user's plan exists and current day is synced
      const progress = await DailyPlanService.syncCurrentDay(userProfile.id);
      setUserProgress(progress);
      setCurrentDay(progress.current_day);
      setStreak(progress.current_streak || 0);

      // Load today's tasks
      await loadDailyData(progress.current_day);

      // Ensure streak reflects latest DB value after any prior completions
      try {
        const latest = await DailyPlanService.getUserProgress(userProfile.id);
        if (latest) {
          setUserProgress(latest);
          setStreak(latest.current_streak || 0);
        }
      } catch {}
      hasInitializedRef.current = true;
    } catch (error) {
      console.error('Error initializing daily routine:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyData = async (dayOverride) => {
    try {
      if (!userProfile) return;
      const dayToLoad = dayOverride || currentDay;
      // Get current day's tasks
      const dayTasks = await DailyPlanService.getDailyTasks(userProfile.id, dayToLoad);

      if (dayTasks) {
        setDailyTasks(dayTasks.tasks || []);
        setCompletedTasks(dayTasks.completed_tasks || []);
        setIsDayCompleted(dayTasks.is_completed || false);
        // Refresh streak from DB alongside task load
        try {
          const latest = await DailyPlanService.getUserProgress(userProfile.id);
          if (latest) {
            setUserProgress(latest);
            setStreak(latest.current_streak || 0);
          }
        } catch {}
      } else {
        // If missing, try generate and reload
        await DailyPlanService.generateDailyTasks(userProfile.id, dayToLoad);
        const regenerated = await DailyPlanService.getDailyTasks(userProfile.id, dayToLoad);
        setDailyTasks(regenerated?.tasks || []);
        setCompletedTasks(regenerated?.completed_tasks || []);
        setIsDayCompleted(regenerated?.is_completed || false);
        try {
          const latest = await DailyPlanService.getUserProgress(userProfile.id);
          if (latest) {
            setUserProgress(latest);
            setStreak(latest.current_streak || 0);
          }
        } catch {}
      }
    } catch (error) {
      console.error('Error loading daily data:', error);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getPlanDescription = (day) => {
    if (day <= 30) {
      return "Building foundational habits for height growth";
    } else if (day <= 60) {
      return "Advancing to intensive growth exercises";
    } else if (day <= 90) {
      return "Optimizing your growth potential";
    } else {
      return "Maintaining your growth achievements";
    }
  };

  const resetPlan = async () => {
    try {
      if (!userProfile) return;

      Alert.alert(
        'Reset Plan',
        'Are you sure you want to reset your 120-day plan? This will delete all your progress and start from Day 1.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: async () => {
              // Reset user progress to Day 1
              const { error } = await supabase
                .from('user_progress')
                .update({
                  current_day: 1,
                  current_streak: 0,
                  total_streak: 0,
                  longest_streak: 0,
                  total_tasks_completed: 0,
                  plan_start_date: new Date().toISOString().split('T')[0],
                  last_activity_date: new Date().toISOString().split('T')[0]
                })
                .eq('user_id', userProfile.id);

              if (error) throw error;

              // Delete all daily tasks
              await supabase
                .from('daily_tasks')
                .delete()
                .eq('user_id', userProfile.id);

              // Reload the page
              await initializeDailyRoutine();

              Alert.alert('Success', 'Your plan has been reset to Day 1!');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error resetting plan:', error);
      Alert.alert('Error', 'Failed to reset plan. Please try again.');
    }
  };

  const viewPlanProgress = () => {
    const progressPercentage = Math.round((currentDay / 120) * 100);
    const daysRemaining = 120 - currentDay;

    Alert.alert(
      'Plan Progress',
      `You're on Day ${currentDay} of 120\n\nProgress: ${progressPercentage}%\nDays Remaining: ${daysRemaining}\nCurrent Streak: ${streak} days\nPhase: ${userProgress ? DailyPlanService.getPhaseForDay(currentDay) : 'Loading...'}`,
      [{ text: 'OK' }]
    );
  };


  const toggleTaskCompletion = async (taskId) => {
    try {
      if (!userProfile || isDayCompleted) return;

      // Check if this is the special exercise task
      const task = dailyTasks.find(t => t.id === taskId);
      if (task && task.isSpecial && task.title === "Complete today's exercise from Hub") {
        // Mark the exercise task as completed (same path as other tasks)
        const result = await DailyPlanService.completeTask(userProfile.id, currentDay, taskId);

        // Update local state
        if (!completedTasks.includes(taskId)) {
          setCompletedTasks(prev => [...prev, taskId]);
        }

        // Show celebration
        setCelebrationMessage('Great job! Exercise task completed! 💪');
        setShowCelebration(true);

        // Check if all tasks are now completed
        const newCompletedCount = (completedTasks.includes(taskId) ? completedTasks.length : completedTasks.length + 1);
        const totalCount = dailyTasks.length;

        if (newCompletedCount === totalCount) {
          setIsDayCompleted(true);
          await SoundService.playCompletionSound();

          // Update streak if provided, otherwise fetch latest
          if (result.streak) {
            setStreak(result.streak.current_streak);
            setUserProgress(prev => ({
              ...prev,
              current_streak: result.streak.current_streak,
              total_streak: result.streak.total_streak,
              longest_streak: result.streak.longest_streak
            }));
            await NotificationService.checkStreakMilestones(userProfile.id);
          } else {
            try {
              const latest = await DailyPlanService.getUserProgress(userProfile.id);
              setStreak(latest?.current_streak || 1);
              setUserProgress(prev => ({ ...prev, current_streak: latest?.current_streak || 1 }));
            } catch {}
          }

          // Success haptic and final celebration message
          HapticFeedback.success();
          let message = `Congratulations! You've completed Day ${currentDay} of your 120-day growth plan!`;
          message += `\n\nYour streak: ${result.streak?.current_streak || streak} days!`;
          message += `\n\nCome back tomorrow for Day ${currentDay + 1} tasks!`;
          setCelebrationMessage(message);
          setShowCelebration(true);
        }
        return;
      }

      // Add haptic feedback for task interaction
      HapticFeedback.medium();

      // Complete task using DailyPlanService
      const result = await DailyPlanService.completeTask(userProfile.id, currentDay, taskId);

      // Update local state
      const newCompletedTasks = completedTasks.includes(taskId)
        ? completedTasks.filter(id => id !== taskId)
        : [...completedTasks, taskId];

      setCompletedTasks(newCompletedTasks);

      // Show celebration for individual task completion (if not all tasks completed)
      if (!result.isCompleted) {
        const completedCount = newCompletedTasks.length;
        const totalCount = dailyTasks.length;

        setCelebrationMessage(`Great job! ${completedCount}/${totalCount} tasks completed. Keep it up!`);
        setShowCelebration(true);
      }

      // Update streak if all tasks completed
      if (result.isCompleted) {
        setIsDayCompleted(true);
        // Play completion sound
        await SoundService.playCompletionSound();

        // Use the streak data returned from completeTask, or fetch latest as fallback
        if (result.streak) {
          setStreak(result.streak.current_streak);
          setUserProgress(prev => ({
            ...prev,
            current_streak: result.streak.current_streak,
            total_streak: result.streak.total_streak,
            longest_streak: result.streak.longest_streak
          }));
          await NotificationService.checkStreakMilestones(userProfile.id);
        } else {
          try {
            const latest = await DailyPlanService.getUserProgress(userProfile.id);
            setStreak(latest?.current_streak || 1);
            setUserProgress(prev => ({ ...prev, current_streak: latest?.current_streak || 1 }));
          } catch {}
        }

        // Add success haptic feedback for day completion
        HapticFeedback.success();

        // Show completion celebration
        let message = `Congratulations! You've completed Day ${currentDay} of your 120-day growth plan!\n\nYour streak: ${result.streak?.current_streak || streak} days!`;

        message += `\n\nCome back tomorrow for Day ${currentDay + 1} tasks!`;

        setCelebrationMessage(message);
        setShowCelebration(true);
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
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  };

  // -------- Weekly Plan Logic --------
  const PLAN_STORAGE_KEY = 'ph_weekly_plan_v1';
  const STREAK_KEY = 'ph_weekly_streak_v1';
  const PERSIST_ENABLED = false;

  const safeSetItem = async (key, value) => {
    try {
      if (!PERSIST_ENABLED) return;
      let str;
      if (typeof value === 'string') {
        str = value;
      } else {
        str = JSON.stringify(value);
      }
      if (str == null) {
        str = JSON.stringify({});
      }
      await AsyncStorage.setItem(key, str);
    } catch (e) {
      console.error('AsyncStorage setItem failed for key', key, e);
    }
  };

  const defaultDayBlocks = () => ([
    {
      id: 'stretching',
      title: 'Stretching & Posture',
      tasks: [
        { id: 'seated_twist', title: 'Seated twist 1 min', done: false },
        { id: 'pigeon', title: 'Pigeon both sides', done: false },
      ],
    },
    {
      id: 'sleep',
      title: 'Sleep Habits',
      tasks: [
        { id: 'screens_off', title: 'Screens off 30m before bed', done: false },
        { id: 'bedtime', title: 'Fixed bedtime', done: false },
      ],
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      tasks: [
        { id: 'water', title: 'Drink 8 glasses water', done: false },
        { id: 'protein', title: 'Hit protein goal', done: false },
      ],
    },
  ]);

  const generateDefaultPlan = () => {
    const weeks = 4;
    const daysPerWeek = 7;
    const baseDate = new Date();
    baseDate.setHours(0,0,0,0);

    const planObj = {
      weeks: Array.from({ length: weeks }, (_, w) => ({
        weekNumber: w + 1,
        days: Array.from({ length: daysPerWeek }, (_, d) => ({
          index: d,
          date: new Date(baseDate.getTime() + (w * daysPerWeek + d) * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          locked: w > 0,
          blocks: defaultDayBlocks(),
        })),
      })),
    };
    return planObj;
  };

  const initializeWeeklyPlan = async () => {
    try {
      if (!PERSIST_ENABLED) {
        const generated = generateDefaultPlan();
        setPlan(generated);
        setWeeklyStreak(0);
        return;
      }

      const saved = await AsyncStorage.getItem(PLAN_STORAGE_KEY);
      const savedStreak = await AsyncStorage.getItem(STREAK_KEY);
      if (saved) {
        setPlan(JSON.parse(saved));
      } else {
        const generated = generateDefaultPlan();
        setPlan(generated);
        await safeSetItem(PLAN_STORAGE_KEY, generated);
      }
      setWeeklyStreak(savedStreak ? parseInt(savedStreak) : 0);
    } catch (e) {
      console.error('initializeWeeklyPlan error', e);
    }
  };

  const persistPlan = async (nextPlan) => {
    setPlan(nextPlan);
    await safeSetItem(PLAN_STORAGE_KEY, nextPlan);
  };

  const formatDayLabel = (iso) => {
    const d = new Date(iso);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getMonth()];
    const day = d.getDate();
    return `${month} ${day}`;
  };

  const toggleTask = (weekIdx, dayIdx, blockId, taskId) => {
    if (!plan) return;
    const next = { ...plan };
    const day = next.weeks[weekIdx].days[dayIdx];
    if (day.locked) return;
    const block = day.blocks.find(b => b.id === blockId);
    if (!block) return;
    const task = block.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.done = !task.done;
    persistPlan(next);
  };

  const completeDay = async (weekIdx, dayIdx) => {
    if (!plan) return;
    const next = { ...plan };
    const week = next.weeks[weekIdx];
    const day = week.days[dayIdx];
    if (day.locked) return;

    day.blocks.forEach(b => b.tasks.forEach(t => t.done = true));
    day.completed = true;

    const allDaysDone = week.days.every(d => d.completed);
    if (allDaysDone && next.weeks[weekIdx + 1]) {
      next.weeks[weekIdx + 1].days.forEach(d => d.locked = false);
    }

    try {
      const todayKey = new Date().toDateString();
      const dayKey = new Date(day.date).toDateString();
      if (todayKey === dayKey) {
        const nextStreak = weeklyStreak + 1;
        setWeeklyStreak(nextStreak);
        await safeSetItem(STREAK_KEY, String(nextStreak));
      }
    } catch {}

    await persistPlan(next);
  };

  const isDateSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const progressPercentage = dailyTasks.length > 0 ? (completedTasks.length / dailyTasks.length) * 100 : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            Loading daily routine...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DailyHeader
          styles={styles}
          colors={colors}
          currentDay={currentDay}
          phase={userProgress ? DailyPlanService.getPhaseForDay(currentDay) : 'Loading...'}
          onPressSettings={() => {
            if (typeof onNavigateToProfile === 'function') {
              onNavigateToProfile();
            } else if (navigation && navigation.navigate) {
              navigation.navigate('profile');
            }
          }}
        />

        <DateSelector
          styles={styles}
          colors={colors}
          weekDates={weekDates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          formatDate={formatDate}
          isDateSelected={isDateSelected}
        />

        <PlanOverview
          styles={styles}
          colors={colors}
          currentDay={currentDay}
          phaseText={userProgress ? DailyPlanService.getPhaseForDay(currentDay) : 'Loading...'}
          descriptionText={getPlanDescription(currentDay)}
          onViewProgress={viewPlanProgress}
          onReset={resetPlan}
        />

        {/* Streaks Section */}
        <View style={styles.streaksSection}>
          <View style={styles.streaksHeader}>
            <View style={styles.streaksTitle}>
              {!showCelebration && (
                <Flame size={20} color="#FF6B35" />
              )}
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
              Today's Tasks
            </Text>
            <Text style={[styles.progressCount, { color: colors.textSecondary }]}>
              {completedTasks.length}/{dailyTasks.length} completed
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

        <TasksList
          styles={styles}
          colors={colors}
          dailyTasks={dailyTasks}
          completedTasks={completedTasks}
          isDayCompleted={isDayCompleted}
          toggleTaskCompletion={toggleTaskCompletion}
        />

        {/* Day Completion Message */}
        {isDayCompleted && (
          <View style={[styles.completionMessage, { backgroundColor: colors.primary + '15' }]}>
            <View style={styles.completionContent}>
              <Text style={[styles.completionEmoji]}>🎉</Text>
              <Text style={[styles.completionTitle, { color: colors.primary }]}>
                Day {currentDay} Complete!
              </Text>
              <Text style={[styles.completionSubtitle, { color: colors.textSecondary }]}>
                Great job! You've completed all {dailyTasks.length} tasks for today.
              </Text>
              <Text style={[styles.completionText, { color: colors.textSecondary }]}>
                Come back tomorrow for Day {currentDay + 1} tasks!
              </Text>
            </View>
          </View>
        )}


        {/* Weekly Summary removed */}
      </ScrollView>


      {/* Celebration Modal */}
      <CelebrationModal
        visible={showCelebration}
        onClose={() => setShowCelebration(false)}
        title="🎉 Great Job!"
        message={celebrationMessage}
        showConfetti={true}
        autoClose={true}
        autoCloseDelay={4000}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
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
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_400Regular',
    marginTop: 2,
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
  planSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planLabel: {
    fontSize: 18,
    fontFamily: 'RobotoCondensed_700Bold',
    letterSpacing: 0.3,
  },
  planBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  planNumber: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  planProgressContainer: {
    height: 8,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  planProgressBar: {
    height: '100%',
    borderRadius: 5,
  },
  planDetails: {
    gap: 4,
    marginTop: 4,
  },
  planPhase: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_600SemiBold',
  },
  planDescription: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'RobotoCondensed_400Regular',
  },
  planManagement: {
    marginTop: 10,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  planButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'RobotoCondensed_600SemiBold',
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
  taskTitleContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  specialTaskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  specialTaskBadgeText: {
    fontSize: 10,
    fontFamily: 'RobotoCondensed_600SemiBold',
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
  completionMessage: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 32,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  completionContent: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 0,
  },
  completionEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 24,
    fontFamily: 'RobotoCondensed_700Bold',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_400Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  completionText: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_400Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  // Weekly Plan Styles
  weeklyPlanSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  weeklyPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weeklyPlanTitle: {
    flex: 1,
  },
  weeklyPlanLabel: {
    fontSize: 20,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  weekSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  weekButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  weekButtonText: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  weeklyDaysContainer: {
    gap: 12,
  },
  weeklyLoadingContainer: {
    gap: 12,
  },
  weeklyLoadingCard: {
    borderRadius: 12,
    padding: 16,
  },
  weeklyLoadingTitle: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  weeklyLoadingText: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'RobotoCondensed_400Regular',
  },
  weeklyLoadingDayTitle: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  weeklyLoadingDayText: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_400Regular',
    marginTop: 4,
  },
  weeklyDayCard: {
    borderRadius: 12,
    padding: 16,
  },
  weeklyDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyDayTitle: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  weeklyDayStatus: {
    fontSize: 12,
    fontFamily: 'RobotoCondensed_400Regular',
    marginTop: 4,
  },
  weeklyDayToggle: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_400Regular',
  },
  weeklyDayBlocks: {
    marginTop: 12,
    gap: 12,
  },
  weeklyBlock: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  weeklyBlockTitle: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_700Bold',
    marginBottom: 8,
  },
  weeklyTask: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  weeklyTaskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weeklyTaskCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  weeklyTaskText: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_400Regular',
    flex: 1,
  },
  weeklyCompleteButton: {
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  weeklyCompleteButtonText: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  weeklySummarySection: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    paddingBottom: 8,
  },
  weeklySummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weeklySummaryTitle: {
    fontSize: 18,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  weeklySummaryWeek: {
    fontSize: 13,
    fontFamily: 'RobotoCondensed_400Regular',
  },
  weeklySummaryCard: {
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F8F9FA',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  weeklySummaryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weeklySummaryProgressText: {
    marginLeft: 12,
  },
  weeklySummaryPercentage: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  weeklySummaryDays: {
    fontSize: 13,
    fontFamily: 'RobotoCondensed_400Regular',
  },
  weeklySummaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weeklySummaryStatLabel: {
    fontSize: 12,
    fontFamily: 'RobotoCondensed_400Regular',
  },
  weeklySummaryStatValue: {
    fontSize: 15,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  weeklyNextWeekButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  weeklyNextWeekButtonText: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_700Bold',
  },
});
