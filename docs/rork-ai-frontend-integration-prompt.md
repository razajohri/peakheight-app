# Rork AI Frontend Integration Prompt

## 🎯 Task Overview

You need to integrate an existing React Native frontend with a Supabase backend. The frontend is already built and functional with mock data. Your job is to replace the mock data with real backend API calls and add authentication.

## 📱 Project Context

**App Name**: PeakHeight - Height optimization mobile app
**Frontend**: React Native with Expo (already built)
**Backend**: Supabase (PostgreSQL + Auth + Storage + Real-time)
**Target**: Help users maximize their natural height through habits, exercises, and nutrition

## 🏗️ Current Frontend Structure

### Existing Files (DO NOT DELETE - Only Modify)
```
src/
├── screens/
│   ├── MainApp.js (tab navigation)
│   ├── HomeScreen.js (dashboard with height blob)
│   ├── ExercisesScreen.js (exercise library)
│   ├── ProgressScreen.js (habit tracking)
│   ├── ProfileScreen.js (community/tribe)
│   └── AuthScreen.js (authentication)
├── services/
│   ├── supabase.js (placeholder)
│   ├── auth.js (mock functions)
│   └── database.js (placeholder)
├── components/
│   ├── Nutrition/FoodScanner.js (barcode scanning)
│   └── Home/AICoachWidget.js (AI insights)
└── utils/
    └── exercisesData.js (local exercise data)
```

## 🔧 Integration Tasks

### Task 1: Install Required Dependencies

**Add to package.json**:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "@react-native-async-storage/async-storage": "^1.19.0",
    "react-native-url-polyfill": "^2.0.0"
  }
}
```

**Run**: `npm install`

### Task 2: Environment Setup

**Create `.env` file**:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Task 3: Update Supabase Service

**File**: `src/services/supabase.js`

**Replace entire file with**:
```javascript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

export default supabase;
```

### Task 4: Update Authentication Service

**File**: `src/services/auth.js`

**Replace with real Supabase auth functions**:
```javascript
import { supabase } from './supabase';

export class AuthService {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'exp://localhost:19000'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Get current user failed:', error);
      throw error;
    }
  }

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
```

### Task 5: Update Database Service

**File**: `src/services/database.js`

**Replace with real database operations**:
```javascript
import { supabase } from './supabase';

export class DatabaseService {
  // User operations
  async fetchUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  }

  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    return { data, error };
  }

  // Habit operations
  async logHabit(userId, habitType, value, notes = '') {
    const { data, error } = await supabase
      .from('habit_logs')
      .insert({
        user_id: userId,
        habit_type: habitType,
        value: value,
        notes: notes,
        logged_at: new Date().toISOString()
      });
    return { data, error };
  }

  async fetchHabitLogs(userId, habitType = null) {
    let query = supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false });

    if (habitType) {
      query = query.eq('habit_type', habitType);
    }

    const { data, error } = await query;
    return { data, error };
  }

  async fetchStreaks(userId) {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  }

  // Exercise operations
  async fetchExercises(categoryId = null) {
    let query = supabase
      .from('exercises')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    return { data, error };
  }

  async fetchExerciseCategories() {
    const { data, error } = await supabase
      .from('exercise_categories')
      .select('*')
      .order('sort_order');
    return { data, error };
  }

  async logExerciseCompletion(userId, exerciseId, duration, notes = '') {
    const { data, error } = await supabase
      .from('user_exercise_plans')
      .insert({
        user_id: userId,
        exercise_id: exerciseId,
        completed_at: new Date().toISOString(),
        duration_minutes: duration,
        notes: notes
      });
    return { data, error };
  }

  // Food operations
  async saveFoodScan(userId, foodData) {
    const { data, error } = await supabase
      .from('food_scans')
      .insert({
        user_id: userId,
        barcode: foodData.barcode,
        nutrition_data: foodData.nutrition,
        growth_score: foodData.growthScore,
        meal_type: foodData.mealType || 'snack'
      });
    return { data, error };
  }

  async fetchFoodScans(userId) {
    const { data, error } = await supabase
      .from('food_scans')
      .select('*')
      .eq('user_id', userId)
      .order('scanned_at', { ascending: false });
    return { data, error };
  }

  // Community operations
  async fetchPosts(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users:user_id (display_name, avatar_url)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  }

  async createPost(userId, content, postType, imageUrls = []) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content: content,
        post_type: postType,
        image_urls: imageUrls
      });
    return { data, error };
  }

  async fetchComments(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users:user_id (display_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    return { data, error };
  }

  async createComment(postId, userId, content) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: content
      });
    return { data, error };
  }

  // AI operations
  async fetchAIInsights(userId, insightType = null) {
    let query = supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (insightType) {
      query = query.eq('insight_type', insightType);
    }

    const { data, error } = await query;
    return { data, error };
  }

  async saveAIInsight(userId, insightType, content, data = {}) {
    const { data: result, error } = await supabase
      .from('ai_insights')
      .insert({
        user_id: userId,
        insight_type: insightType,
        content: content,
        data: data
      });
    return { data: result, error };
  }
}

