import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client with security configurations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
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
