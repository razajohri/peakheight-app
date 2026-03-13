import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { supabase } from '../config/supabase';
import { SoundService } from './soundService';

class NotificationService {
  static initialized = false;
  static schedulingInProgress = new Set();
  static notificationListenerAdded = false;
  static taskRemindersScheduled = new Map(); // Track scheduled reminders by userId-dayNumber

  // Notification message templates organized by category
  static MESSAGE_TEMPLATES = {
    sleep: {
      evening: [
        "Growth happens when you sleep, aim for 8+ hours tonight.",
        "Your body releases the most growth hormone during deep sleep. Time to wind down.",
        "Screens off = gains on. Blue light blocks melatonin, which affects your growth cycle.",
        "Sleep is your secret weapon for growth. Turn off those screens and rest up! 😴",
        "Your growth hormone peaks during sleep. Make tonight count! 🌙"
      ],
      morning: [
        "How was your sleep? Log it to track your growth recovery! 📊",
        "Well-rested? Your body is ready for another day of growth! ☀️",
        "Sleep quality affects growth. How did you sleep last night? 😴"
      ]
    },

    nutrition: {
      morning: [
        "Missed breakfast? That's a missed growth window. Grab something rich in protein.",
        "Protein fuels your growth, have you hit your target today?",
        "Start your day with protein to fuel your growth journey! 🥗",
        "Breakfast is your first growth opportunity of the day! 🍳"
      ],
      afternoon: [
        "Calcium + Vitamin D = strong bones. Don't skip your daily dose.",
        "Hydration check: even mild dehydration slows recovery.",
        "Lunch time! Fuel your growth with nutrient-rich foods! 🥗",
        "Your bones need calcium. Have you had your dairy today? 🥛"
      ],
      evening: [
        "Nutrition log is incomplete, finish it to unlock today's growth score.",
        "Dinner time! Complete your nutrition log for today's growth tracking! 📊",
        "End your day strong with a nutritious dinner! 🍽️"
      ]
    },

    exercise: {
      morning: [
        "Stretch time: a 5-minute posture session can keep your spine aligned.",
        "Morning stretches set you up for a taller day! 🧘‍♂️",
        "Start your day with spine alignment exercises! 💪"
      ],
      afternoon: [
        "Gravity pulls you down, but hanging stretches pull you back up. 2 mins now?",
        "Your workout streak is building stronger bones, keep it alive.",
        "Midday stretch break! Your spine will thank you! 🏋️‍♂️"
      ],
      evening: [
        "Reminder: skipping leg day = skipping growth fuel.",
        "Evening workout time! Build those strong bones! 💪",
        "Your exercise routine is waiting! Don't skip your growth session! 🏃‍♂️"
      ]
    },

    tracking: {
      morning: [
        "You're 3 days into your growth streak, consistency compounds.",
        "Your tracking streak is building momentum! Keep it going! 📈",
        "Every day you track brings you closer to your goal! 🎯"
      ],
      evening: [
        "Your average sleep this week was 6.5h. Aim for +1h to maximize growth hormone release.",
        "Track your progress to unlock your growth potential! 📊",
        "Log your daily activities to see your growth journey unfold! 📝"
      ]
    },

    motivation: {
      morning: [
        "Genes set the blueprint, but habits set the height.",
        "Future you is standing taller because of today's choices.",
        "Today's habits shape tomorrow's height! 🌱",
        "Every choice counts in your growth journey! 💪"
      ],
      afternoon: [
        "You don't control centimeters overnight, but you control the habits that unlock them.",
        "Consistency is the key to unlocking your growth potential! 🔑",
        "Small actions today = big results tomorrow! ⭐"
      ],
      evening: [
        "Every day you track, you're one step closer to maxing out your potential.",
        "Your dedication is building something amazing! 🏆",
        "Tomorrow's growth starts with today's commitment! 🌟"
      ]
    }
  };