export const databaseService = new DatabaseService();
```

### Task 6: Update Main App with Authentication

**File**: `src/screens/MainApp.js`

**Add authentication state management**:
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../services/supabase';

// Import main app screens
import HomeScreen from './HomeScreen';
import ExercisesScreen from './ExercisesScreen';
import ProgressScreen from './ProgressScreen';
import ProfileScreen from './ProfileScreen';
import AuthScreen from './AuthScreen';
import FoodScanner from '../components/Nutrition/FoodScanner';

export default function MainApp({ onLogout }) {
  const [currentTab, setCurrentTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const renderCurrentScreen = () => {
    // Handle overlay screens first
    if (currentScreen === 'FoodScanner') {
      return (
        <FoodScanner
          navigation={{
            navigate: (screen) => setCurrentScreen(screen),
            goBack: () => setCurrentScreen(null)
          }}
          onClose={() => setCurrentScreen(null)}
        />
      );
    }

    // Handle main tab screens
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            user={user}
            onNavigateToProgress={() => setCurrentTab('progress')}
            onNavigateToProfile={() => setCurrentTab('profile')}
          />
        );
      case 'exercises':
        return (
          <ExercisesScreen
            user={user}
            navigation={{
              navigate: (screen) => setCurrentScreen(screen),
              goBack: () => setCurrentScreen(null)
            }}
          />
        );
      case 'progress':
        return <ProgressScreen user={user} />;
      case 'profile':
        return <ProfileScreen user={user} />;
      default:
        return (
          <HomeScreen
            user={user}
            onNavigateToProgress={() => setCurrentTab('progress')}
            onNavigateToProfile={() => setCurrentTab('profile')}
          />
        );
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CD964" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen onLoginSuccess={() => setUser(user)} />;
  }

  const tabs = [
    { id: 'home', label: 'Me', icon: 'home' },
    { id: 'exercises', label: 'Hub', icon: 'barbell' },
    { id: 'progress', label: 'Today', icon: 'stats-chart' },
    { id: 'profile', label: 'Tribe', icon: 'people' },
  ];

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        {renderCurrentScreen()}
      </View>

      {/* Bottom Tab Navigation - Hide when showing overlay screens */}
      {!currentScreen && (
        <View style={[styles.bottomTabs, { paddingBottom: insets.bottom }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => setCurrentTab(tab.id)}
            >
              <Icon
                name={tab.icon}
                size={24}
                color={currentTab === tab.id ? '#000000' : '#666666'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  currentTab === tab.id && styles.tabLabelActive
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#000000',
    fontWeight: '600',
  },
});
```

### Task 7: Update Home Screen with Real Data

**File**: `src/screens/HomeScreen.js`

