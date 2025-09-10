import { supabase } from '../config/supabase';
import { RATE_LIMITS, FEATURE_FLAGS } from '../config/supabase';

// Database service with comprehensive CRUD operations and security
export class DatabaseService {
  // =============================================
  // HABIT TRACKING
  // =============================================

  // Log a habit
  static async logHabit(userId, habitType, value, unit = null, notes = null) {
    try {
      // Check rate limiting
      const canLog = await this.checkRateLimit(userId, 'habit_log');
      if (!canLog) {
        throw new Error('Rate limit exceeded for habit logging');
      }

      const { data, error } = await supabase
        .from('habit_logs')
        .insert({
          user_id: userId,
          habit_type: habitType,
          value: value,
          unit: unit,
          notes: notes,
          logged_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Log habit error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get habit logs for a user
  static async getHabitLogs(userId, habitType = null, startDate = null, endDate = null) {
    try {
      let query = supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

      if (habitType) {
        query = query.eq('habit_type', habitType);
      }

      if (startDate) {
        query = query.gte('logged_at', startDate);
      }

      if (endDate) {
        query = query.lte('logged_at', endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get habit logs error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get user streaks
  static async getUserStreaks(userId) {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .select(`
          *,
          habit_types (name, description, icon, color)
        `)
        .eq('user_id', userId)
        .order('current_streak', { ascending: false });

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get user streaks error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get habit types
  static async getHabitTypes() {
    try {
      const { data, error } = await supabase
        .from('habit_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get habit types error:', error);
      return { data: null, error: error.message };
    }
  }

  // =============================================
  // EXERCISE SYSTEM
  // =============================================

  // Get exercise categories
  static async getExerciseCategories() {
    try {
      const { data, error } = await supabase
        .from('exercise_categories')
        .select('*')
        .order('sort_order');

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get exercise categories error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get exercises by category
  static async getExercisesByCategory(categoryId, isPremium = false) {
    try {
      let query = supabase
        .from('exercises')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('sort_order');

      // Filter premium exercises based on user status
      if (!isPremium) {
        query = query.eq('is_premium', false);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get exercises by category error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get all exercises
  static async getAllExercises(isPremium = false) {
    try {
      let query = supabase
        .from('exercises')
        .select(`
          *,
          exercise_categories (name, description, icon, color)
        `)
        .eq('is_active', true)
        .order('sort_order');

      if (!isPremium) {
        query = query.eq('is_premium', false);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get all exercises error:', error);
      return { data: null, error: error.message };
    }
  }

  // Log exercise completion
  static async logExerciseCompletion(userId, exerciseId, durationMinutes = null, notes = null, rating = null) {
    try {
      const { data, error } = await supabase
        .from('exercise_completions')
        .insert({
          user_id: userId,
          exercise_id: exerciseId,
          duration_minutes: durationMinutes,
          notes: notes,
          rating: rating,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Log exercise completion error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get user exercise completions
  static async getUserExerciseCompletions(userId, exerciseId = null, startDate = null, endDate = null) {
    try {
      let query = supabase
        .from('exercise_completions')
        .select(`
          *,
          exercises (name, category_id, duration_minutes)
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (exerciseId) {
        query = query.eq('exercise_id', exerciseId);
      }

      if (startDate) {
        query = query.gte('completed_at', startDate);
      }

      if (endDate) {
        query = query.lte('completed_at', endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get user exercise completions error:', error);
      return { data: null, error: error.message };
    }
  }

  // =============================================
  // FOOD SCANNING & NUTRITION
  // =============================================

  // Save food scan
  static async saveFoodScan(userId, foodData) {
    try {
      // Check rate limiting
      const canScan = await this.checkRateLimit(userId, 'food_scan');
      if (!canScan) {
        throw new Error('Rate limit exceeded for food scanning');
      }

      const { data, error } = await supabase
        .from('food_scans')
        .insert({
          user_id: userId,
          food_item_id: foodData.foodItemId,
          barcode: foodData.barcode,
          quantity: foodData.quantity || 1.0,
          unit: foodData.unit || 'serving',
          meal_type: foodData.mealType,
          growth_score: foodData.growthScore,
          notes: foodData.notes,
          scanned_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Save food scan error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get user food scans
  static async getUserFoodScans(userId, startDate = null, endDate = null) {
    try {
      let query = supabase
        .from('food_scans')
        .select(`
          *,
          food_items (name, brand, nutrition_data, growth_score, image_url)
        `)
        .eq('user_id', userId)
        .order('scanned_at', { ascending: false });

      if (startDate) {
        query = query.gte('scanned_at', startDate);
      }
      
      if (endDate) {
        query = query.lte('scanned_at', endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get user food scans error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get daily nutrition summary
  static async getDailyNutrition(userId, date) {
    try {
      const { data, error } = await supabase
        .from('daily_nutrition')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get daily nutrition error:', error);
      return { data: null, error: error.message };
    }
  }

  // =============================================
  // COMMUNITY FEATURES
  // =============================================

  // Create a post
  static async createPost(userId, postData) {
    try {
      // Check rate limiting
      const canPost = await this.checkRateLimit(userId, 'community_post');
      if (!canPost) {
        throw new Error('Rate limit exceeded for community posts');
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          content: postData.content,
          post_type: postData.postType || 'motivation',
          image_urls: postData.imageUrls || [],
          height_data: postData.heightData || null,
          is_public: postData.isPublic !== false,
          created_at: new Date().toISOString(),
        })
        .select(`
          *,
          users (display_name, avatar_url)
        `)
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Create post error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get community posts
  static async getCommunityPosts(limit = 20, offset = 0, postType = null) {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          users (display_name, avatar_url),
          post_likes (user_id)
        `)
        .eq('is_public', true)
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (postType) {
        query = query.eq('post_type', postType);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get community posts error:', error);
      return { data: null, error: error.message };
    }
  }

  // Like/unlike a post
  static async togglePostLike(userId, postId) {
    try {
      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('post_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(this.getErrorMessage(checkError));
      }

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);

        if (error) {
          throw new Error(this.getErrorMessage(error));
        }

        // Decrement likes count
        await supabase.rpc('decrement_post_likes', { post_id: postId });
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            user_id: userId,
            post_id: postId,
          });

        if (error) {
          throw new Error(this.getErrorMessage(error));
        }

        // Increment likes count
        await supabase.rpc('increment_post_likes', { post_id: postId });
      }

      return { error: null };
    } catch (error) {
      console.error('Toggle post like error:', error);
      return { error: error.message };
    }
  }

  // Add comment to post
  static async addComment(userId, postId, content, parentCommentId = null) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: userId,
          post_id: postId,
          content: content,
          parent_comment_id: parentCommentId,
          created_at: new Date().toISOString(),
        })
        .select(`
          *,
          users (display_name, avatar_url)
        `)
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Add comment error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get post comments
  static async getPostComments(postId, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users (display_name, avatar_url),
          comment_likes (user_id)
        `)
        .eq('post_id', postId)
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get post comments error:', error);
      return { data: null, error: error.message };
    }
  }

  // =============================================
  // GAMIFICATION
  // =============================================

  // Get user badges
  static async getUserBadges(userId) {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge_definitions (name, description, icon, color)
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get user badges error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get available challenges
  static async getChallenges(isPremium = false) {
    try {
      let query = supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!isPremium) {
        query = query.eq('is_premium', false);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get challenges error:', error);
      return { data: null, error: error.message };
    }
  }

  // Join a challenge
  static async joinChallenge(userId, challengeId) {
    try {
      const { data, error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: userId,
          challenge_id: challengeId,
          joined_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Join challenge error:', error);
      return { data: null, error: error.message };
    }
  }

  // =============================================
  // AI INSIGHTS
  // =============================================

  // Get AI insights for user
  static async getAIInsights(userId, insightType = null, limit = 10) {
    try {
      let query = supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (insightType) {
        query = query.eq('insight_type', insightType);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get AI insights error:', error);
      return { data: null, error: error.message };
    }
  }

  // Save AI insight
  static async saveAIInsight(userId, insightData) {
    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .insert({
          user_id: userId,
          insight_type: insightData.type,
          content: insightData.content,
          data: insightData.data || {},
          confidence_score: insightData.confidenceScore,
          is_premium: insightData.isPremium || false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Save AI insight error:', error);
      return { data: null, error: error.message };
    }
  }

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================

  // Check rate limiting
  static async checkRateLimit(userId, actionType) {
    try {
      const now = new Date();
      const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

      const { data, error } = await supabase
        .from('rate_limits')
        .select('count')
        .eq('user_id', userId)
        .eq('action_type', actionType)
        .gte('window_start', windowStart.toISOString());

      if (error) {
        console.error('Check rate limit error:', error);
        return true; // Allow if we can't check
      }

      const totalCount = data.reduce((sum, record) => sum + record.count, 0);
      const limit = RATE_LIMITS[actionType.toUpperCase()] || 100;

      return totalCount < limit;
    } catch (error) {
      console.error('Check rate limit error:', error);
      return true; // Allow if we can't check
    }
  }

  // Record rate limit usage
  static async recordRateLimit(userId, actionType) {
    try {
      const { error } = await supabase
        .from('rate_limits')
        .insert({
          user_id: userId,
          action_type: actionType,
          count: 1,
          window_start: new Date().toISOString(),
        });

      if (error) {
        console.error('Record rate limit error:', error);
      }
    } catch (error) {
      console.error('Record rate limit error:', error);
    }
  }

  // Get error message
  static getErrorMessage(error) {
    const errorMessages = {
      'duplicate key value violates unique constraint': 'This item already exists.',
      'insert or update on table violates foreign key constraint': 'Invalid reference to related data.',
      'new row violates row-level security policy': 'You do not have permission to perform this action.',
      'rate limit exceeded': 'Too many requests. Please try again later.',
    };

    return errorMessages[error.message] || error.message || 'An unexpected error occurred.';
  }
}

// Export individual functions for backward compatibility
export const logHabit = DatabaseService.logHabit;
export const getHabitLogs = DatabaseService.getHabitLogs;
export const getUserStreaks = DatabaseService.getUserStreaks;
export const getHabitTypes = DatabaseService.getHabitTypes;
export const getExerciseCategories = DatabaseService.getExerciseCategories;
export const getExercisesByCategory = DatabaseService.getExercisesByCategory;
export const getAllExercises = DatabaseService.getAllExercises;
export const logExerciseCompletion = DatabaseService.logExerciseCompletion;
export const getUserExerciseCompletions = DatabaseService.getUserExerciseCompletions;
export const saveFoodScan = DatabaseService.saveFoodScan;
export const getUserFoodScans = DatabaseService.getUserFoodScans;
export const getDailyNutrition = DatabaseService.getDailyNutrition;
export const createPost = DatabaseService.createPost;
export const getCommunityPosts = DatabaseService.getCommunityPosts;
export const togglePostLike = DatabaseService.togglePostLike;
export const addComment = DatabaseService.addComment;
export const getPostComments = DatabaseService.getPostComments;
export const getUserBadges = DatabaseService.getUserBadges;
export const getChallenges = DatabaseService.getChallenges;
export const joinChallenge = DatabaseService.joinChallenge;
export const getAIInsights = DatabaseService.getAIInsights;
export const saveAIInsight = DatabaseService.saveAIInsight;

export default DatabaseService;