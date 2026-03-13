import { supabase } from '../config/supabase';
import { NUTRITION_ITEMS } from '../utils/nutritionData';

export class SupplementsService {
  // Get user's selected supplements
  // These supplements persist across ALL days - they're added dynamically to every day's tasks
  // in DailyPlanService.getDailyTasks(), ensuring they appear every day once added
  static async getUserSupplements(userId) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('selected_supplements')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      // Return array of supplement IDs, or empty array if none selected
      return data?.selected_supplements || [];
    } catch (error) {
      console.error('Error getting user supplements:', error);
      return [];
    }
  }

  // Add supplement to user's plan
  static async addSupplement(userId, supplementId) {
    try {
      // Get current supplements
      const currentSupplements = await this.getUserSupplements(userId);

      // Check if already added
      if (currentSupplements.includes(supplementId)) {
        return { success: true, message: 'Supplement already in plan' };
      }

      // Add to array
      const updatedSupplements = [...currentSupplements, supplementId];

      // Upsert user preferences
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          selected_supplements: updatedSupplements,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      return { success: true, supplements: updatedSupplements };
    } catch (error) {
      console.error('Error adding supplement:', error);
      return { success: false, error: error.message };
    }
  }

  // Remove supplement from user's plan
  static async removeSupplement(userId, supplementId) {
    try {
      // Get current supplements
      const currentSupplements = await this.getUserSupplements(userId);

      // Remove from array
      const updatedSupplements = currentSupplements.filter(id => id !== supplementId);

      // Update user preferences
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          selected_supplements: updatedSupplements,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      return { success: true, supplements: updatedSupplements };
    } catch (error) {
      console.error('Error removing supplement:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if supplement is in user's plan
  static async isSupplementInPlan(userId, supplementId) {
    try {
      const supplements = await this.getUserSupplements(userId);
      return supplements.includes(supplementId);
    } catch (error) {
      console.error('Error checking supplement status:', error);
      return false;
    }
  }

  // Get supplement details by ID
  static getSupplementDetails(supplementId) {
    return NUTRITION_ITEMS.find(item => item.id === supplementId && item.categoryId === 'supplements');
  }

  // Convert supplement IDs to daily task objects
  static supplementsToTasks(supplementIds) {
    return supplementIds.map((supplementId, index) => {
      const supplement = this.getSupplementDetails(supplementId);
      if (!supplement) return null;

      return {
        id: `supplement-${supplementId}`, // Unique ID for supplements
        title: `Take ${supplement.name}`,
        emoji: '💊',
        category: 'nutrition',
        description: `${supplement.dosage}${supplement.bestTime ? ` • ${supplement.bestTime}` : ''}`,
        estimated_time: '1 minute',
        isSupplement: true, // Flag to identify supplement tasks
        supplementId: supplementId // Store original ID for reference
      };
    }).filter(task => task !== null); // Remove any null entries
  }
}