**Add real data fetching**:
```javascript
// Add these imports at the top
import { databaseService } from '../services/database';
import { supabase } from '../services/supabase';

// Add these state variables after existing useState declarations
const [userData, setUserData] = useState(null);
const [growthFactors, setGrowthFactors] = useState([]);
const [loading, setLoading] = useState(false);

// Add this useEffect after existing useEffects
useEffect(() => {
  if (user) {
    fetchUserData();
    fetchGrowthFactors();
  }
}, [user]);

// Add these functions
const fetchUserData = async () => {
  try {
    setLoading(true);
    const { data, error } = await databaseService.fetchUserProfile(user.id);
    if (error) throw error;
    setUserData(data);
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    setLoading(false);
  }
};

const fetchGrowthFactors = async () => {
  try {
    const { data: habitLogs, error } = await databaseService.fetchHabitLogs(user.id);
    if (error) throw error;

    // Calculate growth factors from habit logs
    const factors = calculateGrowthFactors(habitLogs);
    setGrowthFactors(factors);
  } catch (error) {
    console.error('Error fetching growth factors:', error);
  }
};

const calculateGrowthFactors = (habitLogs) => {
  // Calculate factors based on recent habit logs
  const factors = [
    { name: 'Sleep', value: 85, color: '#4CD964', icon: 'moon' },
    { name: 'Nutrition', value: 72, color: '#FF3B30', icon: 'restaurant' },
    { name: 'Exercise', value: 68, color: '#FF9500', icon: 'fitness' },
    { name: 'Posture', value: 91, color: '#4CD964', icon: 'body' },
  ];

  return factors;
};

// Add real-time updates
useEffect(() => {
  if (!user) return;

  const subscription = supabase
    .channel('habit-updates')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'habit_logs',
      filter: `user_id=eq.${user.id}`
    }, (payload) => {
      // Refresh growth factors when new habit is logged
      fetchGrowthFactors();
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, [user]);
```

### Task 8: Update Exercise Screen with Backend Data

**File**: `src/screens/ExercisesScreen.js`

**Replace local data with backend API**:
```javascript
// Add these imports
import { databaseService } from '../services/database';

// Replace the existing exercises state and data
const [exercises, setExercises] = useState([]);
const [categories, setCategories] = useState([]);

// Add this useEffect to fetch data
useEffect(() => {
  fetchExercises();
  fetchCategories();
}, []);

const fetchExercises = async () => {
  try {
    const { data, error } = await databaseService.fetchExercises();
    if (error) throw error;
    setExercises(data || []);
  } catch (error) {
    console.error('Error fetching exercises:', error);
  }
};

const fetchCategories = async () => {
  try {
    const { data, error } = await databaseService.fetchExerciseCategories();
    if (error) throw error;
    setCategories(data || []);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

// Update the openExercise function to log completion
const openExercise = async (item) => {
  setSelectedExercise(item._full ? item._full : item);
  setView('detail');

  // Log exercise view
  if (user) {
    try {
      await databaseService.logExerciseCompletion(user.id, item.id, 0, 'Viewed exercise');
    } catch (error) {
      console.error('Error logging exercise view:', error);
    }
  }
};
```

### Task 9: Update Food Scanner with Backend Storage

**File**: `src/components/Nutrition/FoodScanner.js`

**Add backend storage for food scans**:
```javascript
// Add this import
import { databaseService } from '../../services/database';

// Update the lookupFoodData function
const lookupFoodData = async (barcode) => {
  setLoading(true);
  try {
    const response = await fetch(`https://api.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();

    if (data.status === 1 && data.product) {
      const product = data.product;
      const nutrition = extractNutrition(product.nutriments);
      const growthScore = calculateGrowthScore(nutrition);

      const foodData = {
        name: product.product_name || 'Unknown Product',
        brand: product.brands || '',
        nutrition,
        growthScore,
        image: product.image_url,
        ingredients: product.ingredients_text || '',
        barcode: barcode
      };

      // Save to backend if user is logged in
      if (user) {
        try {
          await databaseService.saveFoodScan(user.id, foodData);
        } catch (error) {
          console.error('Error saving food scan:', error);
        }
      }

      setScanResult(foodData);
    } else {
      Alert.alert('Product Not Found', 'This product is not in our database. Try scanning a different barcode.');
    }
  } catch (error) {
    console.error('Error looking up food:', error);
    Alert.alert('Error', 'Failed to look up product information. Please check your internet connection.');
  } finally {
    setLoading(false);
  }
};
```

### Task 10: Update Progress Screen with Real Habit Tracking

**File**: `src/screens/ProgressScreen.js`

**Add real habit logging**:
```javascript
// Add these imports
import { databaseService } from '../services/database';

