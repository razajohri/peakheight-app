import { supabase } from '../config/supabase';
import { Alert } from 'react-native';

// Authentication service with comprehensive error handling and security
export class AuthService {
  // Sign up with email and password
  static async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: userData.displayName || '',
            date_of_birth: userData.dateOfBirth || null,
            gender: userData.gender || null,
            current_height: userData.currentHeight || null,
            target_height: userData.targetHeight || null,
            parent_height_father: userData.parentHeightFather || null,
            parent_height_mother: userData.parentHeightMother || null,
            motivation: userData.motivation || '',
            barriers: userData.barriers || [],
            onboarding_completed: false,
          }
        }
      });

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      // Create user preferences
      if (data.user) {
        await this.createUserPreferences(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: error.message };
    }
  }

  // Sign in with email and password
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      // Update last active timestamp
      if (data.user) {
        await this.updateLastActive(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: error.message };
    }
  }

  // Sign in with Google OAuth
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'peakheight://auth/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error: error.message };
    }
  }

  // Sign in with Apple (iOS only)
  static async signInWithApple() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'peakheight://auth/callback',
        },
      });

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { data, error: null };
    } catch (error) {
      console.error('Apple sign in error:', error);
      return { data: null, error: error.message };
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(this.getErrorMessage(error));
      }
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error.message };
    }
  }

  // Reset password
  static async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'peakheight://auth/reset-password',
      });

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error.message };
    }
  }

  // Update password
  static async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error.message };
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        throw new Error(this.getErrorMessage(error));
      }
      return { user, error: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error: error.message };
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw new Error(this.getErrorMessage(error));
      }
      return { session, error: null };
    } catch (error) {
      console.error('Get current session error:', error);
      return { session: null, error: error.message };
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  // Create user preferences after signup
  static async createUserPreferences(userId) {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          notification_habits: true,
          notification_community: true,
          notification_ai_tips: true,
          privacy_level: 'friends',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          units: 'metric',
        });

      if (error) {
        console.error('Create user preferences error:', error);
      }
    } catch (error) {
      console.error('Create user preferences error:', error);
    }
  }

  // Update last active timestamp
  static async updateLastActive(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error('Update last active error:', error);
      }
    } catch (error) {
      console.error('Update last active error:', error);
    }
  }

  // Check if user has premium access
  static async checkPremiumStatus(userId) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('status, end_date')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error(this.getErrorMessage(error));
      }

      if (data) {
        const isActive = data.status === 'active' &&
          new Date(data.end_date) > new Date();
        return { isPremium: isActive, subscription: data };
      }

      return { isPremium: false, subscription: null };
    } catch (error) {
      console.error('Check premium status error:', error);
      return { isPremium: false, subscription: null };
    }
  }

  // Get user profile data
  static async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_preferences (*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { profile: data, error: null };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { profile: null, error: error.message };
    }
  }

  // Update user profile
  static async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { profile: data, error: null };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { profile: null, error: error.message };
    }
  }

  // Update user preferences
  static async updateUserPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .update({
          ...preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { preferences: data, error: null };
    } catch (error) {
      console.error('Update user preferences error:', error);
      return { preferences: null, error: error.message };
    }
  }

  // Delete user account
  static async deleteAccount(userId) {
    try {
      // This will cascade delete all related data due to foreign key constraints
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      // Sign out after deletion
      await this.signOut();

      return { error: null };
    } catch (error) {
      console.error('Delete account error:', error);
      return { error: error.message };
    }
  }

  // Helper method to get user-friendly error messages
  static getErrorMessage(error) {
    const errorMessages = {
      'Invalid login credentials': 'Invalid email or password. Please try again.',
      'Email not confirmed': 'Please check your email and click the confirmation link.',
      'User already registered': 'An account with this email already exists.',
      'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
      'Unable to validate email address: invalid format': 'Please enter a valid email address.',
      'Signup requires a valid password': 'Please enter a valid password.',
      'Email rate limit exceeded': 'Too many requests. Please try again later.',
      'Password reset requires a valid email': 'Please enter a valid email address.',
    };

    return errorMessages[error.message] || error.message || 'An unexpected error occurred.';
  }

  // Helper method to validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper method to validate password strength
  static validatePassword(password) {
    const errors = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export individual functions for backward compatibility
export const signUp = AuthService.signUp;
export const signIn = AuthService.signIn;
export const signInWithGoogle = AuthService.signInWithGoogle;
export const signInWithApple = AuthService.signInWithApple;
export const signOut = AuthService.signOut;
export const resetPassword = AuthService.resetPassword;
export const updatePassword = AuthService.updatePassword;
export const getCurrentUser = AuthService.getCurrentUser;
export const getCurrentSession = AuthService.getCurrentSession;
export const onAuthStateChange = AuthService.onAuthStateChange;
export const checkPremiumStatus = AuthService.checkPremiumStatus;
export const getUserProfile = AuthService.getUserProfile;
export const updateUserProfile = AuthService.updateUserProfile;
export const updateUserPreferences = AuthService.updateUserPreferences;
export const deleteAccount = AuthService.deleteAccount;

export default AuthService;
