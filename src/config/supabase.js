import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ffdtcjigdccrbxjcizko.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZHRjamlnZGNjcmJ4amNpemtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1Mzk5NzYsImV4cCI6MjA3MzExNTk3Nn0.88u-IPP9lmFd0zFQ-aUge1_c_gL-32H_XCjtxVDkAH0';

// Custom storage adapter with better error handling and persistence
const customStorage = {
  getItem: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      // Removed verbose logging for getItem to reduce log noise (Supabase calls it multiple times)
      return value;
    } catch (error) {
      console.error(`❌ [Storage] Error getting ${key}:`, error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log(`💾 [Storage] Saved ${key} successfully`);
    } catch (error) {
      console.error(`❌ [Storage] Error saving ${key}:`, error);
      throw error;
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`🗑️ [Storage] Removed ${key}`);
    } catch (error) {
      console.error(`❌ [Storage] Error removing ${key}:`, error);
    }
  },
};

// Create Supabase client with security configurations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // Enable PKCE for mobile OAuth deep linking
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limiting for real-time events
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'peakheight-mobile',
    },
  },
});

// Security: Rate limiting configuration
export const RATE_LIMITS = {
  AI_REQUESTS: 50, // per day for free users
  COMMUNITY_POSTS: 10, // per day
  FOOD_SCANS: 100, // per day
  HABIT_LOGS: 50, // per day
};

// Feature flags for staged rollout
export const FEATURE_FLAGS = {
  AI_INSIGHTS: true,
  COMMUNITY_FEATURES: true,
  PREMIUM_FEATURES: true,
  REAL_TIME_SYNC: true,
  PUSH_NOTIFICATIONS: true,
};

export default supabase;