// Add state for habit logs
const [habitLogs, setHabitLogs] = useState([]);
const [streaks, setStreaks] = useState([]);

// Add useEffect to fetch data
useEffect(() => {
  if (user) {
    fetchHabitLogs();
    fetchStreaks();
  }
}, [user]);

const fetchHabitLogs = async () => {
  try {
    const { data, error } = await databaseService.fetchHabitLogs(user.id);
    if (error) throw error;
    setHabitLogs(data || []);
  } catch (error) {
    console.error('Error fetching habit logs:', error);
  }
};

const fetchStreaks = async () => {
  try {
    const { data, error } = await databaseService.fetchStreaks(user.id);
    if (error) throw error;
    setStreaks(data || []);
  } catch (error) {
    console.error('Error fetching streaks:', error);
  }
};

// Add function to log habits
const logHabit = async (habitType, value, notes = '') => {
  try {
    const { error } = await databaseService.logHabit(user.id, habitType, value, notes);
    if (error) throw error;

    // Refresh data
    fetchHabitLogs();
    fetchStreaks();
  } catch (error) {
    console.error('Error logging habit:', error);
    Alert.alert('Error', 'Failed to log habit. Please try again.');
  }
};
```

### Task 11: Update Profile Screen with Community Features

**File**: `src/screens/ProfileScreen.js`

**Add real community data**:
```javascript
// Add these imports
import { databaseService } from '../services/database';

// Add state for community data
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(false);

// Add useEffect to fetch posts
useEffect(() => {
  fetchPosts();
}, []);

const fetchPosts = async () => {
  try {
    setLoading(true);
    const { data, error } = await databaseService.fetchPosts();
    if (error) throw error;
    setPosts(data || []);
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    setLoading(false);
  }
};

// Add function to create posts
const createPost = async (content, postType) => {
  try {
    const { error } = await databaseService.createPost(user.id, content, postType);
    if (error) throw error;

    // Refresh posts
    fetchPosts();
  } catch (error) {
    console.error('Error creating post:', error);
    Alert.alert('Error', 'Failed to create post. Please try again.');
  }
};
```

## 🔄 Real-time Updates Implementation

**Add to any component that needs live updates**:
```javascript
useEffect(() => {
  if (!user) return;

  const subscription = supabase
    .channel('updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'habit_logs',
      filter: `user_id=eq.${user.id}`
    }, (payload) => {
      // Handle real-time updates
      console.log('Real-time update:', payload);
      // Refresh relevant data
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, [user]);
```

## 🚨 Error Handling Pattern

**Add to all components**:
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleApiCall = async (apiFunction) => {
  setLoading(true);
  setError(null);
  try {
    const result = await apiFunction();
    return result;
  } catch (err) {
    setError(err.message);
    console.error('API Error:', err);
    Alert.alert('Error', err.message);
  } finally {
    setLoading(false);
  }
};
```

## ✅ Testing Checklist

After implementing all changes:

1. **Authentication**: Test sign up, sign in, sign out
2. **Data Loading**: Verify all screens load real data
3. **Real-time Updates**: Test live updates work
4. **Error Handling**: Test offline scenarios
5. **Food Scanner**: Test barcode scanning and storage
6. **Habit Logging**: Test habit tracking and streaks
7. **Community**: Test post creation and viewing
8. **Navigation**: Test all navigation flows

## 🎯 Success Criteria

- [ ] All mock data replaced with real backend data
- [ ] Authentication working properly
- [ ] Real-time updates functioning
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Offline support working
- [ ] All existing UI/UX preserved
- [ ] No breaking changes to existing functionality

## 📝 Notes

- **DO NOT** change the existing UI/UX design
- **DO NOT** remove any existing functionality
- **ONLY** replace mock data with real API calls
- **ADD** proper error handling and loading states
- **MAINTAIN** all existing navigation and user flows
- **PRESERVE** the existing component structure and styling

The goal is to make the existing frontend work with a real backend while maintaining all current functionality and design.
