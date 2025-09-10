# Rork AI Complete Backend + Frontend Integration Prompt

## 🎯 Project Overview

You are tasked with building a **complete Supabase backend** for the PeakHeight mobile app AND integrating it with the existing React Native frontend. This is a comprehensive full-stack implementation.

### App Concept
PeakHeight is a height optimization platform that combines:
- **Habit Tracking**: Sleep, nutrition, exercise, posture monitoring
- **Exercise Library**: Height-specific stretches, posture corrections, strength training
- **Nutrition Scanner**: Barcode scanning for growth-focused nutrition analysis
- **AI-Powered Insights**: Height predictions, personalized tips
- **Community Features**: Progress sharing, challenges, motivation
- **Gamification**: Streaks, badges, achievements, leaderboards

### Target Users
- **Primary**: Teens and young adults (13-25) wanting to maximize height
- **Secondary**: Parents helping their children reach full height potential

## 🏗️ Technical Stack

### Frontend (Already Built)
- **Framework**: React Native with Expo
- **Navigation**: Custom tab-based navigation system
- **UI Components**: Custom components with brand aesthetics
- **Current State**: Functional with mock data, needs backend integration

### Backend (To Be Built)
- **Primary**: Supabase (Backend-as-a-Service)
- **Database**: PostgreSQL via Supabase
- **Authentication**: Email/password, Google OAuth, Apple Sign-In
- **Storage**: File storage for user uploads, exercise media
- **Real-time**: WebSocket connections for live updates
- **AI Integration**: OpenAI GPT-4 for height predictions and insights
- **Monetization**: RevenueCat for premium subscriptions

## 📊 Complete Database Schema

### 1. User Management
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  display_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  current_height DECIMAL(5,2), -- in cm
  target_height DECIMAL(5,2), -- in cm
  parent_height_father DECIMAL(5,2),
  parent_height_mother DECIMAL(5,2),
  motivation TEXT,
  barriers TEXT[],
  onboarding_completed BOOLEAN DEFAULT FALSE,
  premium_status BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  reminder_times JSONB,
  units TEXT DEFAULT 'metric',
  privacy_level TEXT DEFAULT 'friends',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Habit Tracking System
```sql
-- Habit types configuration
CREATE TABLE habit_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  target_value DECIMAL,
  target_unit TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- User habit logs
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  habit_type TEXT REFERENCES habit_types(id),
  value DECIMAL,
  unit TEXT,
  notes TEXT,
  logged_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Streak tracking
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  habit_type TEXT REFERENCES habit_types(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_logged_at TIMESTAMP,
  streak_started_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, habit_type)
);
```

### 3. Exercise System
```sql
-- Exercise categories
CREATE TABLE exercise_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER
);

-- Exercise library
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id TEXT REFERENCES exercise_categories(id),
  description TEXT,
  instructions TEXT[],
  duration_minutes INTEGER,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  equipment_needed TEXT[],
  target_muscles TEXT[],
  benefits TEXT[],
  video_url TEXT,
  image_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User exercise plans
CREATE TABLE user_exercise_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  scheduled_date DATE,
  completed_at TIMESTAMP,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Nutrition & Food Scanning
```sql
-- Food database (cached from Open Food Facts)
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode TEXT UNIQUE,
  name TEXT NOT NULL,
  brand TEXT,
  nutrition_data JSONB,
  growth_score INTEGER,
  image_url TEXT,
  ingredients TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User food scans
CREATE TABLE food_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  food_item_id UUID REFERENCES food_items(id),
  barcode TEXT,
  quantity DECIMAL DEFAULT 1.0,
  unit TEXT DEFAULT 'serving',
  scanned_at TIMESTAMP DEFAULT NOW(),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack'))
);
```

### 5. Community Features
```sql
-- Community posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT CHECK (post_type IN ('progress', 'question', 'tip', 'motivation')),
  image_urls TEXT[],
  height_data JSONB,
  is_public BOOLEAN DEFAULT TRUE,
  is_moderated BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Post comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id),
  likes_count INTEGER DEFAULT 0,
  is_moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Gamification System
```sql
-- Badge definitions
CREATE TABLE badge_definitions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  criteria JSONB,
  is_premium BOOLEAN DEFAULT FALSE
);

-- User badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES badge_definitions(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);
```

