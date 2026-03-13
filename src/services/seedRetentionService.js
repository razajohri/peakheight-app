import { supabase } from '../config/supabase';

/**
 * Seed Retention Service
 * Handles seed retention streak tracking - important for growth hormone and testosterone
 */
export class SeedRetentionService {
  /**
   * Update seed retention streak when user completes the daily No Fap task
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, currentStreak: number, longestStreak: number, error?: string}>}
   */
  static async updateSeedRetentionStreak(userId) {
    try {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('seed_retention_streak, seed_retention_longest_streak, seed_retention_last_activity_date')
        .eq('user_id', userId)
        .maybeSingle();

      const today = new Date().toISOString().split('T')[0];

      if (!progress) {
        // Create progress row if it doesn't exist
        const { error: upsertError } = await supabase
          .from('user_progress')
          .upsert({
            user_id: userId,
            seed_retention_streak: 1,
            seed_retention_longest_streak: 1,
            seed_retention_last_activity_date: today,
          }, { onConflict: 'user_id' });
        if (upsertError) throw upsertError;
        return { success: true, currentStreak: 1, longestStreak: 1 };
      }

      const lastActivity = progress.seed_retention_last_activity_date;
      let newStreak = progress.seed_retention_streak || 0;
      let longestStreak = progress.seed_retention_longest_streak || 0;

      // Calculate if user missed a day
      const lastActivityDate = lastActivity ? new Date(lastActivity) : null;
      const todayDate = new Date(today);
      const daysDiff = lastActivityDate 
        ? Math.floor((todayDate - lastActivityDate) / (1000 * 60 * 60 * 24))
        : 999; // If no last activity, treat as missed

      // Check if streak should break (missed a day)
      const missedDay = daysDiff > 1;

      if (missedDay && newStreak > 0) {
        // Streak is breaking - reset to 0
        newStreak = 0;
        console.log(`Seed retention streak broken: Reset to 0`);
      } else if (lastActivity !== today) {
        // Normal increment: completing today (not missed)
        newStreak += 1;
      }
      // If lastActivity === today, keep streak same (already completed today)

      // Update longest streak if needed
      longestStreak = Math.max(longestStreak, newStreak);

      const { error } = await supabase
        .from('user_progress')
        .update({
          seed_retention_streak: newStreak,
          seed_retention_longest_streak: longestStreak,
          seed_retention_last_activity_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      console.log(`Seed retention streak updated: ${newStreak} (was ${progress.seed_retention_streak || 0})`);
      return { success: true, currentStreak: newStreak, longestStreak: longestStreak };

    } catch (error) {
      console.error('Error updating seed retention streak:', error);
      return {
        success: false,
        currentStreak: 0,
        longestStreak: 0,
        error: error.message
      };
    }
  }

  /**
   * Get seed retention streak status
   * @param {string} userId - User ID
   * @returns {Promise<{currentStreak: number, longestStreak: number, lastActivityDate: string|null}>}
   */
  static async getSeedRetentionStatus(userId) {
    try {
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('seed_retention_streak, seed_retention_longest_streak, seed_retention_last_activity_date')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!progress) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null
        };
      }

      // Check if streak should break (user missed a day)
      if (progress.seed_retention_streak > 0 && progress.seed_retention_last_activity_date) {
        const today = new Date().toISOString().split('T')[0];
        const lastActivity = new Date(progress.seed_retention_last_activity_date);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate - lastActivity) / (1000 * 60 * 60 * 24));
        
        // If last activity was more than 1 day ago, streak should break
        if (daysDiff > 1) {
          // Update streak to broken state
          const { error: updateError } = await supabase
            .from('user_progress')
            .update({
              seed_retention_streak: 0,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);
          
          if (updateError) {
            console.error('Error updating broken seed retention streak:', updateError);
          } else {
            console.log(`Seed retention streak broken on load: Reset to 0`);
            return {
              currentStreak: 0,
              longestStreak: progress.seed_retention_longest_streak || 0,
              lastActivityDate: progress.seed_retention_last_activity_date
            };
          }
        }
      }

      return {
        currentStreak: progress.seed_retention_streak || 0,
        longestStreak: progress.seed_retention_longest_streak || 0,
        lastActivityDate: progress.seed_retention_last_activity_date || null
      };
    } catch (error) {
      console.error('Error getting seed retention status:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null
      };
    }
  }

  /**
   * Reset seed retention streak (when user breaks it)
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async resetSeedRetentionStreak(userId) {
    try {
      const { error } = await supabase
        .from('user_progress')
        .update({
          seed_retention_streak: 0,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      console.log('Seed retention streak reset to 0');
      return { success: true };
    } catch (error) {
      console.error('Error resetting seed retention streak:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default SeedRetentionService;
