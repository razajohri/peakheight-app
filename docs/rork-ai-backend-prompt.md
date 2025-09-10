# Rork AI Backend Implementation Prompt

## 🎯 Project Overview

You are tasked with implementing a complete backend system for **PeakHeight**, a mobile app focused on helping users maximize their natural height potential through science-backed habits, exercises, and nutrition.

### App Concept
PeakHeight is a comprehensive height optimization platform that combines:
- **Habit Tracking**: Sleep, nutrition, exercise, posture monitoring
- **Exercise Library**: Height-specific stretches, posture corrections, strength training
- **Nutrition Scanner**: Barcode scanning for growth-focused nutrition analysis
- **AI-Powered Insights**: Height predictions, personalized tips
- **Community Features**: Progress sharing, challenges, motivation
- **Gamification**: Streaks, badges, achievements, leaderboards

### Target Users
- **Primary**: Teens and young adults (13-25) wanting to maximize height
- **Secondary**: Parents helping their children reach full height potential
- **Geographic**: Global market with focus on English-speaking countries

## 🏗️ Technical Stack & Architecture

### Frontend (Already Built)
- **Framework**: React Native with Expo
- **Navigation**: Custom tab-based navigation system
- **UI Components**: Custom components with brand aesthetics
- **State Management**: React hooks and local state
- **Styling**: StyleSheet with consistent brand colors and typography

### Backend Requirements
- **Primary Choice**: Supabase (Backend-as-a-Service)
- **Database**: PostgreSQL via Supabase
- **Authentication**: Email/password, Google OAuth, Apple Sign-In
- **Storage**: File storage for user uploads, exercise media
- **Real-time**: WebSocket connections for live updates
- **AI Integration**: OpenAI GPT-4 for height predictions and chat
- **Monetization**: RevenueCat for premium subscriptions

### Current Frontend Features (Already Implemented)
1. **Onboarding Flow**: 19-step user onboarding with height, age, goals, barriers
2. **Home Dashboard**: Height potential blob, growth factors, progress tracking
3. **Exercise Hub**: Train/Physical/Nutrition tabs with exercise library
4. **Food Scanner**:
   - Barcode scanning with Open Food Facts (OFF) API integration
   - Google Vision photo recognition (label/web detection) → OFF name search fallback for real nutriments
5. **Progress Tracking**: Today's activities, habit logging, streak counters
6. **Community**: Tribe page with posts, comments, challenges
7. **Profile**: User settings, subscription management

### Frontend Integration Requirements

**IMPORTANT**: The frontend is already built and functional. Rork AI needs to:

1. **Replace Mock Data**: Update existing components to use real backend data
2. **Add Authentication**: Integrate Supabase auth with existing screens
3. **Connect APIs**: Replace local data with backend API calls
4. **Add Real-time Updates**: Implement live data synchronization
5. **Handle Loading States**: Add proper loading and error handling
6. **Implement Offline Support**: Cache data for offline usage

### Specific Frontend Changes Needed

#### 1. Authentication Integration
**Current State**: No authentication system
**Changes Needed**:
- Add Supabase auth to `src/services/auth.js`
- Update `src/screens/AuthScreen.js` to use real authentication
- Add auth state management to `src/screens/MainApp.js`
- Protect routes based on authentication status

#### 2. Home Dashboard Data Integration
**Current State**: Uses mock data for height potential and growth factors
**Files to Update**:
- `src/screens/HomeScreen.js` - Replace mock data with real user data
- `src/components/Home/AICoachWidget.js` - Connect to backend AI insights
**Changes Needed**:
- Fetch real user height data from backend
- Calculate actual growth factors from habit logs
- Connect AI coach to backend insights system
- Implement real-time updates for progress

#### 3. Exercise Library Backend Integration
**Current State**: Uses local data from `src/utils/exercisesData.js`
**Files to Update**:
- `src/screens/ExercisesScreen.js` - Connect to backend exercise API
- `src/utils/exercisesData.js` - Replace with API calls
**Changes Needed**:
- Fetch exercises from backend database
- Implement exercise completion tracking
- Add user progress tracking
- Connect to premium content gating