### 7. AI & Analytics
```sql
-- AI predictions and insights
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  insight_type TEXT CHECK (insight_type IN ('height_prediction', 'daily_tip', 'progress_analysis')),
  content TEXT NOT NULL,
  data JSONB,
  confidence_score DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Authentication Implementation

### Supabase Auth Setup
1. **Create Supabase Project**
2. **Configure Authentication Providers**:
   - Email/Password
   - Google OAuth
   - Apple Sign-In
3. **Set up Row Level Security (RLS)**
4. **Configure JWT settings**

### Auth Service Implementation
```javascript
// src/services/auth.js
import { supabase } from './supabase';

export class AuthService {
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData }
    });
    return { data, error };
  }

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'exp://localhost:19000' }
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
```

## ⚡ Real-time Features

### WebSocket Implementation
```javascript
// Real-time habit updates
const subscription = supabase
  .channel('habit-updates')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'habit_logs',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    updateHabitUI(payload.new);
  })
  .subscribe();
```

## 🤖 AI Integration

### Height Prediction System
```javascript
// Edge Function for height prediction
export default async function predictHeight(req) {
  const { userData, habits } = req.body;

  const prompt = `Based on the following data, predict height growth potential:
    Age: ${userData.age}
    Current Height: ${userData.currentHeight}cm
    Parent Heights: ${userData.parentHeights}
    Habits: ${JSON.stringify(habits)}

    Provide a height prediction with confidence score.`;

  const response = await openai.completions.create({
    model: "gpt-4",
    prompt: prompt,
    max_tokens: 200
  });

  return { prediction: response.choices[0].text };
}
```

### Daily Tips Engine
```javascript
// Generate personalized daily tips
export default async function generateDailyTip(req) {
  const { userId, habits, progress } = req.body;

  const prompt = `Generate a personalized height growth tip for a user with:
    Current habits: ${JSON.stringify(habits)}
    Progress: ${JSON.stringify(progress)}

    Make it encouraging and actionable.`;

  const response = await openai.completions.create({
    model: "gpt-4",
    prompt: prompt,
    max_tokens: 150
  });

  return { tip: response.choices[0].text };
}
```

## 💰 Premium Features

### RevenueCat Integration
```javascript
// Premium feature gating
export const checkPremiumStatus = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('premium_status, premium_expires_at')
    .eq('id', userId)
    .single();

  if (error) return { isPremium: false };

  const isPremium = data.premium_status &&
    new Date(data.premium_expires_at) > new Date();

  return { isPremium };
};
```

## 📱 Frontend Integration

### Required Dependencies
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "@react-native-async-storage/async-storage": "^1.19.0",
    "react-native-url-polyfill": "^2.0.0"
  }
}
```

### Environment Setup
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Client Configuration
```javascript
// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: { eventsPerSecond: 2 }
  }
});
```

### Database Service Implementation
```javascript
// src/services/database.js
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

  // Food operations
  async saveFoodScan(userId, foodData) {
    const { data, error } = await supabase
      .from('food_scans')
      .insert({
        user_id: userId,
        barcode: foodData.barcode,
        nutrition_data: foodData.nutrition,
        growth_score: foodData.growthScore
      });
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
}

export const databaseService = new DatabaseService();
```

### Main App Authentication Integration
```javascript
// src/screens/MainApp.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function MainApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthScreen onLoginSuccess={() => setUser(user)} />;
  }

  return <AuthenticatedApp user={user} />;
}
```

### Home Screen Data Integration
```javascript
// src/screens/HomeScreen.js
import { databaseService } from '../services/database';

export default function HomeScreen({ user }) {
  const [userData, setUserData] = useState(null);
  const [growthFactors, setGrowthFactors] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchGrowthFactors();
    }
  }, [user]);

  const fetchUserData = async () => {
    const { data, error } = await databaseService.fetchUserProfile(user.id);
    if (!error) setUserData(data);
  };

  const fetchGrowthFactors = async () => {
    const { data: habitLogs } = await databaseService.fetchHabitLogs(user.id);
    const factors = calculateGrowthFactors(habitLogs);
    setGrowthFactors(factors);
  };

  // Real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel('habit-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'habit_logs',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchGrowthFactors();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [user]);

  // Rest of component...
}
```