  // Initialize notification service
  static async initialize() {
    if (this.initialized) {
      console.log('Notification service already initialized, skipping...');
      return;
    }

    try {
      // Initialize sound service
      await SoundService.initialize();

      // Configure notification behavior
      // Show all notifications (alerts, sounds, badges)
      Notifications.setNotificationHandler({
        handleNotification: async () => {
          return {
            // New Expo API: control banner & list appearance on iOS
            shouldShowBanner: true,
            shouldShowList: true,
            // Common behavior
            shouldPlaySound: true,
            shouldSetBadge: true,
          };
        },
      });

      // iOS: check permissions (don't request here - should be done on HomeScreen)
      const settings = await Notifications.getPermissionsAsync();
      const finalStatus = settings.status;
      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted - will be requested on HomeScreen');
        // Don't return here - continue initialization without permissions
        // Permission will be requested when user first sees HomeScreen
      }

      // Android: ensure channels exist
      if (Platform.OS === 'android') {
        await this.createNotificationChannels();
      }

      // Add notification listener to play custom sound (only add once)
      if (!this.notificationListenerAdded) {
        Notifications.addNotificationReceivedListener(async (notification) => {
          // Play custom notification sound
          await SoundService.playNotificationSound();
        });

        // Handle taps on notifications
        Notifications.addNotificationResponseReceivedListener((response) => {
          try {
            this.handleNotificationTap(response.notification.request.content.data || {});
          } catch (e) {
            console.warn('Failed handling notification tap:', e);
          }
        });
        
        this.notificationListenerAdded = true;
      }

      // Get push token (handle EAS projectId on dev/builds)
      const isUuid = (str) => {
        if (!str || typeof str !== 'string') return false;
        // More strict UUID validation
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
      };

      const resolveProjectId = () => {
        const candidates = [
          process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
          Constants?.expoConfig?.extra?.eas?.projectId,
          Constants?.easConfig?.projectId,
          Constants?.expoConfig?.projectId,
        ];

        console.log('Checking projectId candidates:', candidates);

        for (const id of candidates) {
          if (id && isUuid(id)) {
            console.log('Found valid projectId:', id);
            return id;
          }
        }
        console.log('No valid projectId found');
        return null;
      };

      // Only use projectId if it's a valid UUID and we're in production/EAS build
      const validProjectId = resolveProjectId();
      const shouldPassProjectId = Constants?.appOwnership !== 'expo' && validProjectId !== null;
      const projectId = shouldPassProjectId ? validProjectId : undefined;

      console.log('Final decision - shouldPassProjectId:', shouldPassProjectId, 'projectId:', projectId);

      let expoPushToken;
      try {
        if (projectId) {
          console.log('Attempting to get Expo push token with projectId:', projectId);
          expoPushToken = await Notifications.getExpoPushTokenAsync({ projectId });
        } else {
          console.log('Getting Expo push token without projectId (development mode)');
          expoPushToken = await Notifications.getExpoPushTokenAsync();
        }
        console.log('Push token obtained successfully:', expoPushToken.data);

        // Store token in database
        try {
          await this.storeNotificationToken(expoPushToken.data);
        } catch (storeError) {
          console.warn('Failed to store notification token:', storeError);
        }
      } catch (tokenError) {
        console.warn('Failed to get Expo push token, notifications will be disabled:', tokenError?.message || tokenError);
        // Don't throw - just continue without push notifications
        // Local notifications will still work
        expoPushToken = null;
      }

      this.initialized = true;
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Error initializing notification service:', error);
      // Don't throw the error - just log it and continue without notifications
      // This prevents the error from crashing the app during sign-in
    }
  }

  // Create notification channels for Android (Expo handles this automatically)
  static async createNotificationChannels() {
    try {
      // Expo automatically creates channels, but we can customize them
      await Notifications.setNotificationChannelAsync('growth-reminders', {
        name: 'Growth Reminders',
        description: 'Daily reminders for your growth journey',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
      });

      await Notifications.setNotificationChannelAsync('streak-alerts', {
        name: 'Streak Alerts',
        description: 'Important streak maintenance notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF5722',
      });

      // Create channel for task reminders
      await Notifications.setNotificationChannelAsync('task-reminders', {
        name: 'Task Reminders',
        description: 'Reminders for incomplete daily tasks',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });
    } catch (error) {
      console.error('Error creating notification channels:', error);
    }
  }

  // Store notification token in database
  static async storeNotificationToken(token) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users')
          .update({ push_notification_token: token })
          .eq('id', user.id);
        console.log('✅ Push token stored in database for user:', user.id);
      }
    } catch (error) {
      console.error('Error storing notification token:', error);
    }
  }

  // Manually refresh and store push token (useful for testing or if token wasn't stored)
  static async refreshPushToken() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Notification permissions not granted');
      }

      const Constants = (await import('expo-constants')).default;
      const resolveProjectId = () => {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId || 
                         Constants?.easConfig?.projectId ||
                         Constants?.manifest?.extra?.eas?.projectId;
        return projectId;
      };

      const validProjectId = resolveProjectId();
      const shouldPassProjectId = Constants?.appOwnership !== 'expo' && validProjectId !== null;
      const projectId = shouldPassProjectId ? validProjectId : undefined;

      let expoPushToken;
      try {
        if (projectId) {
          expoPushToken = await Notifications.getExpoPushTokenAsync({ projectId });
        } else {
          expoPushToken = await Notifications.getExpoPushTokenAsync();
        }

        console.log('Refreshed push token:', expoPushToken.data);
        await this.storeNotificationToken(expoPushToken.data);
        return expoPushToken.data;
      } catch (tokenError) {
        // Handle Firebase initialization error on Android
        if (tokenError?.message?.includes('Firebase') || tokenError?.message?.includes('FCM')) {
          console.warn('⚠️ Firebase/FCM not configured for Android push notifications.');
          console.warn('📱 Push notifications will work on iOS, but Android requires FCM setup.');
          console.warn('💡 For Android: Configure FCM credentials in Expo Dashboard or use EAS Build.');
          console.warn('🔗 Guide: https://docs.expo.dev/push-notifications/fcm-credentials/');
          
          // Don't throw - allow app to continue without push token
          // Local notifications will still work
          return null;
        }
        // Re-throw other errors
        throw tokenError;
      }
    } catch (error) {
      console.error('Error refreshing push token:', error);
      // Don't throw - gracefully handle the error
      // Local notifications will still work
      return null;
    }
  }

  // Schedule daily notifications based on user preferences
  static async scheduleDailyNotifications(userId, preferences) {
    // Prevent multiple simultaneous scheduling attempts
    if (this.schedulingInProgress.has(userId)) {
      console.log('Notification scheduling already in progress for user, skipping...');
      return;
    }

    this.schedulingInProgress.add(userId);

    try {
      // Check if notifications have already been scheduled for this user
      const { data: existingSchedule, error: scheduleError } = await supabase
        .from('notification_schedules')
        .select('*')
        .eq('user_id', userId)
        .eq('notification_type', 'daily_plan')
        .maybeSingle();

      if (scheduleError) {
        console.warn('Error checking existing schedule:', scheduleError);
      }

      if (existingSchedule && existingSchedule.is_active) {
        console.log('Notifications already scheduled for user, skipping...');
        return;
      }

      // Clear any existing notifications for this user first
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cleared existing notifications before scheduling new ones');

      const {
        morning_reminders = true,
        afternoon_reminders = true,
        evening_reminders = true,
        morning_time = '08:00',
        afternoon_time = '14:00',
        evening_time = '20:00',
        timezone = 'UTC'
      } = preferences;

      // Instead of 3 bigger blasts per day, schedule gentle hourly nudges
      // during the day based on the user's preferred window.
      await this.scheduleHourlyGrowthReminders(userId, {
        morning_time,
        afternoon_time,
        evening_time,
      });

      // Schedule streak check notification (10 PM)
      try {
        await this.scheduleStreakCheckNotification(userId);
      } catch (error) {
        console.warn('Failed to schedule streak check notification:', error);
      }

      // Mark notifications as scheduled in database
      try {
        await supabase
          .from('notification_schedules')
          .upsert({
            user_id: userId,
            notification_type: 'daily_plan',
            scheduled_time: '08:00:00',
            timezone: preferences.timezone || 'UTC',
            is_active: true,
            next_send: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,notification_type' });
      } catch (error) {
        console.warn('Failed to update notification schedule in database:', error);
      }

      console.log('Daily notifications scheduled successfully');

    } catch (error) {
      console.error('Error scheduling notifications:', error);
    } finally {
      // Always remove from scheduling in progress set
      this.schedulingInProgress.delete(userId);
    }
  }

  // Schedule notifications for a specific time category
  // NOTE: To avoid flooding the user, we now send **one** mixed-growth reminder
  // per time slot (morning/afternoon/evening) instead of 5 separate notifications.
  static async scheduleNotificationCategory(category, time, userId) {
    const categories = ['sleep', 'nutrition', 'exercise', 'tracking', 'motivation'];

    // Pick ONE random category for this time slot
    const type = categories[Math.floor(Math.random() * categories.length)];
    const messages = this.MESSAGE_TEMPLATES[type][category] || [];

    if (messages.length === 0) {
      return;
    }

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Parse time (e.g., "08:00" -> 8 hours, 0 minutes)
    const [hours, minutes] = time.split(':').map(Number);

    // Create trigger for daily notification - ensure it's for tomorrow if time has passed
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the scheduled time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    // Add minimum 1 hour delay to prevent immediate notifications on app open
    const minDelay = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    if (scheduledTime < minDelay) {
      scheduledTime.setTime(minDelay.getTime());
    }

    const trigger = {
      date: scheduledTime,
      repeats: true,
    };

    await this.scheduleLocalNotification(
      this.getNotificationTitle(type),
      randomMessage,
      trigger,
      {
        category: type,
        time: category,
        userId: userId
      }
    );
  }

  // Schedule hourly growth reminders within a reasonable daytime window.
  // We derive a start/end window from the user's preferred morning/evening times,
  // then schedule one mixed-growth notification for each hour in that window.
  static async scheduleHourlyGrowthReminders(userId, { morning_time, evening_time }) {
    try {
      // Parse morning/evening hours; fall back to 09:00–21:00 if parsing fails
      const parseHour = (time, fallback) => {
        if (!time || typeof time !== 'string' || !time.includes(':')) return fallback;
        const [h] = time.split(':').map(Number);
        if (Number.isNaN(h) || h < 0 || h > 23) return fallback;
        return h;
      };

      const startHour = parseHour(morning_time, 9);
      const endHour = parseHour(evening_time, 21);

      const categories = ['sleep', 'nutrition', 'exercise', 'tracking', 'motivation'];
      const now = new Date();

      for (let hour = startHour; hour <= endHour; hour++) {
        // Pick one random category + message for this hour
        const type = categories[Math.floor(Math.random() * categories.length)];
        const slot = hour === startHour ? 'morning' : hour === endHour ? 'evening' : 'afternoon';
        const bucket = this.MESSAGE_TEMPLATES[type][slot] || this.MESSAGE_TEMPLATES[type].morning || [];
        if (!bucket.length) continue;

        const message = bucket[Math.floor(Math.random() * bucket.length)];

        const scheduledTime = new Date();
        scheduledTime.setHours(hour, 0, 0, 0);

        // If this hour has already passed today, push to tomorrow
        if (scheduledTime <= now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        // Ensure at least 1 hour from "now" to avoid firing immediately on first app open
        const minDelay = new Date(now.getTime() + 60 * 60 * 1000);
        if (scheduledTime < minDelay) {
          scheduledTime.setTime(minDelay.getTime());
        }

        const trigger = {
          date: scheduledTime,
          repeats: true, // daily at this hour
        };

        await this.scheduleLocalNotification(
          this.getNotificationTitle(type),
          message,
          trigger,
          {
            category: type,
            time: slot,
            userId,
          }
        );
      }
    } catch (error) {
      console.warn('Failed to schedule hourly growth reminders:', error);
    }
  }

  // Schedule streak check notification (now uses server-side push via database cron)
  // This function is kept for backwards compatibility but streak checks are now handled by database cron
  static async scheduleStreakCheckNotification(userId) {
    // Streak check notifications are now sent via server-side push through database cron job
    // See database migration for pg_cron setup
    console.log('Streak check notifications are now handled by server-side push via database cron');
  }

  // Send streak check notification via server-side push (called by database cron)
  static async sendStreakCheckNotification(userId) {
    try {
      // Get user's current streak and today's progress
      const { data: userProgress } = await supabase
        .from('user_progress')
        .select('current_streak, current_day')
        .eq('user_id', userId)
        .maybeSingle();

      const { data: todayTasks } = await supabase
        .from('daily_tasks')
        .select('completion_percentage, is_completed')
        .eq('user_id', userId)
        .eq('date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      // Only send if user has a streak and tasks are incomplete
      if (userProgress && todayTasks && !todayTasks.is_completed && userProgress.current_streak > 0) {
        const messages = [
          "Your streak is waiting for you! Complete your tasks before midnight! 🔥",
          "Don't break your streak! You're so close to your goal! 💪",
          "One more task to save your streak! 🎯"
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // Send server-side push notification
        await this.sendPushNotification(
          userId,
          'Streak Check',
          randomMessage,
          {
            category: 'streak_check',
            type: 'streak_check',
            streak: userProgress.current_streak
          }
        );
      }
    } catch (error) {
      console.error('Error sending streak check notification:', error);
    }
  }

  // Check if user needs streak alert
  static async checkAndSendStreakAlert(userId) {
    try {
      // Get user's current streak and today's progress
      const { data: userProgress } = await supabase
        .from('user_progress')
        .select('current_streak, current_day')
        .eq('user_id', userId)
        .single();

      const { data: todayTasks, error: tasksError } = await supabase
        .from('daily_tasks')
        .select('completion_percentage, is_completed')
        .eq('user_id', userId)
        .eq('date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (tasksError) {
        console.warn('Error fetching daily tasks for notifications:', tasksError);
      }

      if (userProgress && todayTasks && !todayTasks.is_completed) {
        const streak = userProgress.current_streak;
        const completion = todayTasks.completion_percentage || 0;

        if (streak > 0 && completion < 100) {
          // Dynamic messages based on streak length
          let messages;
          if (streak >= 30) {
            messages = [
              `Your incredible ${streak} day streak is at risk! Don't let it slip away! 🏆`,
              `You've built something amazing with ${streak} days - complete your tasks! 🌟`,
              `Your ${streak} day streak is legendary - keep it alive! 🎯`
            ];
          } else if (streak >= 14) {
            messages = [
              `Your ${streak} day streak is impressive! Complete your tasks to keep it going! 🔥`,
              `Don't break your ${streak} day streak - you're doing amazing! 💪`,
              `Your consistency over ${streak} days is inspiring - finish strong! 🌟`
            ];
          } else if (streak >= 7) {
            messages = [
              `Your ${streak} day streak is building momentum! Complete your tasks! 🚀`,
              `Don't let your ${streak} day streak end now - you're on a roll! 💪`,
              `Your ${streak} day streak shows great progress - keep it up! 🎯`
            ];
          } else {
            messages = [
              `Your ${streak} day streak is in danger! Complete your remaining tasks now! 🚨`,
              `Don't break your streak! You're so close to your goal! 💪`,
              `One more task to save your ${streak} day streak! 🎯`,
              `Your streak is waiting for you! Complete your tasks before midnight! 🔥`
            ];
          }

          const randomMessage = messages[Math.floor(Math.random() * messages.length)];

          // Send server-side push notification instead of local
          await this.sendPushNotification(
            userId,
            'Streak Alert!',
            randomMessage,
            {
              category: 'streak_alert',
              type: 'streak_alert',
              streak: streak,
              completion: completion
            }
          );
        }
      }
    } catch (error) {
      console.error('Error checking streak alert:', error);
    }
  }

  // Send local notification immediately
  static async sendLocalNotification(title, message, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: message,
          data: data,
          sound: 'default',
          // Add custom sound for notifications
          icon: './assets/icon.png',
        },
        trigger: null, // Send immediately
      });

      // Log notification in database
      await this.logNotification(data.userId, title, message, data);
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  // Schedule local notification for later
  static async scheduleLocalNotification(title, message, trigger, data = {}) {
    try {
      // Determine Android channel based on notification type
      const channelId = data.type === 'task_reminder' ? 'task-reminders' : 
                       data.category === 'streak_alert' || data.category === 'streak_celebration' ? 'streak-alerts' :
                       'growth-reminders';

      // Build notification content - build separately for iOS and Android to avoid subtitle issues
      // CRITICAL: On iOS, subtitle must either be a valid string OR completely absent (never nil/undefined)
      // Using explicit property assignment to ensure subtitle is never nil
      let notificationContent;
      
      if (Platform.OS === 'ios') {
        // iOS: Extract subtitle from data if it exists, then create clean data object without it
        const subtitle = data?.subtitle;
        const hasValidSubtitle = subtitle && typeof subtitle === 'string' && subtitle.trim().length > 0;
        
        // Create clean data object without subtitle property (subtitle should be at content level, not in data)
        const cleanData = { ...data };
        if ('subtitle' in cleanData) {
          delete cleanData.subtitle;
        }
        
        // Build object property by property to ensure subtitle is never included if invalid
        notificationContent = {};
        notificationContent.title = title;
        notificationContent.body = message;
        notificationContent.data = cleanData; // Use cleaned data object
        notificationContent.sound = true;
        notificationContent.badge = 1;
        
        // ONLY add subtitle property if it's valid - never add it otherwise
        if (hasValidSubtitle) {
          notificationContent.subtitle = subtitle;
        }
        // subtitle property is intentionally NOT added if hasValidSubtitle is false
      } else {
        // Android: Include channel and priority
        notificationContent = {
          title: title,
          body: message,
          data: data,
          sound: true,
          badge: 1,
          channelId: channelId,
          priority: 'high',
        };
      }

      try {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          trigger: trigger,
        });

        console.log(`✅ Scheduled notification: "${title}" - "${message}"`);
        console.log(`   Notification ID: ${notificationId}`);
        console.log(`   Platform: ${Platform.OS}`);
        console.log(`   Channel: ${channelId}`);
        if (trigger?.date) {
          console.log(`   Scheduled for: ${new Date(trigger.date).toLocaleString()}`);
        } else {
          console.log(`   Trigger: ${JSON.stringify(trigger)}`);
        }

        // Log notification in database
        await this.logNotification(data.userId, title, message, data);
        
        return notificationId;
      } catch (scheduleError) {
        // Silently handle subtitle casting errors on iOS - these are non-critical
        if (Platform.OS === 'ios' && scheduleError?.message?.includes('subtitle')) {
          console.warn('⚠️ iOS subtitle error (suppressed):', scheduleError.message);
          // Try scheduling without subtitle as fallback
          try {
            const { subtitle, ...contentWithoutSubtitle } = notificationContent;
            const notificationId = await Notifications.scheduleNotificationAsync({
              content: contentWithoutSubtitle,
              trigger: trigger,
            });
            console.log(`✅ Scheduled notification (without subtitle fallback): "${title}"`);
            await this.logNotification(data.userId, title, message, data);
            return notificationId;
          } catch (fallbackError) {
            console.warn('⚠️ Failed to schedule notification even without subtitle:', fallbackError.message);
            // Return null to indicate failure, but don't throw to avoid showing error to user
            return null;
          }
        }
        // For other errors, throw normally
        throw scheduleError;
      }
    } catch (error) {
      // Silently handle subtitle errors - don't show them to user
      if (Platform.OS === 'ios' && error?.message?.includes('subtitle')) {
        console.warn('⚠️ iOS subtitle error (handled silently):', error.message);
        return null; // Return null instead of throwing to prevent error display
      }
      // For other errors, log but don't throw to prevent error display on phone
      console.error('❌ Error scheduling local notification:', error);
      console.error('   Title:', title);
      console.error('   Message:', message);
      console.error('   Trigger:', trigger);
      console.error('   Data:', data);
      // Return null instead of throwing to prevent error from showing on phone
      return null;
    }
  }

  // Send immediate notification
  static async sendImmediateNotification(title, message, userId, category = 'general') {
    try {
      // For test notifications, send with null trigger for immediate delivery
      if (category === 'test') {
        console.log('🔔 Sending test notification immediately...');
        console.log('  Title:', title);
        console.log('  Message:', message);
        console.log('  UserId:', userId);
        
        // Check permissions
        const { status } = await Notifications.getPermissionsAsync();
        console.log('  Permission status:', status);
        
        if (status !== 'granted') {
          throw new Error('Notification permissions not granted');
        }
        
        // Use null trigger to show immediately
        await Notifications.scheduleNotificationAsync({
          content: {
            title: title,
            body: message,
            data: {
              category: category,
              userId: userId,
              immediate: true
            },
            sound: 'default',
            badge: 1,
          },
          trigger: null, // null = immediate delivery
        });
        console.log('✅ Test notification sent immediately!');
        
        // Log to database
        await this.logNotification(userId, title, message, { category, immediate: true });
      } else {
        // Regular immediate notifications
        await this.sendLocalNotification(title, message, {
          category: category,
          userId: userId,
          immediate: true
        });
      }
    } catch (error) {
      console.error('❌ Error sending immediate notification:', error);
      throw error;
    }
  }

  // Send streak celebration notification (server-side push)
  static async sendStreakCelebration(streakDays, userId) {
    const messages = {
      3: "3 days strong! You're building great habits! 🌟",
      7: "One week streak! You're on fire! 🔥",
      14: "Two weeks! Your consistency is amazing! 🎉",
      30: "One month streak! You're a growth champion! 🏆",
      60: "Two months! You're halfway to your goal! 🎯",
      90: "Three months! You're unstoppable! 🚀",
      120: "Complete journey! You've achieved something incredible! 🎊"
    };

    const message = messages[streakDays] || `Amazing ${streakDays} day streak! Keep going! 🎉`;

    // Send server-side push notification
    await this.sendPushNotification(
      userId,
      'Streak Celebration!',
      message,
      {
        category: 'streak_celebration',
        type: 'streak_celebration',
        streakDays: streakDays
      }
    );
  }

  // Check and send streak celebration if milestone reached
  static async checkStreakMilestones(userId) {
    try {
      // Get current streak from database
      const { data: userProgress } = await supabase
        .from('user_progress')
        .select('current_streak, longest_streak')
        .eq('user_id', userId)
        .maybeSingle();

      if (userProgress && userProgress.current_streak > 0) {
        const currentStreak = userProgress.current_streak;
        const longestStreak = userProgress.longest_streak;

        // Check if this is a new milestone
        const milestones = [3, 7, 14, 30, 60, 90, 120];
        const isNewMilestone = milestones.includes(currentStreak) && currentStreak > longestStreak;

        if (isNewMilestone) {
          await this.sendStreakCelebration(currentStreak, userId);
          console.log(`Streak milestone celebration sent for ${currentStreak} days`);
        }
      }
    } catch (error) {
      console.error('Error checking streak milestones:', error);
    }
  }

  // Get current streak data for notifications
  static async getCurrentStreakData(userId) {
    try {
      const { data: userProgress } = await supabase
        .from('user_progress')
        .select('current_streak, current_day, longest_streak, total_streak')
        .eq('user_id', userId)
        .maybeSingle();

      if (userProgress) {
        return {
          currentStreak: userProgress.current_streak || 0,
          currentDay: userProgress.current_day || 0,
          longestStreak: userProgress.longest_streak || 0,
          totalStreak: userProgress.total_streak || 0
        };
      }

      return {
        currentStreak: 0,
        currentDay: 0,
        longestStreak: 0,
        totalStreak: 0
      };
    } catch (error) {
      console.error('Error getting streak data:', error);
      return {
        currentStreak: 0,
        currentDay: 0,
        longestStreak: 0,
        totalStreak: 0
      };
    }
  }


  // Handle notification tap
  static handleNotificationTap(notification) {
    const { data } = notification;

    if (data) {
      // Navigate to appropriate screen based on notification type
      switch (data.category) {
        case 'streak_alert':
          // Navigate to daily tasks screen
          break;
        case 'streak_celebration':
          // Navigate to progress screen
          break;
        default:
          // Navigate to home screen
          break;
      }
    }
  }

  // Log notification in database
  static async logNotification(userId, title, message, data) {
    try {
      await supabase
        .from('notification_history')
        .insert({
          user_id: userId,
          type: data.category || 'general',
          title: title,
          body: message,
          metadata: data
        });
    } catch (error) {
      console.error('Error logging notification:', error);
    }
  }

  // Send server-side push notification (triggers Edge Function via webhook)
  static async sendPushNotification(userId, title, body, data = {}) {
    try {
      // Insert into notifications table - this will trigger the webhook
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: title,
          body: body,
          data: data
        })
        .select()
        .single();

      if (error) {
        // Check if it's an RLS policy error
        if (error.code === '42501' || error.message?.includes('row level security') || error.message?.includes('RLS')) {
          console.warn('⚠️ Push notification blocked by RLS policy. This is expected if user cannot create notifications for others.');
          // Return a success response to prevent breaking the calling function
          return { id: null, success: false, rlsBlocked: true };
        }
        console.error('Error sending push notification:', error);
        throw error;
      }

      console.log('✅ Push notification queued:', notification.id);
      return notification;
    } catch (error) {
      // If it's an RLS error, don't throw - just log and return
      if (error.code === '42501' || error.message?.includes('row level security') || error.message?.includes('RLS')) {
        console.warn('⚠️ Push notification blocked by RLS policy:', error.message);
        return { id: null, success: false, rlsBlocked: true };
      }
      console.error('❌ Error sending push notification:', error);
      throw error;
    }
  }

  // Get notification title based on category
  static getNotificationTitle(category) {
    const titles = {
      sleep: 'Sleep & Recovery',
      nutrition: 'Nutrition',
      exercise: 'Exercise & Posture',
      tracking: 'Tracking & Progress',
      motivation: 'Motivation & Mindset'
    };

    return titles[category] || 'Growth Reminder';
  }

  // Cancel all notifications
  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get user notification preferences
  static async getUserNotificationPreferences(userId) {
    try {
      const { data } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      return data || {
        morning_reminders: true,
        afternoon_reminders: true,
        evening_reminders: true,
        streak_notifications: true,
        morning_time: '08:00',
        afternoon_time: '14:00',
        evening_time: '20:00',
        timezone: 'UTC'
      };
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return null;
    }
  }

  // Update user notification preferences
  static async updateUserNotificationPreferences(userId, preferences) {
    try {
      await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences
        });

      // Clear existing notifications and reschedule with new preferences
      await this.cancelAllNotifications();

      // Mark as not scheduled so they can be rescheduled
      await supabase
        .from('notification_schedules')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('notification_type', 'daily_plan');

      // Reschedule notifications with new preferences
      await this.scheduleDailyNotifications(userId, preferences);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  }

  // Schedule reminders for incomplete daily tasks
  static async scheduleTaskReminders(userId, dayNumber, tasks, completedTasks) {
    try {
      // Check if reminders already scheduled for this day
      const reminderKey = `${userId}-${dayNumber}`;
      if (this.taskRemindersScheduled.has(reminderKey)) {
        const lastScheduled = this.taskRemindersScheduled.get(reminderKey);
        const now = Date.now();
        // Only reschedule if it's been more than 5 minutes since last schedule
        if (now - lastScheduled < 5 * 60 * 1000) {
          console.log(`⏭️ Task reminders already scheduled for day ${dayNumber} (within last 5 min), skipping...`);
          return;
        }
      }

      // Ensure notification service is initialized
      if (!this.initialized) {
        console.log('⚠️ Notification service not initialized, initializing now...');
        await this.initialize();
      }

      // Check permissions (but don't request - should be done on HomeScreen)
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        console.warn('⚠️ Notification permissions not granted, cannot schedule task reminders');
        return;
      }

      if (!tasks || !Array.isArray(tasks)) {
        console.log('No tasks to schedule reminders for');
        return;
      }

      // Get user notification preferences (use defaults if not found)
      const preferences = await this.getUserNotificationPreferences(userId) || {
        morning_time: '09:00',
        afternoon_time: '14:00',
        evening_time: '19:00'
      };

      // Find incomplete tasks
      const incompleteTasks = tasks.filter(task => {
        // Skip supplements and gender-specific tasks (they're dynamic)
        if (task.isSupplement || task.isNoFap || task.isGenderSpecific) {
          return false;
        }
        return !completedTasks.includes(task.id);
      });

      if (incompleteTasks.length === 0) {
        console.log('All tasks completed, no reminders needed');
        return;
      }

      // Cancel existing task reminders for this day
      const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const taskReminderIds = existingNotifications
        .filter(n => n.content.data?.type === 'task_reminder' && 
                     n.content.data?.userId === userId && 
                     n.content.data?.dayNumber === dayNumber)
        .map(n => n.identifier);

      if (taskReminderIds.length > 0) {
        await Notifications.cancelScheduledNotificationsAsync(taskReminderIds);
      }

      // Schedule reminders for incomplete tasks
      const now = new Date();
      const reminderTimes = [
        { time: preferences.morning_time || '09:00', label: 'morning' },
        { time: preferences.afternoon_time || '14:00', label: 'afternoon' },
        { time: preferences.evening_time || '19:00', label: 'evening' }
      ];

      // Distribute incomplete tasks across reminder times
      const tasksPerTime = Math.ceil(incompleteTasks.length / reminderTimes.length);

      for (let i = 0; i < reminderTimes.length; i++) {
        const startIdx = i * tasksPerTime;
        const endIdx = Math.min(startIdx + tasksPerTime, incompleteTasks.length);
        const tasksForThisTime = incompleteTasks.slice(startIdx, endIdx);

        if (tasksForThisTime.length === 0) continue;

        // Parse time
        const [hours, minutes] = reminderTimes[i].time.split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);

        // If time has passed today, schedule for tomorrow
        if (scheduledTime <= now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        // Create reminder message
        let reminderMessage;
        if (tasksForThisTime.length === 1) {
          reminderMessage = `Don't forget: ${tasksForThisTime[0].title}`;
        } else {
          const taskNames = tasksForThisTime.slice(0, 2).map(t => t.title).join(', ');
          const remaining = tasksForThisTime.length - 2;
          reminderMessage = `${taskNames}${remaining > 0 ? ` and ${remaining} more` : ''} - Complete them to reach your growth goals!`;
        }

        // Schedule notification
        const trigger = {
          date: scheduledTime,
          repeats: false, // One-time reminder for today
        };

        await this.scheduleLocalNotification(
          'Daily Task Reminder',
          reminderMessage,
          trigger,
          {
            category: 'task_reminder',
            type: 'task_reminder',
            userId: userId,
            dayNumber: dayNumber,
            taskIds: tasksForThisTime.map(t => t.id),
            time: reminderTimes[i].label
          }
        );
      }

      // Mark as scheduled
      this.taskRemindersScheduled.set(reminderKey, Date.now());

      console.log(`✅ Scheduled ${incompleteTasks.length} task reminders for day ${dayNumber}`);
      console.log(`   Reminder times: ${reminderTimes.map(rt => rt.time).join(', ')}`);
      
      // Debug: List all scheduled notifications
      try {
        const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
        const taskReminders = allScheduled.filter(n => 
          n.content.data?.type === 'task_reminder' && 
          n.content.data?.userId === userId
        );
        console.log(`   Total task reminders scheduled: ${taskReminders.length}`);
      } catch (debugError) {
        console.warn('Could not list scheduled notifications:', debugError);
      }
    } catch (error) {
      // Silently handle subtitle errors - don't show them to user
      if (Platform.OS === 'ios' && error?.message?.includes('subtitle')) {
        console.warn('⚠️ Task reminder subtitle error (suppressed):', error.message);
        return; // Return silently to prevent error display
      }
      // For other errors, log but don't show stack trace to reduce noise
      console.warn('⚠️ Error scheduling task reminders:', error.message);
    }
  }

  // Cancel task reminders when tasks are completed
  static async cancelTaskReminders(userId, dayNumber) {
    try {
      const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const taskReminderIds = existingNotifications
        .filter(n => n.content.data?.type === 'task_reminder' && 
                     n.content.data?.userId === userId && 
                     n.content.data?.dayNumber === dayNumber)
        .map(n => n.identifier);

      if (taskReminderIds.length > 0) {
        await Notifications.cancelScheduledNotificationsAsync(taskReminderIds);
        console.log(`Cancelled ${taskReminderIds.length} task reminders for day ${dayNumber}`);
      }

      // Remove from tracking map
      const reminderKey = `${userId}-${dayNumber}`;
      this.taskRemindersScheduled.delete(reminderKey);
    } catch (error) {
      console.error('Error cancelling task reminders:', error);
    }
  }

  // Test notification function - schedules a notification 5 seconds from now
  static async sendTestNotification(userId, delaySeconds = 5) {
    try {
      // Ensure notification service is initialized
      if (!this.initialized) {
        console.log('⚠️ Notification service not initialized, initializing now...');
        await this.initialize();
      }

      // Check permissions (don't request here - should be done on HomeScreen)
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Notification permissions not granted. Please enable notifications in app settings.');
      }

      // Cancel any existing test notifications first to prevent duplicates
      // Only cancel test notifications, NOT task reminders
      const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const testNotificationIds = existingNotifications
        .filter(n => {
          const data = n.content.data || {};
          // Only cancel actual test notifications, not task reminders
          return (data.test === true || data.type === 'test') && 
                 data.type !== 'task_reminder' &&
                 !data.category?.includes('task');
        })
        .map(n => n.identifier);
      
      if (testNotificationIds.length > 0) {
        await Notifications.cancelScheduledNotificationsAsync(testNotificationIds);
        console.log(`🧹 Cancelled ${testNotificationIds.length} existing test notifications`);
      }

      const now = new Date();
      const triggerTime = new Date(now.getTime() + delaySeconds * 1000);

      console.log(`🧪 Scheduling test notification for ${delaySeconds} seconds from now...`);
      console.log(`   Current time: ${now.toLocaleTimeString()}`);
      console.log(`   Trigger time: ${triggerTime.toLocaleTimeString()}`);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧪 Test Notification',
          body: `This is a test notification! If you see this, notifications are working! 🎉`,
          data: {
            category: 'test',
            type: 'test',
            userId: userId,
            test: true
          },
          sound: true,
          badge: 1,
          ...(Platform.OS === 'android' && { channelId: 'growth-reminders' }),
        },
        trigger: {
          date: triggerTime,
          repeats: false,
        },
      });

      console.log(`✅ Test notification scheduled!`);
      console.log(`   Notification ID: ${notificationId}`);
      console.log(`   Will appear in ${delaySeconds} seconds`);

      return notificationId;
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      throw error;
    }
  }

  // Get all scheduled notifications (for debugging)
  static async getAllScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log(`📋 Total scheduled notifications: ${notifications.length}`);
      notifications.forEach((n, index) => {
        console.log(`   ${index + 1}. ID: ${n.identifier}`);
        console.log(`      Title: ${n.content.title}`);
        console.log(`      Body: ${n.content.body}`);
        console.log(`      Trigger: ${JSON.stringify(n.trigger)}`);
        console.log(`      Data: ${JSON.stringify(n.content.data)}`);
      });
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
}

export default NotificationService;
