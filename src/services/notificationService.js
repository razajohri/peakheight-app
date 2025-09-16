import * as Notifications from 'expo-notifications';
import { supabase } from '../config/supabase';
import { SoundService } from './soundService';

class NotificationService {
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
    try {
      // Initialize sound service
      await SoundService.initialize();

      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
        return;
      }

      // Add notification listener to play custom sound
      Notifications.addNotificationReceivedListener(async (notification) => {
        // Play custom notification sound
        await SoundService.playNotificationSound();
      });

      // Get push token
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Push token:', token.data);

      // Store token in database
      await this.storeNotificationToken(token.data);

      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Error initializing notification service:', error);
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
      }
    } catch (error) {
      console.error('Error storing notification token:', error);
    }
  }

  // Schedule daily notifications based on user preferences
  static async scheduleDailyNotifications(userId, preferences) {
    try {
      // Clear existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      const {
        morning_reminders = true,
        afternoon_reminders = true,
        evening_reminders = true,
        morning_time = '08:00',
        afternoon_time = '14:00',
        evening_time = '20:00',
        timezone = 'UTC'
      } = preferences;

      // Schedule morning notifications
      if (morning_reminders) {
        await this.scheduleNotificationCategory('morning', morning_time, userId);
      }

      // Schedule afternoon notifications
      if (afternoon_reminders) {
        await this.scheduleNotificationCategory('afternoon', afternoon_time, userId);
      }

      // Schedule evening notifications
      if (evening_reminders) {
        await this.scheduleNotificationCategory('evening', evening_time, userId);
      }

      // Schedule streak check notification (10 PM)
      await this.scheduleStreakCheckNotification(userId);

    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  // Schedule notifications for a specific time category
  static async scheduleNotificationCategory(category, time, userId) {
    const categories = ['sleep', 'nutrition', 'exercise', 'tracking', 'motivation'];

    for (let index = 0; index < categories.length; index++) {
      const type = categories[index];
      const messages = this.MESSAGE_TEMPLATES[type][category] || [];

      if (messages.length > 0) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // Parse time (e.g., "08:00" -> 8 hours, 0 minutes)
        const [hours, minutes] = time.split(':').map(Number);

        // Create trigger for daily notification
        const trigger = {
          hour: hours,
          minute: minutes,
          repeats: true,
        };

        // Add delay for spreading notifications
        const delayMinutes = index * 5;
        trigger.minute = (trigger.minute + delayMinutes) % 60;
        if (trigger.minute < delayMinutes) {
          trigger.hour = (trigger.hour + 1) % 24;
        }

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
    }
  }

  // Schedule streak check notification
  static async scheduleStreakCheckNotification(userId) {
    // Schedule for 10 PM daily
    const trigger = {
      hour: 22,
      minute: 0,
      repeats: true,
    };

    const messages = [
      "Your streak is waiting for you! Complete your tasks before midnight! 🔥",
      "Don't break your streak! You're so close to your goal! 💪",
      "One more task to save your streak! 🎯"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    await this.scheduleLocalNotification(
      'Streak Check',
      randomMessage,
      trigger,
      {
        category: 'streak_check',
        userId: userId
      }
    );
  }

  // Check if user needs streak alert
  static async checkAndSendStreakAlert(userId) {
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
        .single();

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

          this.sendLocalNotification(
            'Streak Alert!',
            randomMessage,
            {
              category: 'streak_alert',
              userId: userId,
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
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: message,
          data: data,
          sound: 'default',
          // Add custom sound for notifications
          icon: './assets/icon.png',
        },
        trigger: trigger,
      });

      // Log notification in database
      await this.logNotification(data.userId, title, message, data);
    } catch (error) {
      console.error('Error scheduling local notification:', error);
    }
  }

  // Send immediate notification
  static async sendImmediateNotification(title, message, userId, category = 'general') {
    await this.sendLocalNotification(title, message, {
      category: category,
      userId: userId,
      immediate: true
    });
  }

  // Send streak celebration notification
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

    await this.sendImmediateNotification(
      'Streak Celebration!',
      message,
      userId,
      'streak_celebration'
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
        .single();

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

      // Reschedule notifications with new preferences
      await this.scheduleDailyNotifications(userId, preferences);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  }
}

export default NotificationService;