### Food Scanner Backend Integration
```javascript
// src/components/Nutrition/FoodScanner.js
import { databaseService } from '../../services/database';

export default function FoodScanner({ user }) {
  const lookupFoodData = async (barcode) => {
    setLoading(true);
    try {
      // Fetch from Open Food Facts
      const response = await fetch(`https://api.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        const nutrition = extractNutrition(product.nutriments);
        const growthScore = calculateGrowthScore(nutrition);

        const foodData = {
          name: product.product_name,
          brand: product.brands,
          nutrition,
          growthScore,
          barcode: barcode
        };

        // Save to backend
        if (user) {
          await databaseService.saveFoodScan(user.id, foodData);
        }

        setScanResult(foodData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
}
```

## 🚀 Implementation Phases

### Phase 1: Backend Foundation (Week 1)
- [ ] Create Supabase project
- [ ] Set up database schema
- [ ] Configure authentication
- [ ] Set up file storage
- [ ] Create basic API endpoints

### Phase 2: Core Features (Week 2)
- [ ] Implement habit tracking system
- [ ] Build exercise library
- [ ] Add food scanning functionality
- [ ] Set up real-time updates
- [ ] Create community features

### Phase 3: AI Integration (Week 3)
- [ ] Set up OpenAI integration
- [ ] Implement height prediction
- [ ] Build daily tips system
- [ ] Add chat helper
- [ ] Create content moderation

### Phase 4: Frontend Integration (Week 4)
- [ ] Install required dependencies
- [ ] Update authentication service
- [ ] Integrate database service
- [ ] Connect all screens to backend
- [ ] Add real-time updates
- [ ] Implement error handling

### Phase 5: Premium Features (Week 5)
- [ ] Set up RevenueCat
- [ ] Implement premium gating
- [ ] Add subscription management
- [ ] Create premium content
- [ ] Set up analytics

### Phase 6: Testing & Optimization (Week 6)
- [ ] Test all features
- [ ] Optimize performance
- [ ] Add error handling
- [ ] Set up monitoring
- [ ] Deploy to production

## 💰 Cost Estimation

### Development Phase (First 6 months)
- **Supabase Pro**: $25/month
- **OpenAI API**: $100-300/month
- **RevenueCat**: Free (under $10K revenue)
- **Total**: $125-325/month

### Growth Phase (6-12 months)
- **Supabase Pro**: $25/month
- **OpenAI API**: $300-800/month
- **RevenueCat**: 1% of revenue
- **CDN/Storage**: $50-100/month
- **Total**: $375-925/month + 1% revenue

## 🔒 Security & Performance

### Security Features
- Row Level Security (RLS) on all tables
- JWT token authentication
- Input validation and sanitization
- Rate limiting on API endpoints
- Content moderation for community features

### Performance Targets
- API response time: <200ms
- Database queries: <100ms
- Real-time updates: <100ms latency
- Uptime: 99.9%

## ✅ Deliverables

### Backend Deliverables
1. **Complete Supabase Project** with all tables and relationships
2. **Authentication System** with email, Google, and Apple sign-in
3. **API Endpoints** for all app functionality
4. **AI Integration** with height prediction and daily tips
5. **Real-time Features** with WebSocket connections
6. **Premium System** with RevenueCat integration
7. **File Storage** for user uploads and media
8. **Security Implementation** with RLS and validation

### Frontend Integration Deliverables
1. **Updated Services** with real Supabase integration
2. **Authentication Flow** with proper state management
3. **Data Integration** replacing all mock data
4. **Real-time Updates** for live data synchronization
5. **Error Handling** with proper loading states
6. **Offline Support** with data caching
7. **Premium Features** with proper gating
8. **Testing** with comprehensive test coverage

## 🎯 Success Criteria

- [ ] Complete backend with all features working
- [ ] Frontend fully integrated with backend
- [ ] Authentication working properly
- [ ] Real-time updates functioning
- [ ] AI features operational
- [ ] Premium system working
- [ ] All existing UI/UX preserved
- [ ] Performance targets met
- [ ] Security requirements satisfied
- [ ] Ready for production deployment

## 📝 Final Notes

This is a comprehensive full-stack implementation that requires:
1. **Backend Development**: Complete Supabase setup with all features
2. **Frontend Integration**: Connecting existing React Native app to backend
3. **AI Integration**: OpenAI GPT-4 for height predictions and chat
4. **Premium Features**: RevenueCat subscription management
5. **Real-time Features**: Live updates and synchronization
6. **Security**: Proper authentication and data protection

The goal is to create a production-ready height optimization app that combines the existing beautiful frontend with a robust, scalable backend system.

**IMPORTANT**: Maintain all existing UI/UX design and functionality while adding backend integration. The frontend should work exactly as before, but with real data instead of mock data.
