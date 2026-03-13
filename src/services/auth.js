import { supabase } from '../config/supabase';
import { Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

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
            first_name: userData.firstName || '',
            last_name: userData.lastName || '',
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

      // User preferences are now created automatically by the database trigger
      // No need to create them manually here

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: error.message };
    }
  }

  // Sign in with email and password
  static async signIn(email, password) {
    try {
      console.log('🔐 AuthService.signIn called with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('🔐 Supabase sign in error:', error);
        console.error('🔐 Error code:', error.code);
        console.error('🔐 Error message:', error.message);
        throw new Error(this.getErrorMessage(error));
      }

      console.log('🔐 Sign in successful for user:', data.user?.id);

      // Update last active timestamp
      if (data.user) {
        await this.updateLastActive(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      console.error('🔐 Sign in error caught:', error);
      return { data: null, error: error.message };
    }
  }

  // Sign in with Facebook (Expo OAuth using PKCE)
  static async signInWithFacebook() {
    try {
      // Use Supabase OAuth with app scheme redirect
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: 'peakheight://auth/callback',
          skipBrowserRedirect: false,
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
      console.error('Facebook sign in error:', error);
      return { data: null, error: error.message };
    }
  }

  // Sign in with Apple using native Apple Authentication
  static async signInWithApple() {
    try {
      console.log('🍎 AuthService.signInWithApple called');

      // Check if Apple Authentication is available
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Apple Sign-In is not available on this device');
      }

      console.log('🍎 Starting native Apple authentication...');

      // Request Apple ID credential
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('🍎 Apple credential received:', {
        user: credential.user,
        email: credential.email,
        fullName: credential.fullName,
        identityToken: credential.identityToken ? 'Present' : 'Missing',
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      // Sign in to Supabase with the Apple ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      console.log('🍎 Supabase signInWithIdToken response:', { data, error });

      if (error) {
        console.log('🍎 Supabase signInWithIdToken error:', error);
        throw new Error(this.getErrorMessage(error));
      }

      // Save Apple user name data if provided (only available on first sign-in)
      if (credential.fullName && data?.user?.id) {
        const firstName = credential.fullName.givenName || '';
        const lastName = credential.fullName.familyName || '';
        
        if (firstName || lastName) {
          console.log('🍎 Saving Apple user name:', { firstName, lastName });
          
          // Minimal delay for profile creation
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Update profile with name data
          const displayName = `${firstName} ${lastName}`.trim();
          await this.updateUserProfile(data.user.id, {
            firstName,
            lastName,
            displayName: displayName || undefined,
          });
          
          console.log('🍎 Apple user name saved successfully');
        }
      }

      console.log('🍎 Apple sign in successful');
      return { data, error: null };
    } catch (error) {
      console.error('🍎 Apple sign in error:', error);
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
      // Bypass RevenueCat for test users
      const bypassUserIds = [
        'db497060-1ca7-428f-adcd-7546b72405de', // roman.lakhnyu@gmail.com
        'c8c02575-4351-4953-b04b-3c6c8adbcde2', // usepeakheight@gmail.com
        'a8e234d9-dd05-4d72-9d0b-5cbbfc1022a6', // imeddieking@gmail.com
        'ebb90fe5-eec7-4696-ac61-48432db46e0b', // immujtaba@gmail.com (old ID)
        'b241a0ec-bd7b-46d9-93cf-29ab6a37dde1'  // immujtaba@gmail.com
      ];
      
      if (bypassUserIds.includes(userId)) {
        // Check users table premium_status for bypass users
        const { data: userData } = await supabase
          .from('users')
          .select('premium_status, premium_expires_at')
          .eq('id', userId)
          .single();
        
        if (userData?.premium_status) {
          return { 
            isPremium: true, 
            subscription: { 
              status: 'active',
              end_date: userData.premium_expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            } 
          };
        }
      }

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
        .maybeSingle();

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
      // Map camelCase fields to snake_case columns used in the database
      const mapped = { id: userId };

      // Ensure NOT NULL columns and RLS WITH CHECK are satisfied on first insert
      // Fetch current auth user to include email (required by schema)
      const { data: authUserData } = await supabase.auth.getUser();
      if (authUserData && authUserData.user && authUserData.user.email) {
        mapped.email = authUserData.user.email;
      }

      // Only include fields that exist in the database schema
      if (updates.displayName !== undefined) mapped.display_name = updates.displayName;
      if (updates.firstName !== undefined) mapped.first_name = updates.firstName;
      if (updates.lastName !== undefined) mapped.last_name = updates.lastName;
      if (updates.dateOfBirth !== undefined) mapped.date_of_birth = updates.dateOfBirth;
      if (updates.gender !== undefined) mapped.gender = updates.gender;
      if (updates.currentHeight !== undefined) mapped.current_height = updates.currentHeight;
      if (updates.targetHeight !== undefined) mapped.target_height = updates.targetHeight;
      if (updates.currentWeight !== undefined) mapped.current_weight = updates.currentWeight;
      if (updates.parentHeightFather !== undefined) mapped.parent_height_father = updates.parentHeightFather;
      if (updates.parentHeightMother !== undefined) mapped.parent_height_mother = updates.parentHeightMother;
      if (updates.motivation !== undefined) mapped.motivation = updates.motivation;
      if (updates.barriers !== undefined) mapped.barriers = updates.barriers;
      if (updates.triedOptions !== undefined) mapped.tried_options = updates.triedOptions;
      if (updates.stoppingGoals !== undefined) mapped.stopping_goals = updates.stoppingGoals;
      if (updates.onboardingCompleted !== undefined) mapped.onboarding_completed = updates.onboardingCompleted;

      // Additional onboarding fields
      if (updates.ethnicity !== undefined) mapped.ethnicity = updates.ethnicity;
      if (updates.footSize !== undefined) mapped.foot_size = updates.footSize;
      if (updates.footSizeSystem !== undefined) mapped.foot_size_system = updates.footSizeSystem;
      // IMPORTANT: Base growth factor data (workout_frequency, sleep_hours) should ONLY be updated
      // when explicitly provided by the user. Never auto-calculate or infer these values.
      // NOTE: The calculated growth factor SCORES (Nutrition, Stretching Routine) will update
      // automatically based on daily task completions - that's expected behavior.
      if (updates.workoutFrequency !== undefined) {
        // Only update if explicitly provided (not null, not undefined, not empty string)
        if (updates.workoutFrequency !== null && updates.workoutFrequency !== '') {
          // Map onboarding values to database constraint values
          // Database expects: 'never', 'rarely', 'sometimes', 'often', 'daily'
          // Onboarding sends: '0-2', '3-4', '5-7' (and legacy: '3-5', '6+')
          const frequencyMap = {
            '0-2': 'rarely',
            '3-4': 'sometimes',
            '5-7': 'often',
            // Legacy mappings for backward compatibility
            '3-5': 'sometimes',
            '6+': 'often'
          };
          const validDbValues = ['never', 'rarely', 'sometimes', 'often', 'daily'];
          // If it's already a valid DB value, use it; otherwise map it or fallback
          if (validDbValues.includes(updates.workoutFrequency)) {
            mapped.workout_frequency = updates.workoutFrequency;
          } else {
            mapped.workout_frequency = frequencyMap[updates.workoutFrequency] || 'sometimes';
          }
        }
        // If workoutFrequency is null or empty, do NOT update it (preserve existing value)
      }
      // IMPORTANT: sleep_hours should ONLY be updated when explicitly provided by the user
      // Never auto-calculate or infer sleep hours from other data
      // NOTE: The Sleep Quality growth factor SCORE will be calculated from this value,
      // but the underlying sleep_hours value itself should only change when user logs it
      if (updates.sleepHours !== undefined && updates.sleepHours !== null) {
        // Validate sleep hours is a reasonable number (0-24)
        const sleepHoursNum = typeof updates.sleepHours === 'number' 
          ? updates.sleepHours 
          : parseFloat(updates.sleepHours);
        if (!isNaN(sleepHoursNum) && sleepHoursNum >= 0 && sleepHoursNum <= 24) {
          mapped.sleep_hours = sleepHoursNum;
        } else {
          console.warn(`Invalid sleep_hours value: ${updates.sleepHours}. Skipping update.`);
        }
      }
      if (updates.parentMeasurementSystem !== undefined) mapped.parent_measurement_system = updates.parentMeasurementSystem;
      if (updates.fatherFeet !== undefined) mapped.father_feet = updates.fatherFeet;
      if (updates.fatherInches !== undefined) mapped.father_inches = updates.fatherInches;
      if (updates.motherFeet !== undefined) mapped.mother_feet = updates.motherFeet;
      if (updates.motherInches !== undefined) mapped.mother_inches = updates.motherInches;
      if (updates.fatherCm !== undefined) mapped.father_cm = updates.fatherCm;
      if (updates.motherCm !== undefined) mapped.mother_cm = updates.motherCm;
      if (updates.smokingStatus !== undefined) mapped.smoking_status = updates.smokingStatus;
      if (updates.drinkingStatus !== undefined) mapped.drinking_status = updates.drinkingStatus;
      if (updates.avatarUrl !== undefined) mapped.avatar_url = updates.avatarUrl;
      // Optional onboarding email, kept separate from auth email
      if (updates.contactEmail !== undefined) mapped.contact_email = updates.contactEmail;

      // Add updated_at timestamp
      mapped.updated_at = new Date().toISOString();

      // Upsert to ensure row exists (insert if missing, update if present)
      const { data, error } = await supabase
        .from('users')
        .upsert(mapped, { onConflict: 'id' })
        .select()
        .maybeSingle();

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
