import { supabase } from '../config/supabase';

/**
 * Streak Freeze Service
 * Handles streak freeze functionality - allows users to restore broken streaks
 */
export class StreakFreezeService {
  /**
   * Check if user can use streak freeze
   * @param {string} userId - User ID
   * @returns {Promise<{canUse: boolean, previousStreak: number, reason?: string}>}
   */
  static async canUseStreakFreeze(userId) {
    try {
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('current_streak, streak_freeze_available, previous_streak')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!progress) {
        return { canUse: false, previousStreak: 0, reason: 'No progress found' };
      }

      // Can use freeze if:
      // 1. Current streak is 0 (broken)
      // 2. Freeze is available
      // 3. Previous streak > 0 (something to restore)
      const canUse = 
        progress.current_streak === 0 &&
        progress.streak_freeze_available === true &&
        progress.previous_streak > 0;

      return {
        canUse,
        previousStreak: progress.previous_streak || 0,
        reason: canUse ? 'Available' : 
                progress.current_streak > 0 ? 'Streak not broken' :
                !progress.streak_freeze_available ? 'Freeze already used' :
                progress.previous_streak === 0 ? 'Nothing to restore' : 'Unknown'
      };
    } catch (error) {
      console.error('Error checking streak freeze availability:', error);
      return { canUse: false, previousStreak: 0, reason: error.message };
    }
  }

  /**
   * Use streak freeze to restore broken streak
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, restoredStreak: number, error?: string}>}
   */
  static async useStreakFreeze(userId) {
    try {
      // First check if freeze can be used
      const { canUse, previousStreak } = await this.canUseStreakFreeze(userId);
      
      if (!canUse) {
        return {
          success: false,
          restoredStreak: 0,
          error: 'Streak freeze cannot be used at this time'
        };
      }

      const today = new Date().toISOString().split('T')[0];

      // Restore streak from previous_streak
      const { data, error } = await supabase
        .from('user_progress')
        .update({
          current_streak: previousStreak,
          streak_freeze_available: false,
          streak_freeze_used_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      console.log(`Streak freeze used: Restored streak from 0 to ${previousStreak} days`);

      return {
        success: true,
        restoredStreak: previousStreak
      };
    } catch (error) {
      console.error('Error using streak freeze:', error);
      return {
        success: false,
        restoredStreak: 0,
        error: error.message
      };
    }
  }

  /**
   * Get freeze status for user
   * @param {string} userId - User ID
   * @returns {Promise<{available: boolean, previousStreak: number, usedDate: string|null, currentStreak: number}>}
   */
  static async getFreezeStatus(userId) {
    try {
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('current_streak, streak_freeze_available, previous_streak, streak_freeze_used_date')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!progress) {
        return {
          available: false,
          previousStreak: 0,
          usedDate: null,
          currentStreak: 0
        };
      }

      return {
        available: progress.streak_freeze_available || false,
        previousStreak: progress.previous_streak || 0,
        usedDate: progress.streak_freeze_used_date || null,
        currentStreak: progress.current_streak || 0
      };
    } catch (error) {
      console.error('Error getting freeze status:', error);
      return {
        available: false,
        previousStreak: 0,
        usedDate: null,
        currentStreak: 0
      };
    }
  }
}

export default StreakFreezeService;
