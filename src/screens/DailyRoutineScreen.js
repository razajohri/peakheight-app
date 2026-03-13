import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
import Icon from '../components/UI/Icon';
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
import ConfettiAnimation from '../components/UI/ConfettiAnimation';
import DailyHeader from '../components/Daily/DailyHeader';
import DateSelector from '../components/Daily/DateSelector';
import PlanOverview from '../components/Daily/PlanOverview';
import TasksList from '../components/Daily/TasksList';
import WeeklyPlan from '../components/Daily/WeeklyPlan';
import WeeklySummary from '../components/Daily/WeeklySummary';
import StreaksSection from '../components/Daily/StreaksSection';
import ProgressSummary from '../components/Daily/ProgressSummary';
import DayCompletionMessage from '../components/Daily/DayCompletionMessage';
import NotificationService from '../services/notificationService';
import { SoundService } from '../services/soundService';
import { useWeeklyPlan } from '../hooks/useWeeklyPlan';
import { generateWeekDates, formatDate, getPlanDescription, formatDayLabel } from '../utils/dailyRoutineUtils';
import HeightMeasurement from '../components/Progress/HeightMeasurement';
import StreakModal from '../components/Home/StreakModal';
import StreakFreezeModal from '../components/Home/StreakFreezeModal';
import SeedRetentionModal from '../components/Home/SeedRetentionModal';
import { StreakFreezeService } from '../services/streakFreezeService';
import * as Haptics from 'expo-haptics';
// useFocusEffect removed to avoid navigation dependency; using navigation listener instead

const { width } = Dimensions.get('window');

