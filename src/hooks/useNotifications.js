import { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import NotificationService from '../services/notificationService';
import { useUser } from '../contexts/UserContext';
import { DailyPlanService } from '../services/dailyPlanService';

export const useNotifications = () => {
  const { userProfile } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [initializationAttempted, setInitializationAttempted] = useState(false);

  // Check for incomplete tasks and schedule reminders
  const checkAndScheduleTaskReminders = async () => {
    if (!userProfile?.id) return;
    
    try {
      // Get current user progress
      const progress = await DailyPlanService.getUserProgress(userProfile.id);
      if (!progress) return;

      // Get current day's tasks
      const dayTasks = await DailyPlanService.getDailyTasks(userProfile.id, progress.current_day);
      
      if (dayTasks && !dayTasks.is_completed && dayTasks.tasks && dayTasks.tasks.length > 0) {
        // Schedule reminders for incomplete tasks
        await NotificationService.scheduleTaskReminders(
          userProfile.id,
          progress.current_day,
          dayTasks.tasks,
          dayTasks.completed_tasks || []
        );
        console.log('✅ Scheduled task reminders globally for incomplete tasks');
      }
    } catch (error) {
      console.warn('⚠️ Failed to check and schedule task reminders:', error);
    }
  };

  useEffect(() => {
    if (userProfile && !isInitialized && !initializationAttempted) {
      setInitializationAttempted(true);
      // Add a delay to prevent notifications from firing immediately when data loads
      const timer = setTimeout(() => {
        initializeNotifications();
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    }
  }, [userProfile, isInitialized, initializationAttempted]);

  // Check for incomplete tasks when app comes to foreground
  useEffect(() => {
    if (!userProfile?.id || !isInitialized) return;

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground, check for incomplete tasks
        checkAndScheduleTaskReminders();
      }
    });

    return () => subscription?.remove();
  }, [userProfile?.id, isInitialized]);

  const initializeNotifications = async () => {
    if (isInitialized) {
      console.log('Notifications already initialized, skipping...');
      return;
    }

    try {
      // Initialize notification service
      await NotificationService.initialize();

      // Load user preferences (will return defaults if not found)
      try {
        const prefs = await NotificationService.getUserNotificationPreferences(userProfile.id);
        setPreferences(prefs);

        // Schedule notifications based on preferences (prefs will always have defaults)
        if (prefs) {
          await NotificationService.scheduleDailyNotifications(userProfile.id, prefs);
        } else {
          // Fallback: use default preferences if getUserNotificationPreferences returns null
          const defaultPrefs = {
            morning_reminders: true,
            afternoon_reminders: true,
            evening_reminders: true,
            streak_notifications: true,
            morning_time: '08:00',
            afternoon_time: '14:00',
            evening_time: '20:00',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
          };
          await NotificationService.scheduleDailyNotifications(userProfile.id, defaultPrefs);
        }
      } catch (prefsError) {
        console.warn('Failed to load notification preferences:', prefsError);
        // Use defaults and schedule anyway
        const defaultPrefs = {
          morning_reminders: true,
          afternoon_reminders: true,
          evening_reminders: true,
          streak_notifications: true,
          morning_time: '08:00',
          afternoon_time: '14:00',
          evening_time: '20:00',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        };
        try {
          await NotificationService.scheduleDailyNotifications(userProfile.id, defaultPrefs);
        } catch (scheduleError) {
          console.error('Failed to schedule notifications with defaults:', scheduleError);
        }
      }

      setIsInitialized(true);
      
      // After initialization, check for incomplete tasks and schedule reminders
      setTimeout(() => {
        checkAndScheduleTaskReminders();
      }, 3000); // Wait 3 seconds after initialization to ensure everything is ready
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const sendTestNotification = async () => {
    console.log('🧪 sendTestNotification called, userProfile:', userProfile?.id);
    if (userProfile) {
      try {
        // Use the new test notification function that schedules for 5 seconds
        await NotificationService.sendTestNotification(userProfile.id, 5);
        console.log('✅ Test notification scheduled successfully - will appear in 5 seconds');
        return true;
      } catch (error) {
        console.error('❌ Error in sendTestNotification:', error);
        throw error;
      }
    } else {
      console.error('No user profile available for test notification');
      throw new Error('User profile not found');
    }
  };

  const sendStreakCelebration = async (streakDays) => {
    if (userProfile) {
      await NotificationService.sendStreakCelebration(streakDays, userProfile.id);
    }
  };

  const sendAchievementNotification = async (achievement) => {
    if (userProfile) {
      await NotificationService.sendAchievementNotification(achievement, userProfile.id);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      if (userProfile) {
        await NotificationService.updateUserNotificationPreferences(
          userProfile.id,
          newPreferences
        );
        setPreferences(newPreferences);
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  };

  const cancelAllNotifications = () => {
    NotificationService.cancelAllNotifications();
  };

  return {
    isInitialized,
    preferences,
    sendTestNotification,
    sendStreakCelebration,
    sendAchievementNotification,
    updatePreferences,
    cancelAllNotifications,
  };
};
