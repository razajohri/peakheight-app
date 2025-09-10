import { supabase } from '../config/supabase';

// Real-time service for live updates and WebSocket connections
export class RealtimeService {
  // =============================================
  // REAL-TIME SUBSCRIPTIONS
  // =============================================

  // Subscribe to habit updates
  static subscribeToHabitUpdates(userId, callback) {
    const subscription = supabase
      .channel('habit-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'habit_logs',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        callback(payload);
      })
      .subscribe();

    return subscription;
  }

  // Subscribe to streak updates
  static subscribeToStreakUpdates(userId, callback) {
    const subscription = supabase
      .channel('streak-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'streaks',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        callback(payload);
      })
      .subscribe();

    return subscription;
  }

  // Subscribe to community post updates
  static subscribeToCommunityUpdates(callback) {
    const subscription = supabase
      .channel('community-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
        filter: 'is_public=eq.true',
      }, (payload) => {
        callback(payload);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'posts',
        filter: 'is_public=eq.true',
      }, (payload) => {
        callback(payload);
      })
      .subscribe();

    return subscription;
  }

  // Subscribe to post likes and comments
  static subscribeToPostInteractions(postId, callback) {
    const subscription = supabase
      .channel(`post-interactions-${postId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'post_likes',
        filter: `post_id=eq.${postId}`,
      }, (payload) => {
        callback({ type: 'like', ...payload });
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`,
      }, (payload) => {
        callback({ type: 'comment', ...payload });
      })
      .subscribe();

    return subscription;
  }

  // Subscribe to user badge updates
  static subscribeToBadgeUpdates(userId, callback) {
    const subscription = supabase
      .channel('badge-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_badges',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        callback(payload);
      })
      .subscribe();

    return subscription;
  }

  // Subscribe to AI insights updates
  static subscribeToAIInsights(userId, callback) {
    const subscription = supabase
      .channel('ai-insights')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ai_insights',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        callback(payload);
      })
      .subscribe();

    return subscription;
  }

  // Subscribe to exercise completion updates
  static subscribeToExerciseUpdates(userId, callback) {
    const subscription = supabase
      .channel('exercise-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'exercise_completions',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        callback(payload);
      })
      .subscribe();

    return subscription;
  }

  // Subscribe to food scan updates
  static subscribeToFoodScanUpdates(userId, callback) {
    const subscription = supabase
      .channel('food-scan-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'food_scans',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        callback(payload);
      })
      .subscribe();

    return subscription;
  }

  // Subscribe to challenge updates
  static subscribeToChallengeUpdates(userId, callback) {
    const subscription = supabase
      .channel('challenge-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_challenges',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        callback(payload);
      })
      .subscribe();

    return subscription;
  }

  // =============================================
  // PRESENCE SYSTEM
  // =============================================

  // Track user presence
  static trackUserPresence(userId, status = 'online') {
    const channel = supabase.channel('user-presence', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        console.log('Presence state:', presenceState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            status: status,
            last_seen: new Date().toISOString(),
          });
        }
      });

    return channel;
  }

  // =============================================
  // BROADCAST SYSTEM
  // =============================================

  // Broadcast achievement to user
  static async broadcastAchievement(userId, achievement) {
    try {
      const channel = supabase.channel(`achievement-${userId}`);
      
      await channel.send({
        type: 'broadcast',
        event: 'achievement',
        payload: {
          achievement,
          timestamp: new Date().toISOString(),
        },
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Broadcast achievement error:', error);
      return { success: false, error: error.message };
    }
  }

  // Broadcast streak milestone
  static async broadcastStreakMilestone(userId, streakData) {
    try {
      const channel = supabase.channel(`streak-${userId}`);
      
      await channel.send({
        type: 'broadcast',
        event: 'streak_milestone',
        payload: {
          streakData,
          timestamp: new Date().toISOString(),
        },
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Broadcast streak milestone error:', error);
      return { success: false, error: error.message };
    }
  }

  // Broadcast community notification
  static async broadcastCommunityNotification(userId, notification) {
    try {
      const channel = supabase.channel(`community-${userId}`);
      
      await channel.send({
        type: 'broadcast',
        event: 'community_notification',
        payload: {
          notification,
          timestamp: new Date().toISOString(),
        },
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Broadcast community notification error:', error);
      return { success: false, error: error.message };
    }
  }

  // =============================================
  // SUBSCRIPTION MANAGEMENT
  // =============================================

  // Create comprehensive user subscription
  static createUserSubscription(userId, callbacks = {}) {
    const subscriptions = [];

    // Habit updates
    if (callbacks.onHabitUpdate) {
      subscriptions.push(this.subscribeToHabitUpdates(userId, callbacks.onHabitUpdate));
    }

    // Streak updates
    if (callbacks.onStreakUpdate) {
      subscriptions.push(this.subscribeToStreakUpdates(userId, callbacks.onStreakUpdate));
    }

    // Community updates
    if (callbacks.onCommunityUpdate) {
      subscriptions.push(this.subscribeToCommunityUpdates(callbacks.onCommunityUpdate));
    }

    // Badge updates
    if (callbacks.onBadgeUpdate) {
      subscriptions.push(this.subscribeToBadgeUpdates(userId, callbacks.onBadgeUpdate));
    }

    // AI insights
    if (callbacks.onAIInsight) {
      subscriptions.push(this.subscribeToAIInsights(userId, callbacks.onAIInsight));
    }

    // Exercise updates
    if (callbacks.onExerciseUpdate) {
      subscriptions.push(this.subscribeToExerciseUpdates(userId, callbacks.onExerciseUpdate));
    }

    // Food scan updates
    if (callbacks.onFoodScanUpdate) {
      subscriptions.push(this.subscribeToFoodScanUpdates(userId, callbacks.onFoodScanUpdate));
    }

    // Challenge updates
    if (callbacks.onChallengeUpdate) {
      subscriptions.push(this.subscribeToChallengeUpdates(userId, callbacks.onChallengeUpdate));
    }

    // User presence
    if (callbacks.onPresenceUpdate) {
      subscriptions.push(this.trackUserPresence(userId));
    }

    return subscriptions;
  }

  // Unsubscribe from all subscriptions
  static unsubscribeAll(subscriptions) {
    subscriptions.forEach(subscription => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    });
  }

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================

  // Check connection status
  static getConnectionStatus() {
    return supabase.getChannels().map(channel => ({
      channel: channel.topic,
      status: channel.state,
    }));
  }

  // Reconnect all channels
  static async reconnectAll() {
    try {
      const channels = supabase.getChannels();
      for (const channel of channels) {
        if (channel.state === 'CLOSED') {
          await channel.subscribe();
        }
      }
      return { success: true, error: null };
    } catch (error) {
      console.error('Reconnect all error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get channel statistics
  static getChannelStats() {
    const channels = supabase.getChannels();
    return {
      totalChannels: channels.length,
      activeChannels: channels.filter(c => c.state === 'SUBSCRIBED').length,
      closedChannels: channels.filter(c => c.state === 'CLOSED').length,
      channels: channels.map(c => ({
        topic: c.topic,
        state: c.state,
        joinRef: c.joinRef,
      })),
    };
  }

  // =============================================
  // ERROR HANDLING
  // =============================================

  // Handle subscription errors
  static handleSubscriptionError(error, channelName) {
    console.error(`Subscription error for ${channelName}:`, error);
    
    // Implement retry logic
    if (error.message.includes('timeout')) {
      setTimeout(() => {
        console.log(`Retrying subscription for ${channelName}`);
        // Retry logic would go here
      }, 5000);
    }
  }

  // Setup global error handling
  static setupGlobalErrorHandling() {
    supabase.realtime.onError((error) => {
      console.error('Realtime error:', error);
      // Handle global realtime errors
    });
  }
}

// Export individual functions for backward compatibility
export const subscribeToHabitUpdates = RealtimeService.subscribeToHabitUpdates;
export const subscribeToStreakUpdates = RealtimeService.subscribeToStreakUpdates;
export const subscribeToCommunityUpdates = RealtimeService.subscribeToCommunityUpdates;
export const subscribeToPostInteractions = RealtimeService.subscribeToPostInteractions;
export const subscribeToBadgeUpdates = RealtimeService.subscribeToBadgeUpdates;
export const subscribeToAIInsights = RealtimeService.subscribeToAIInsights;
export const subscribeToExerciseUpdates = RealtimeService.subscribeToExerciseUpdates;
export const subscribeToFoodScanUpdates = RealtimeService.subscribeToFoodScanUpdates;
export const subscribeToChallengeUpdates = RealtimeService.subscribeToChallengeUpdates;
export const trackUserPresence = RealtimeService.trackUserPresence;
export const broadcastAchievement = RealtimeService.broadcastAchievement;
export const broadcastStreakMilestone = RealtimeService.broadcastStreakMilestone;
export const broadcastCommunityNotification = RealtimeService.broadcastCommunityNotification;
export const createUserSubscription = RealtimeService.createUserSubscription;
export const unsubscribeAll = RealtimeService.unsubscribeAll;
export const getConnectionStatus = RealtimeService.getConnectionStatus;
export const reconnectAll = RealtimeService.reconnectAll;
export const getChannelStats = RealtimeService.getChannelStats;

export default RealtimeService;