export default function DailyRoutineScreen({ navigation, onNavigateToProfile, onNavigateToHub }) {
  const { colors } = useTheme();
  const { userProfile, userProgress, fetchUserProfile } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyTasks, setDailyTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [streak, setStreak] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true); // Start with true for brief loading
  const [hasShownLoading, setHasShownLoading] = useState(false); // Track if we've shown loading
  const [userProgressLocal, setUserProgressLocal] = useState(null);
  const [isDayCompleted, setIsDayCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isStreakModalVisible, setStreakModalVisible] = useState(false);
  const [isFreezeModalVisible, setFreezeModalVisible] = useState(false);
  const [isSeedRetentionModalVisible, setSeedRetentionModalVisible] = useState(false);
  const [freezeStatus, setFreezeStatus] = useState({ available: false, previousStreak: 0, currentStreak: 0 });

  // Weekly plan state via hook
  const {
    selectedWeek,
    setSelectedWeek,
    selectedDayIndex,
    setSelectedDayIndex,
    plan,
    weeklyStreak,
    initializeWeeklyPlan,
    toggleTask: weeklyToggleTask,
    completeDay: weeklyCompleteDay,
  } = useWeeklyPlan();

  const weekDates = generateWeekDates();

  useEffect(() => {
    if (userProfile) {
    initializeDailyRoutine();
      initializeWeeklyPlan();
    }
  }, [userProfile]);

  // Auto-hide loading after 500ms maximum
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading && !hasShownLoading) {
        setLoading(false);
        setHasShownLoading(true);
      }
    }, 500); // Maximum 500ms loading

    return () => clearTimeout(timer);
  }, [loading, hasShownLoading]);

  useEffect(() => {
    if (!userProfile) return;
    if (!hasInitializedRef.current) return; // avoid duplicate load on first mount
    // When date changes, force refresh to get latest data
    loadDailyData(undefined, true);
  }, [selectedDate, userProfile]);

  const hasInitializedRef = useRef(false);
  const cacheKeyRef = useRef(null);

  // Cache key helper
  const getCacheKey = (userId, dayNumber) => {
    return `daily_tasks_cache_${userId}_${dayNumber}`;
  };

  // Invalidate cache when tasks are updated
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('dailyTasksUpdated', async () => {
      if (cacheKeyRef.current && userProfile?.id) {
        try {
          await AsyncStorage.removeItem(cacheKeyRef.current);
        } catch (error) {
          console.warn('Error invalidating cache:', error);
        }
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [userProfile?.id]);

  // Fetch freeze status
  useEffect(() => {
    const fetchFreezeStatus = async () => {
      if (userProfile?.id) {
        const status = await StreakFreezeService.getFreezeStatus(userProfile.id);
        setFreezeStatus(status);
      }
    };
    fetchFreezeStatus();
  }, [userProfile?.id]);

  // Refresh streak from DB whenever this screen gains focus
  useEffect(() => {
    if (!navigation || !navigation.addListener) return;
    let isActive = true;
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        if (!userProfile) return;
        const latest = await DailyPlanService.getUserProgress(userProfile.id);
        if (isActive && latest) {
          setUserProgressLocal(latest);
          setStreak(latest.current_streak || 0);
          
          // Check if day changed - if so, invalidate cache for old day and load new day
          if (latest.current_day !== currentDay) {
            // Day changed - clear old cache and reload with force refresh
            if (cacheKeyRef.current) {
              try {
                await AsyncStorage.removeItem(cacheKeyRef.current);
              } catch (error) {
                console.warn('Error clearing old day cache:', error);
              }
            }
            setCurrentDay(latest.current_day);
            await loadDailyData(latest.current_day, true);
          } else {
            // Same day - just reschedule reminders if needed (use cached data if available)
            const cacheKey = getCacheKey(userProfile.id, latest.current_day);
            try {
              const cachedData = await AsyncStorage.getItem(cacheKey);
              const dayTasks = cachedData ? JSON.parse(cachedData) : await DailyPlanService.getDailyTasks(userProfile.id, latest.current_day);
              if (dayTasks && !dayTasks.is_completed && dayTasks.tasks && dayTasks.tasks.length > 0) {
                NotificationService.scheduleTaskReminders(
                  userProfile.id,
                  latest.current_day,
                  dayTasks.tasks,
                  dayTasks.completed_tasks || []
                );
              }
            } catch (error) {
              console.warn('Error checking reminders on focus:', error);
            }
          }
        }
      } catch {}
    });
    return () => {
      isActive = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [navigation, userProfile?.id, currentDay]);

  const initializeDailyRoutine = async () => {
    try {
      // Ensure user's plan exists and current day is synced
      const progress = await DailyPlanService.syncCurrentDay(userProfile.id);
      setUserProgressLocal(progress);
      setCurrentDay(progress.current_day);
      setStreak(progress.current_streak || 0);

      // Load today's tasks - this will set loading to false when done
      await loadDailyData(progress.current_day);

      hasInitializedRef.current = true;
    } catch (error) {
      console.error('Error initializing daily routine:', error);
      setLoading(false); // Hide loading on error
    }
  };

  const loadDailyData = async (dayOverride, forceRefresh = false) => {
    try {
      if (!userProfile) {
        setLoading(false);
        return;
      }
      const dayToLoad = dayOverride || currentDay;
      const cacheKey = getCacheKey(userProfile.id, dayToLoad);
      cacheKeyRef.current = cacheKey;
      
      console.log('🔍 Starting to load daily data for day:', dayToLoad, 'User:', userProfile.id);
      
      let dayTasks = null;
      
      // Try to load from cache first (unless force refresh)
      if (!forceRefresh) {
        try {
          const cachedData = await AsyncStorage.getItem(cacheKey);
          if (cachedData) {
            dayTasks = JSON.parse(cachedData);
            console.log('✅ Loaded daily tasks from cache for day', dayToLoad);
            
            // Update UI immediately with cached data
            setDailyTasks(dayTasks.tasks || []);
            setCompletedTasks(dayTasks.completed_tasks || []);
            setIsDayCompleted(dayTasks.is_completed || false);
            setLoading(false);
            setHasShownLoading(true);
            
            // Schedule reminders in background (fire-and-forget)
            if (!dayTasks.is_completed && dayTasks.tasks && dayTasks.tasks.length > 0) {
              NotificationService.scheduleTaskReminders(
                userProfile.id,
                dayToLoad,
                dayTasks.tasks,
                dayTasks.completed_tasks || []
              ).catch(err => console.warn('Background notification scheduling error:', err));
            } else if (dayTasks.is_completed) {
              NotificationService.cancelTaskReminders(userProfile.id, dayToLoad)
                .catch(err => console.warn('Background notification cancellation error:', err));
            }
            
            // Return early - no need to fetch from database
            return;
          }
        } catch (cacheError) {
          console.warn('Error reading cache, will fetch from database:', cacheError);
        }
      }
      
      // Cache miss or force refresh - fetch from database
      console.log('📡 Fetching daily tasks from database for day', dayToLoad);
      dayTasks = await DailyPlanService.getDailyTasks(userProfile.id, dayToLoad);
      console.log('📦 Received dayTasks:', dayTasks ? 'exists' : 'null');

      if (dayTasks) {
        console.log('📋 Loading daily tasks for day', dayToLoad);
        console.log('   Tasks count:', dayTasks.tasks?.length || 0);
        console.log('   Completed tasks count:', dayTasks.completed_tasks?.length || 0);
        console.log('   Is completed:', dayTasks.is_completed);
        
        // Save to cache
        try {
          await AsyncStorage.setItem(cacheKey, JSON.stringify(dayTasks));
          console.log('💾 Cached daily tasks for day', dayToLoad);
        } catch (cacheError) {
          console.warn('Error saving to cache:', cacheError);
        }
        
        // Update UI immediately with task data
        setDailyTasks(dayTasks.tasks || []);
        setCompletedTasks(dayTasks.completed_tasks || []);
        setIsDayCompleted(dayTasks.is_completed || false);
        setLoading(false); // Hide loading immediately - don't wait for background operations
        setHasShownLoading(true);
        
        // Schedule reminders in background (fire-and-forget, don't block UI)
        if (!dayTasks.is_completed && dayTasks.tasks && dayTasks.tasks.length > 0) {
          NotificationService.scheduleTaskReminders(
            userProfile.id,
            dayToLoad,
            dayTasks.tasks,
            dayTasks.completed_tasks || []
          ).catch(err => console.warn('Background notification scheduling error:', err));
        } else if (dayTasks.is_completed) {
          NotificationService.cancelTaskReminders(userProfile.id, dayToLoad)
            .catch(err => console.warn('Background notification cancellation error:', err));
          }
      } else {
        // If missing, try generate and reload
        await DailyPlanService.generateDailyTasks(userProfile.id, dayToLoad);
        const regenerated = await DailyPlanService.getDailyTasks(userProfile.id, dayToLoad);
        
        // Save regenerated data to cache
        if (regenerated) {
          try {
            await AsyncStorage.setItem(cacheKey, JSON.stringify(regenerated));
            console.log('💾 Cached regenerated daily tasks for day', dayToLoad);
          } catch (cacheError) {
            console.warn('Error saving regenerated data to cache:', cacheError);
          }
        }
        
        // Update UI immediately with regenerated data
        setDailyTasks(regenerated?.tasks || []);
        setCompletedTasks(regenerated?.completed_tasks || []);
        setIsDayCompleted(regenerated?.is_completed || false);
        setLoading(false); // Hide loading immediately
        setHasShownLoading(true);
        
        // Schedule reminders in background (fire-and-forget)
        if (regenerated && !regenerated.is_completed && regenerated.tasks && regenerated.tasks.length > 0) {
          NotificationService.scheduleTaskReminders(
            userProfile.id,
            dayToLoad,
            regenerated.tasks,
            regenerated.completed_tasks || []
          ).catch(err => console.warn('Background notification scheduling error:', err));
          }
      }
    } catch (error) {
      console.error('Error loading daily data:', error);
      setLoading(false); // Hide loading on error
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
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
      `You're on Day ${currentDay} of 120\n\nProgress: ${progressPercentage}%\nDays Remaining: ${daysRemaining}\nCurrent Streak: ${streak} days\nPhase: ${userProgressLocal ? DailyPlanService.getPhaseForDay(currentDay) : 'Loading...'}`,
      [{ text: 'OK' }]
    );
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };


  // IMPORTANT: This function should ONLY be called when user explicitly clicks/taps a task
  // Never auto-complete tasks or call this function programmatically without user interaction
  const toggleTaskCompletion = async (taskId) => {
    try {
      if (!userProfile) {
        console.warn('Cannot complete task: user profile not available');
        return;
      }

      // Validate taskId
      if (!taskId) {
        console.error('Cannot complete task: taskId is missing');
        return;
      }

      // Allow task completion even if day is marked as completed
      // This enables users to complete newly added supplements/tasks
      // The backend will properly recalculate day completion status

      // OPTIMISTIC UI UPDATE - Update UI immediately for instant feedback
      const isCurrentlyCompleted = completedTasks.includes(taskId);
      
      // Prevent uncompleting tasks - once completed, they stay completed
      if (isCurrentlyCompleted) {
        console.log('Task already completed, cannot undo');
        return;
      }
      
      const newCompletedTasks = [...completedTasks, taskId];

      // Update local state immediately
      setCompletedTasks(newCompletedTasks);

      // Invalidate cache when task is updated (will be reloaded on next visit)
      if (cacheKeyRef.current) {
        try {
          await AsyncStorage.removeItem(cacheKeyRef.current);
        } catch (error) {
          console.warn('Error invalidating cache on task update:', error);
        }
      }

      // Notify other components (e.g., GrowthFactors) to refresh their data
      DeviceEventEmitter.emit('dailyTasksUpdated');

      // Add haptic feedback for task interaction
      HapticFeedback.medium();

      // Show immediate celebration for individual task completion
      if (!isCurrentlyCompleted) {
        const completedCount = newCompletedTasks.length;
        const totalCount = dailyTasks.length;

        setCelebrationMessage(`Great job! ${completedCount}/${totalCount} tasks completed. Keep it up!`);
        setShowCelebration(true);
      }

      // Check if all tasks are now completed (optimistic check)
      // Only show celebration if this is the first time completing all tasks
      if (newCompletedTasks.length === dailyTasks.length && !isDayCompleted) {
        setIsDayCompleted(true);
        await SoundService.playCompletionSound();

        // Trigger confetti animation
        setShowConfetti(true);

        // Success haptic and final celebration message
        HapticFeedback.success();
        let message = `Congratulations! You've completed Day ${currentDay} of your 120-day growth plan!`;
        message += `\n\nYour streak: ${streak + 1} days!`;
        message += `\n\nCome back tomorrow for Day ${currentDay + 1} tasks!`;
        setCelebrationMessage(message);
        setShowCelebration(true);
      } else if (newCompletedTasks.length < dailyTasks.length && isDayCompleted) {
        // If day was completed but now has incomplete tasks, mark as incomplete
        setIsDayCompleted(false);
      }

      // BACKGROUND DATABASE UPDATE - Don't wait for this
      DailyPlanService.completeTask(userProfile.id, currentDay, taskId)
        .then(async (result) => {
          // Update day completion status from backend result
          // This ensures accuracy when new supplements are added after day completion
          setIsDayCompleted(result.isCompleted);
          
          // Update streak data in background if all tasks completed
          if (result.isCompleted && result.streak) {
            setStreak(result.streak.current_streak);
            setUserProgressLocal(prev => ({
              ...prev,
              current_streak: result.streak.current_streak,
              total_streak: result.streak.total_streak,
              longest_streak: result.streak.longest_streak
            }));
            NotificationService.checkStreakMilestones(userProfile.id);
            // Cancel all task reminders since day is completed
            NotificationService.cancelTaskReminders(userProfile.id, currentDay);
          } else {
            // Day is no longer complete (e.g., user unchecked a task or added new tasks)
            // Update reminders for remaining incomplete tasks
            NotificationService.scheduleTaskReminders(
              userProfile.id,
              currentDay,
              dailyTasks,
              newCompletedTasks
            );
          }

          // Invalidate cache after server confirms task completion
          if (cacheKeyRef.current) {
            try {
              await AsyncStorage.removeItem(cacheKeyRef.current);
            } catch (error) {
              console.warn('Error invalidating cache after task completion:', error);
            }
          }

          // Emit again after server confirms for robustness
          DeviceEventEmitter.emit('dailyTasksUpdated');

          // Reload fresh data from backend so completed tasks can't \"undo\"
          // when revisiting the screen (avoids stale cache or local state)
          await loadDailyData(currentDay, true);
        })
        .catch(error => {
          console.error('Background task completion failed:', error);
          // Keep optimistic UI state (completed checkmarks) so tasks don't flip back
          // Show error message so user knows backend failed
          setCelebrationMessage('Task completion saved locally, but sync failed. Please try again later.');
          setShowCelebration(true);
        });

    } catch (error) {
      console.error('Error in toggleTaskCompletion:', error);
      // Keep optimistic UI state; just notify user
      setCelebrationMessage('Something went wrong while saving your progress. Your checkmarks are kept.');
      setShowCelebration(true);
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


  // Weekly plan implementation moved into useWeeklyPlan hook

  // initializeWeeklyPlan now provided by useWeeklyPlan



  const toggleTask = weeklyToggleTask;

  const completeDay = weeklyCompleteDay;

  const isDateSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Brief loading state (less than 1 second)
  const safeUserProgress = userProgressLocal || { current_day: 1, current_streak: 0 };
  const safeDailyTasks = dailyTasks || [];
  const safeCompletedTasks = completedTasks || [];

  const progressPercentage = safeDailyTasks.length > 0 ? (safeCompletedTasks.length / safeDailyTasks.length) * 100 : 0;

  // Show brief loading only if loading is true and we haven't shown it yet
  if (loading && !hasShownLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            Loading today's tasks...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        scrollEnabled={true}
        overScrollMode={Platform.OS === 'android' ? 'never' : undefined}
        contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'never' : undefined}
        automaticallyAdjustContentInsets={Platform.OS === 'ios' ? false : undefined}
        contentInset={Platform.OS === 'ios' ? { top: 0, bottom: 0, left: 0, right: 0 } : undefined}
        scrollEventThrottle={16}
      >
        <DailyHeader
          styles={styles}
          colors={colors}
          currentDay={currentDay}
          phase={safeUserProgress ? DailyPlanService.getPhaseForDay(currentDay) : 'Growth Hormone'}
          onPressStreak={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            await SoundService.playStreakSound();
            setStreakModalVisible(true);
          }}
          onPressShield={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSeedRetentionModalVisible(true);
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
          allowDateSelection={false}
        />

        <StreaksSection
          styles={styles}
          colors={colors}
          streak={streak}
          showCelebration={showCelebration}
          onViewProgress={viewPlanProgress}
        />

        <TasksList
          styles={styles}
          colors={colors}
          dailyTasks={safeDailyTasks}
          completedTasks={safeCompletedTasks}
          isDayCompleted={isDayCompleted}
          toggleTaskCompletion={toggleTaskCompletion}
          onNavigateToHub={onNavigateToHub}
        />

        <DayCompletionMessage
          styles={styles}
          colors={colors}
          isDayCompleted={isDayCompleted}
          currentDay={currentDay}
          taskCount={safeDailyTasks.length}
        />

        {/* Height Measurement Component */}
        {userProfile && (
          <HeightMeasurement
            userId={userProfile.id}
            onMeasurementAdded={() => {
              // Refresh any relevant data when measurement is added
              console.log('Height measurement added');
            }}
          />
        )}
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

      {/* Confetti Animation */}
      <ConfettiAnimation
        visible={showConfetti}
        onComplete={handleConfettiComplete}
      />

      {/* Streak Modal */}
      <StreakModal
        visible={isStreakModalVisible}
        onClose={() => setStreakModalVisible(false)}
        userProgress={userProgress || userProgressLocal}
        freezeStatus={freezeStatus}
        onUseFreeze={() => {
          setStreakModalVisible(false);
          setFreezeModalVisible(true);
        }}
      />

      {/* Streak Freeze Modal */}
      <StreakFreezeModal
        visible={isFreezeModalVisible}
        onClose={() => setFreezeModalVisible(false)}
        previousStreak={freezeStatus.previousStreak}
        onRestore={async () => {
          if (userProfile?.id) {
            const result = await StreakFreezeService.useStreakFreeze(userProfile.id);
            if (result.success) {
              if (fetchUserProfile) {
                await fetchUserProfile(userProfile.id);
              }
              setFreezeModalVisible(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert(
                '❄️ Streak Restored!',
                `Your streak of ${result.restoredStreak} days has been restored! Keep up the amazing work! 🔥`
              );
            } else {
              Alert.alert('Error', result.error || 'Failed to restore streak. Please try again.');
            }
          }
        }}
      />

      {/* Seed Retention Modal */}
      <SeedRetentionModal
        visible={isSeedRetentionModalVisible}
        onClose={() => setSeedRetentionModalVisible(false)}
      />
    </View>
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
    flexGrow: 0,
    paddingBottom: 0,
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
    paddingHorizontal: 17,
    // Move header even higher on iOS while keeping Android spacing the same
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
    paddingBottom: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 39,
    fontFamily: 'RobotoCondensed_700Bold',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_600SemiBold',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  phaseBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  phaseBadgeText: {
    fontSize: 12,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  settingsButton: {
    padding: 8,
  },
  dateSelector: {
    paddingHorizontal: 17,
    marginBottom: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    minWidth: 70,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'RobotoCondensed_700Bold',
    letterSpacing: 0.3,
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
    paddingHorizontal: 17,
    marginBottom: 8,
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
    fontSize: 19,
    fontFamily: 'RobotoCondensed_700Bold',
    letterSpacing: 0.4,
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
  viewProgressButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  viewProgressButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'RobotoCondensed_700Bold',
    letterSpacing: 0.5,
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
    paddingHorizontal: 17,
    gap: 10,
  },
  taskCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 15,
    fontFamily: 'RobotoCondensed_400Regular',
    flex: 1,
  },
  taskTitleContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  specialTaskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  specialTaskBadgeText: {
    fontSize: 12,
    fontFamily: 'RobotoCondensed_600SemiBold',
  },
  infoButton: {
    padding: 8,
    marginLeft: 8,
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