#### 4. Food Scanner Backend Integration
**Current State (Updated)**:
- Barcode lookup uses Open Food Facts by barcode
- Photo recognition uses Google Vision (LABEL_DETECTION + WEB_DETECTION) to get top food name(s)
- We then query Open Food Facts by name; if found, we use OFF nutriments; else we fall back to a local estimate
**Files Updated in Frontend**:
- `src/screens/ExercisesScreen.js` (Google Vision + OFF name search fallback wired)
- `src/utils/nutritionDatabase.js` (local estimates + growth-score helpers)
- `src/config/apiKeys.js` (GOOGLE_VISION_API_KEY and OFF base URL)
**Files to Update**:
- `src/components/Nutrition/FoodScanner.js` - Store scans in backend
- `src/screens/ExercisesScreen.js` - Connect nutrition data to backend
**Changes Needed**:
- Store food scans in backend database (barcode scans and photo recognitions)
- Persist source (barcode/off_name/local_estimate), raw API payload (for audit), and resolved nutriments
- Track user nutrition history (date, meal type, portion size, computed totals)
- Calculate growth scores server-side (mirror the current client heuristic) for consistency
- Implement meal logging functionality and daily/weekly nutrition summaries

#### 4.a Nutrition Scanner Architecture (New)
- Input A (Barcode): OFF by barcode → nutriments → growth score
- Input B (Photo): Google Vision → top-1/3 food names → OFF text search → best nutriments → growth score
- Fallbacks:
  - If OFF text search has no match: use local class-based estimates (from frontend now; replicate server-side)
  - If no confident Vision label: prompt user to re-capture or add custom food
- Portion handling: user-specified grams/servings; server computes totals from per-100g values

#### 5. Habit Tracking Integration
**Current State**: No persistent habit tracking
**Files to Update**:
- `src/screens/ProgressScreen.js` - Connect to backend habit logs
- `src/screens/HomeScreen.js` - Update growth factors from real data
**Changes Needed**:
- Implement habit logging API calls
- Add streak calculation from backend
- Connect progress tracking to real data
- Implement habit reminders

#### 6. Community Features Integration
**Current State**: Mock community data
**Files to Update**:
- `src/screens/ProfileScreen.js` - Connect to backend community API
**Changes Needed**:
- Fetch real community posts
- Implement post creation and commenting
- Add user following system
- Connect to moderation system

#### 7. Profile and Settings Integration
**Current State**: No backend user management
**Files to Update**:
- `src/screens/ProfileScreen.js` - Connect to backend user API
**Changes Needed**:
- Fetch real user profile data
- Implement profile updates
- Connect to subscription management
- Add user preferences

### Frontend Code Structure to Modify

#### 1. Services Layer Updates
**File**: `src/services/supabase.js`
**Current State**: Placeholder implementation
**Changes Needed**:
```javascript
// Replace placeholder with real Supabase client
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
});
```

#### 2. Authentication Service Updates
**File**: `src/services/auth.js`
**Current State**: Mock implementation
**Changes Needed**:
```javascript
// Replace mock functions with real Supabase auth
export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};
```

#### 3. Database Service Updates
**File**: `src/services/database.js`
**Current State**: Placeholder implementation
**Changes Needed**:
```javascript
// Add real database operations
export const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const logHabit = async (userId, habitType, value) => {
  const { data, error } = await supabase
    .from('habit_logs')
    .insert({
      user_id: userId,
      habit_type: habitType,
      value: value,
      logged_at: new Date().toISOString()
    });
  return { data, error };
};
```

#### 4. Main App Navigation Updates
**File**: `src/screens/MainApp.js`
**Current State**: Simple tab navigation
**Changes Needed**:
```javascript
// Add authentication state management
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
```

#### 5. Home Screen Data Integration
**File**: `src/screens/HomeScreen.js`
**Current State**: Uses mock data
**Changes Needed**:
```javascript
// Replace mock data with real API calls
const [userData, setUserData] = useState(null);
const [growthFactors, setGrowthFactors] = useState([]);

useEffect(() => {
  if (user) {
    fetchUserData();
    fetchGrowthFactors();
  }
}, [user]);

const fetchUserData = async () => {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  setUserData(data);
};
```

