import { supabase } from '../config/supabase';
import { RATE_LIMITS, FEATURE_FLAGS } from '../config/supabase';
import { ImageUploadService } from './imageUploadService';
import NotificationService from './notificationService';

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
      // Ensure user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Verify the userId matches the authenticated user
      if (user.id !== userId) {
        throw new Error('User ID mismatch');
      }

      // Check rate limiting (temporarily disabled for debugging)
      // const canPost = await this.checkRateLimit(userId, 'COMMUNITY_POSTS');
      // if (!canPost) {
      //   throw new Error('Rate limit exceeded for community posts');
      // }

      // Handle image uploads if any
      let imageUrls = [];
      if (postData.imageUrls && postData.imageUrls.length > 0) {
        console.log('Uploading images...', postData.imageUrls);
        try {
          const uploadResult = await ImageUploadService.uploadPostImages(postData.imageUrls, userId);
          console.log('Upload result:', uploadResult);
          if (uploadResult.success) {
            imageUrls = uploadResult.urls;
            console.log('Images uploaded successfully:', imageUrls);
          } else {
            console.warn('Image upload failed:', uploadResult.errors);
            // Use local URIs as fallback
            imageUrls = postData.imageUrls;
          }
        } catch (uploadError) {
          console.error('Image upload error in DatabaseService:', uploadError);
          // Use local URIs as fallback
          imageUrls = postData.imageUrls;
        }
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          content: postData.content,
          post_type: postData.postType || 'motivation',
          image_urls: imageUrls,
          height_data: postData.heightData || null,
          is_public: postData.isPublic !== false,
          moderation_status: 'approved', // Auto-approve for now
          created_at: new Date().toISOString(),
        })
        .select(`
          *,
          users (display_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Database error:', error);
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
          users (id, display_name, first_name, last_name, email, avatar_url, date_of_birth),
          post_likes (user_id),
          post_saves (user_id),
          comments!comments_post_id_fkey (
            id,
            content,
            created_at,
            user_id,
            parent_comment_id,
            users (id, display_name, first_name, last_name, email, avatar_url)
          )
        `)
        .eq('is_public', true)
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: false })
        .order('created_at', { foreignTable: 'comments', ascending: true })
        .range(offset, offset + limit - 1);

      if (postType) {
        query = query.eq('post_type', postType);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      console.log('📦 Fetched posts with comments:', data?.length);
      if (data && data.length > 0) {
        console.log('📝 First post comments:', data[0].comments?.length || 0);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get community posts error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get recent user join events (for Tribe notifications)
  static async getRecentJoinEvents(limit = 50, hoursAgo = 48) {
    try {
      // Calculate timestamp for X hours ago
      const hoursAgoDate = new Date();
      hoursAgoDate.setHours(hoursAgoDate.getHours() - hoursAgo);

      const { data, error } = await supabase
        .from('user_join_events')
        .select(`
          *,
          users (id, display_name, first_name, last_name, email, avatar_url)
        `)
        .gte('joined_at', hoursAgoDate.toISOString())
        .order('joined_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Get recent join events error:', error);
      return { data: [], error: error.message };
    }
  }

  // Create a join event (called when user completes onboarding)
  static async createJoinEvent(userId) {
    try {
      const { data, error } = await supabase
        .from('user_join_events')
        .insert({
          user_id: userId,
          joined_at: new Date().toISOString(),
        })
        .select(`
          *,
          users (id, display_name, first_name, last_name, email, avatar_url)
        `)
        .single();

      if (error) {
        // If error is due to unique constraint, that's okay (user already has a join event)
        if (error.code === '23505') {
          console.log('Join event already exists for user:', userId);
          return { data: null, error: null };
        }
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Create join event error:', error);
      return { data: null, error: error.message };
    }
  }

  // Like/unlike a post
  static async togglePostLike(userId, postId) {
    try {
      console.log(`Toggling like for user ${userId} on post ${postId}`);
      
      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('post_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing like:', checkError);
        throw new Error(this.getErrorMessage(checkError));
      }

      if (existingLike) {
        // Unlike
        console.log('Removing like...');
        const { error: deleteError } = await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);

        if (deleteError) {
          console.error('Error deleting like:', deleteError);
          throw new Error(this.getErrorMessage(deleteError));
        }

        // Manually decrement likes count
        const { data: currentPost, error: fetchError } = await supabase
          .from('posts')
          .select('likes_count')
          .eq('id', postId)
          .single();

        if (fetchError) {
          console.error('Error fetching current likes count:', fetchError);
          throw new Error(this.getErrorMessage(fetchError));
        }

        const newCount = Math.max(0, (currentPost.likes_count || 0) - 1);
        const { error: updateError } = await supabase
          .from('posts')
          .update({ likes_count: newCount })
          .eq('id', postId);

        if (updateError) {
          console.error('Error decrementing likes count:', updateError);
          throw new Error(this.getErrorMessage(updateError));
        }

        console.log('Like removed successfully');
      } else {
        // Like
        console.log('Adding like...');
        const { error: insertError } = await supabase
          .from('post_likes')
          .insert({
            user_id: userId,
            post_id: postId,
          });

        if (insertError) {
          console.error('Error inserting like:', insertError);
          throw new Error(this.getErrorMessage(insertError));
        }

        // Manually increment likes count
        const { data: currentPost, error: fetchError } = await supabase
          .from('posts')
          .select('likes_count, user_id')
          .eq('id', postId)
          .single();

        if (fetchError) {
          console.error('Error fetching current likes count:', fetchError);
          throw new Error(this.getErrorMessage(fetchError));
        }

        const newCount = (currentPost.likes_count || 0) + 1;
        const { error: updateError } = await supabase
          .from('posts')
          .update({ likes_count: newCount })
          .eq('id', postId);

        if (updateError) {
          console.error('Error incrementing likes count:', updateError);
          throw new Error(this.getErrorMessage(updateError));
        }

        // Send push notification to post owner (if not liking own post)
        // Wrap in try-catch to prevent RLS errors from breaking the like functionality
        if (currentPost.user_id !== userId) {
          try {
            const { data: likerProfile } = await supabase
              .from('users')
              .select('first_name, display_name')
              .eq('id', userId)
              .single();
            
            const likerName = likerProfile?.first_name || likerProfile?.display_name || 'Someone';
            
            await NotificationService.sendPushNotification(
              currentPost.user_id,
              'Your post got a like!',
              `${likerName} liked your post`,
              { postId, type: 'like' }
            );
          } catch (notificationError) {
            // Log error but don't break the like functionality
            // RLS policies may prevent inserting notifications for other users
            console.warn('Failed to send like notification (RLS policy may be blocking):', notificationError.message);
          }
        }

        console.log('Like added successfully');
      }

      return { error: null };
    } catch (error) {
      console.error('Toggle post like error:', error);
      return { error: error.message };
    }
  }

  // Toggle post save/unsave
  static async togglePostSave(userId, postId) {
    try {
      // Check if already saved
      const { data: existingSave, error: checkError } = await supabase
        .from('post_saves')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(this.getErrorMessage(checkError));
      }

      if (existingSave) {
        // Unsave
        const { error } = await supabase
          .from('post_saves')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);

        if (error) {
          throw new Error(this.getErrorMessage(error));
        }

        return { data: { saved: false }, error: null };
      } else {
        // Save
        const { error } = await supabase
          .from('post_saves')
          .insert({
            user_id: userId,
            post_id: postId,
          });

        if (error) {
          throw new Error(this.getErrorMessage(error));
        }

        return { data: { saved: true }, error: null };
      }
    } catch (error) {
      console.error('Toggle post save error:', error);
      return { data: null, error: error.message };
    }
  }

  // Add comment to post
  static async addComment(userId, postId, content, parentCommentId = null) {
    try {
      // Get commenter's name
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userProfile } = await supabase
        .from('users')
        .select('first_name, display_name')
        .eq('id', userId)
        .single();
      
      const commenterName = userProfile?.first_name || userProfile?.display_name || 'Someone';

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

      // Increment comments count on the post
      await supabase.rpc('increment_post_comments', { post_id: postId });

      // Send push notification to post owner (if not commenting on own post)
      if (parentCommentId) {
        // This is a reply to a comment - notify the parent comment author
        const { data: parentComment } = await supabase
          .from('comments')
          .select('user_id')
          .eq('id', parentCommentId)
          .single();
        
        if (parentComment && parentComment.user_id !== userId) {
          await NotificationService.sendPushNotification(
            parentComment.user_id,
            'New Reply!',
            `${commenterName} replied to your comment`,
            { postId, commentId: data.id, parentCommentId, type: 'comment_reply' }
          );
        }
      } else {
        // This is a comment on a post - notify the post owner
        const { data: post } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .single();
        
        if (post && post.user_id !== userId) {
          await NotificationService.sendPushNotification(
            post.user_id,
            'New Comment!',
            `${commenterName} commented on your post`,
            { postId, commentId: data.id, type: 'comment' }
          );
        }
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
          users (display_name, avatar_url, first_name, last_name, email),
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
  // USER FEEDBACK
  // =============================================

  // Submit user feedback
  static async submitFeedback(userId, feedbackType, message, title = null) {
    try {
      const { data, error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: userId,
          feedback_type: feedbackType,
          title: title,
          message: message,
          status: 'pending',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Submit feedback error:', error);
      return { data: null, error: error.message };
    }
  }

  // Get user's feedback history
  static async getUserFeedback(userId, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('user_feedback')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get user feedback error:', error);
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
    // Temporarily disabled to avoid check constraint errors and per user request
    return { data: null, error: null };
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
      const limit = RATE_LIMITS[actionType] || 100;

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
export const togglePostSave = DatabaseService.togglePostSave;
export const addComment = DatabaseService.addComment;
export const getPostComments = DatabaseService.getPostComments;
export const getUserBadges = DatabaseService.getUserBadges;
export const getChallenges = DatabaseService.getChallenges;
export const joinChallenge = DatabaseService.joinChallenge;
export const getAIInsights = DatabaseService.getAIInsights;
export const saveAIInsight = DatabaseService.saveAIInsight;

export default DatabaseService;
