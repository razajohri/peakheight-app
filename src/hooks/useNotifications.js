import { useState, useEffect } from 'react';
import NotificationService from '../services/notificationService';
import { useUser } from '../contexts/UserContext';

export const useNotifications = () => {
  const { userProfile } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    if (userProfile) {
      initializeNotifications();
    }
  }, [userProfile]);

  const initializeNotifications = async () => {
    try {
      // Initialize notification service
      await NotificationService.initialize();

      // Load user preferences
      const prefs = await NotificationService.getUserNotificationPreferences(userProfile.id);
      setPreferences(prefs);

      // Schedule notifications based on preferences
      if (prefs) {
        await NotificationService.scheduleDailyNotifications(userProfile.id, prefs);
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const sendTestNotification = async () => {
    if (userProfile) {
      await NotificationService.sendImmediateNotification(
        'Test Notification',
        'This is a test notification from PeakHeight! 🎯',
        userProfile.id,
        'test'
      );
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