#### 6. Exercise Screen Backend Integration
**File**: `src/screens/ExercisesScreen.js`
**Current State**: Uses local exercise data
**Changes Needed**:
```javascript
// Replace local data with backend API
const [exercises, setExercises] = useState([]);

useEffect(() => {
  fetchExercises();
}, []);

const fetchExercises = async () => {
  const { data } = await supabase
    .from('exercises')
    .select('*')
    .eq('is_active', true);
  setExercises(data || []);
};
```

#### 7. Food Scanner Backend Integration
**File**: `src/components/Nutrition/FoodScanner.js`
**Current State**: Only uses Open Food Facts API
**Changes Needed**:
```javascript
// Add backend storage for food scans
const saveFoodScan = async (foodData) => {
  const { data, error } = await supabase
    .from('food_scans')
    .insert({
      user_id: user.id,
      barcode: foodData.barcode,
      nutrition_data: foodData.nutrition,
      growth_score: foodData.growthScore
    });

  if (!error) {
    // Update UI with saved scan
    setScanResult(foodData);
  }
};
```

### Required Dependencies to Add

**Package.json additions needed**:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "@react-native-async-storage/async-storage": "^1.19.0",
    "react-native-url-polyfill": "^2.0.0",
    "react-native-image-picker": "^7.1.2"
  }
}
```

Also add a small config shim on the frontend:
- `src/config/apiKeys.js` with `GOOGLE_VISION_API_KEY` and OFF base URL (OFF does not require a key).

Backend should maintain secure storage for any server-side keys used (if Vision is proxied via backend later).

### Environment Variables Setup

**Create `.env` file**:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Real-time Updates Implementation

**Add to components that need live updates**:
```javascript
// Real-time habit updates
useEffect(() => {
  const subscription = supabase
    .channel('habit-updates')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'habit_logs',
      filter: `user_id=eq.${user.id}`
    }, (payload) => {
      // Update UI with new habit log
      updateHabitDisplay(payload.new);
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, [user]);
```

### Error Handling and Loading States

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
  } finally {
    setLoading(false);
  }
};
```

## 📊 Database Schema Requirements

### Core Tables Needed

#### 1. User Management
```sql
-- Users table with comprehensive profile data
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
```

#### 2. Habit Tracking System
```sql
-- Habit types configuration
CREATE TABLE habit_types (
  id TEXT PRIMARY KEY, -- 'sleep', 'exercise', 'nutrition', 'posture', 'hydration'
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

#### 3. Exercise System
```sql
-- Exercise categories
CREATE TABLE exercise_categories (
  id TEXT PRIMARY KEY, -- 'posture', 'stretching', 'strength', 'masai-jump'
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
```

#### 4. Nutrition & Food Scanning
```sql
-- Food database (cached from Open Food Facts)
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode TEXT UNIQUE,
  name TEXT NOT NULL,
  brand TEXT,
  nutrition_data JSONB, -- Complete nutrition facts
  growth_score INTEGER, -- Our calculated score (0-100)
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

#### 5. Community Features
```sql
-- Community posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT CHECK (post_type IN ('progress', 'question', 'tip', 'motivation')),
  image_urls TEXT[],
  height_data JSONB, -- For progress posts
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
  parent_comment_id UUID REFERENCES comments(id), -- For replies
  likes_count INTEGER DEFAULT 0,
  is_moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. Gamification System
```sql
-- Badge definitions
CREATE TABLE badge_definitions (
  id TEXT PRIMARY KEY, -- 'sleep_master', 'streak_king', 'height_hero'
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  criteria JSONB, -- Conditions to earn badge
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

#### 7. AI & Analytics
```sql
-- AI predictions and insights
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  insight_type TEXT CHECK (insight_type IN ('height_prediction', 'daily_tip', 'progress_analysis')),
  content TEXT NOT NULL,
  data JSONB, -- Supporting data
  confidence_score DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Authentication Requirements

### Authentication Methods
1. **Email/Password**: Standard registration and login
2. **Google OAuth**: One-tap Google sign-in
3. **Apple Sign-In**: iOS native authentication
4. **Phone Number**: SMS-based authentication (future feature)

### Security Features
- Password hashing with bcrypt
- JWT tokens with refresh mechanism
- Rate limiting on auth endpoints
- Email verification for new accounts
- Password reset functionality
- Account lockout after failed attempts
- Session persistence across app restarts

## ⚡ Real-time Features

### Live Updates Needed
- Habit logging sync across devices
- Community post updates
- Streak notifications
- Challenge progress updates
- AI insights updates
- Real-time height potential updates

### WebSocket Implementation
```javascript
// Example real-time habit updates
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

## 🤖 AI Integration Requirements

### 1. Height Prediction System
- **Input Data**: User demographics, habits, parent heights, current progress
- **Model**: GPT-4 with custom prompts
- **Output**: Height prediction with confidence interval
- **Update Frequency**: Weekly recalculations
- **Personalization**: Based on user's specific habits and genetics

### 2. Daily Tips Engine
- **Personalization**: Based on user habits, progress, and goals
- **Content Types**: Exercise tips, nutrition advice, motivation, sleep optimization
- **Delivery**: Push notifications and in-app display
- **A/B Testing**: Different tip formats and timing


### 4. Content Moderation
- **Automated Screening**: OpenAI moderation API
- **Community Guidelines**: Height growth focus, positive content, no medical advice
- **Manual Review**: Flagged content review process
- **User Reporting**: Report inappropriate content

## 💰 Premium Features & Monetization

### Subscription Plans
- **Monthly**: $9.99/month
- **Yearly**: $79.99/year (33% savings)
- **Free Trial**: 7-day free trial
- **Student Discount**: 50% off for verified students

### Premium Features
- Advanced AI insights and height predictions
- Custom exercise plans and routines
- Detailed progress analytics and reports
- Priority community features and early access
- Ad-free experience
- Unlimited AI insights
- Advanced habit tracking and analytics
- Personalized meal plans
- Expert Q&A sessions

### RevenueCat Integration
- Subscription management
- Feature gating
- Analytics and revenue tracking
- Cross-platform subscription sync
- Promotional offers and discounts

## 📱 Push Notifications

### Notification Types
- **Habit Reminders**: Customizable timing for each habit
- **Streak Milestones**: Achievement celebrations and motivation
- **Daily Tips**: AI-generated personalized insights
- **Community**: Likes, comments, follows, mentions
- **Challenges**: New challenges and progress updates
- **Premium**: Subscription reminders and exclusive content

### Smart Features
- User preference management
- Optimal timing based on user behavior
- A/B testing for notification content
- Frequency capping to avoid spam
- Deep linking to relevant app sections

## 📊 Analytics & Monitoring

### User Analytics
- **Events**: App opens, feature usage, conversion funnels
- **Metrics**: DAU, MAU, retention, engagement, revenue
- **Tools**: Mixpanel or Amplitude integration
- **Privacy**: GDPR-compliant data collection

### Performance Monitoring
- **Error Tracking**: Sentry integration
- **Performance**: App startup time, API response times
- **Database**: Query performance and optimization
- **Uptime**: Service availability monitoring

## 🔒 Security & Compliance

### Data Protection
- **Encryption**: All data encrypted at rest and in transit
- **Access Control**: Row Level Security (RLS) on all tables
- **API Security**: Rate limiting and input validation
- **Privacy**: GDPR compliance and data anonymization

### Content Security
- **Input Sanitization**: All user inputs sanitized
- **File Upload Security**: Virus scanning and type validation
- **Content Moderation**: AI + human review process
- **Rate Limiting**: Prevent spam and abuse

## 🚀 Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up Supabase project and configure
- [ ] Create complete database schema
- [ ] Implement authentication system
- [ ] Set up file storage for media
- [ ] Basic habit logging functionality

### Phase 2: Core Features (Weeks 3-4)
- [ ] Complete habit tracking system with streaks
- [ ] Exercise library integration
- [ ] Food scanning with database storage
- [ ] Real-time updates implementation
- [ ] Basic community features

### Phase 3: AI & Premium (Weeks 5-6)
- [ ] AI height prediction system
- [ ] Daily tips engine
- [ ] Chat helper integration
- [ ] Premium subscription setup
- [ ] Advanced analytics

### Phase 4: Community & Gamification (Weeks 7-8)
- [ ] Full community features
- [ ] Badge and achievement system
- [ ] Challenge system
- [ ] Content moderation
- [ ] Push notifications

### Phase 5: Optimization & Scale (Weeks 9-10)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Monitoring and alerting
- [ ] Backup and recovery
- [ ] Load testing

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

## 📋 Specific Implementation Tasks

### 1. Supabase Setup
- Create new Supabase project
- Configure authentication providers
- Set up storage buckets
- Configure Row Level Security policies
- Set up Edge Functions for AI integration

### 2. Database Implementation
- Create all tables with proper relationships
- Set up indexes for performance
- Implement database triggers for streak calculations
- Set up real-time subscriptions
- Create database functions for complex queries

### 3. API Development
- User authentication endpoints
- Habit logging and retrieval
- Exercise library management
- Food scanning and storage
- Community post management
- AI insight generation
- Premium feature gating

### 4. Frontend Integration
- Supabase client configuration
- Authentication flow implementation
- Real-time data synchronization
- Offline data caching
- Error handling and retry logic

### 5. AI Integration
- OpenAI API setup and configuration
- Custom prompts for height prediction
- Daily tips generation system
- Chat helper implementation
- Content moderation pipeline

## 🎯 Success Metrics

### User Engagement
- **Daily Active Users**: Target 70% of registered users
- **Session Duration**: Average 8+ minutes per session
- **Feature Adoption**: 80% of users use habit tracking
- **Retention**: 40% 7-day retention, 20% 30-day retention

### Business Metrics
- **Conversion Rate**: 10% free-to-premium conversion
- **Revenue**: $10K+ monthly recurring revenue by month 6
- **Churn Rate**: <5% monthly churn for premium users
- **Customer Acquisition Cost**: <$20 per user

### Technical Metrics
- **API Response Time**: <200ms for 95% of requests
- **Uptime**: 99.9% availability
- **Error Rate**: <0.1% of requests
- **Database Performance**: <100ms for simple queries

## 🔄 Maintenance & Updates

### Regular Tasks
- **Database Optimization**: Weekly query performance review
- **Security Updates**: Monthly security patches
- **Backup Verification**: Weekly backup restoration tests
- **Performance Monitoring**: Daily performance metrics review

### Feature Updates
- **A/B Testing**: Gradual feature rollouts
- **User Feedback**: Regular user feedback collection
- **Analytics Review**: Monthly analytics and insights review
- **Competitive Analysis**: Quarterly competitive feature analysis

## 📝 Deliverables Expected

### 1. Complete Backend Infrastructure
- Fully functional Supabase project
- All database tables and relationships
- Authentication system
- File storage configuration
- Real-time subscriptions

### 2. API Endpoints
- User management APIs
- Habit tracking APIs
- Exercise library APIs
- Food scanning APIs
- Community APIs
- AI integration APIs

### 3. Documentation
- API documentation
- Database schema documentation
- Deployment guide
- Security guidelines
- Monitoring setup guide

### 4. Testing
- Unit tests for all functions
- Integration tests for APIs
- Load testing results
- Security testing report

## 🚨 Critical Requirements

### Must-Have Features
- User authentication and profile management
- Habit tracking with streak calculations
- Exercise library with categories
- Food scanning with nutrition analysis
- Real-time data synchronization
- Basic community features
- AI height prediction
- Premium subscription system

### Performance Requirements
- Support 10,000+ concurrent users
- Handle 1M+ database records
- <200ms API response times
- 99.9% uptime
- Real-time updates with <100ms latency

### Security Requirements
- GDPR compliance
- Data encryption at rest and in transit
- Secure authentication
- Content moderation
- Rate limiting and abuse prevention

## 🎯 Final Notes

This is a comprehensive height optimization app that requires a robust, scalable backend. The focus should be on:

1. **User Experience**: Fast, reliable, and intuitive
2. **Data Accuracy**: Precise habit tracking and height predictions
3. **Community**: Engaging social features for motivation
4. **AI Integration**: Smart, personalized insights
5. **Monetization**: Sustainable premium features
6. **Scalability**: Ready for rapid user growth

The backend should be built with the understanding that this app will grow from hundreds to potentially millions of users, so architecture decisions should prioritize scalability, performance, and maintainability.

Please implement this backend system following the phases outlined above, ensuring all security, performance, and feature requirements are met. The frontend is already built and ready for integration, so focus on creating a backend that seamlessly supports all the existing frontend functionality while adding the new features outlined in this prompt.
