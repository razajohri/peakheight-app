# PeakHeight Backend Implementation Plan

## 📋 Overview

This document outlines the complete backend architecture and implementation strategy for the PeakHeight mobile app. The backend will support user authentication, habit tracking, exercise library, nutrition scanning, community features, AI-powered insights, and premium subscriptions.

## 🏗️ Architecture Decision

**Primary Choice: Supabase (Backend-as-a-Service)**
- **Rationale**: Fastest time-to-market, comprehensive features, excellent React Native integration
- **Alternative**: Firebase (if Google ecosystem preference)
- **Fallback**: Custom Node.js backend (for maximum control)

## 🎯 Core Backend Components

### 1. Database Layer (PostgreSQL via Supabase)

#### 1.1 User Management
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
  reminder_times JSONB, -- {"sleep": "22:00", "exercise": "18:00"}
  units TEXT DEFAULT 'metric', -- metric or imperial
  privacy_level TEXT DEFAULT 'friends', -- public, friends, private
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 1.2 Habit Tracking System
```sql
-- Habit types configuration
CREATE TABLE habit_types (
  id TEXT PRIMARY KEY, -- 'sleep', 'exercise', 'nutrition', etc.
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

#### 1.3 Exercise System
```sql
-- Exercise categories
CREATE TABLE exercise_categories (
  id TEXT PRIMARY KEY, -- 'posture', 'stretching', 'strength'
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

#### 1.4 Nutrition & Food Scanning
```sql
-- Food database (cached from Open Food Facts)
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode TEXT UNIQUE,
  name TEXT NOT NULL,
  brand TEXT,
  nutrition_data JSONB, -- Complete nutrition facts
  growth_score INTEGER, -- Our calculated score
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

-- Meal logs
CREATE TABLE meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  food_item_id UUID REFERENCES food_items(id),
  quantity DECIMAL,
  unit TEXT,
  meal_type TEXT,
  logged_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);
```

#### 1.5 Community Features
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

-- Post likes
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- User follows
CREATE TABLE user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);
```

#### 1.6 Gamification System
```sql
-- Badge definitions
CREATE TABLE badge_definitions (
  id TEXT PRIMARY KEY, -- 'sleep_master', 'streak_king', etc.
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

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT CHECK (challenge_type IN ('streak', 'total', 'frequency')),
  target_value DECIMAL,
  target_unit TEXT,
  start_date DATE,
  end_date DATE,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Challenge participants
CREATE TABLE challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  progress JSONB,
  completed_at TIMESTAMP,
  UNIQUE(challenge_id, user_id)
);
```

#### 1.7 AI & Analytics
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

-- User analytics
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Authentication System

#### 2.1 Authentication Methods
- **Email/Password**: Standard registration and login
- **Google OAuth**: One-tap Google sign-in
- **Apple Sign-In**: iOS native authentication
- **Phone Number**: SMS-based authentication (future)

#### 2.2 Session Management
- JWT tokens with refresh mechanism
- Secure token storage in AsyncStorage
- Automatic token refresh
- Session persistence across app restarts

#### 2.3 Security Features
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Email verification for new accounts
- Password reset functionality
- Account lockout after failed attempts

### 3. Real-time Features

#### 3.1 Live Updates
- Habit logging sync across devices
- Community post updates
- Streak notifications
- Challenge progress updates
- AI chat responses

#### 3.2 WebSocket Implementation
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

### 4. AI Integration

#### 4.1 Height Prediction System
- **Input Data**: User demographics, habits, parent heights
- **Model**: GPT-4 with custom prompts
- **Output**: Height prediction with confidence interval
- **Update Frequency**: Weekly recalculations

#### 4.2 Daily Tips Engine
- **Personalization**: Based on user habits and progress
- **Content Types**: Exercise tips, nutrition advice, motivation
- **Delivery**: Push notifications and in-app display
- **A/B Testing**: Different tip formats and timing

#### 4.3 Chat Helper
- **Model**: GPT-4 with custom system prompts
- **Context**: User's current habits, goals, and progress
- **Features**: Habit suggestions, exercise recommendations, motivation
- **Rate Limiting**: 50 messages/day for free users, unlimited for premium

#### 4.4 Content Moderation
- **Automated Screening**: OpenAI moderation API
- **Community Guidelines**: Height growth focus, positive content
- **Manual Review**: Flagged content review process
- **User Reporting**: Report inappropriate content

### 5. File Storage & Media

#### 5.1 Storage Structure
```
supabase-storage/
├── user-uploads/
│   ├── avatars/
│   ├── posture-photos/
│   └── progress-photos/
├── exercise-media/
│   ├── videos/
│   ├── images/
│   └── gifs/
└── community/
    ├── post-images/
    └── challenge-media/
```

#### 5.2 CDN Integration
- Supabase Storage with global CDN
- Image optimization and resizing
- Video compression and streaming
- Signed URLs for secure access

### 6. Premium Features & Monetization

#### 6.1 RevenueCat Integration
- **Subscription Plans**: Monthly ($9.99), Yearly ($79.99)
- **Free Trial**: 7-day free trial
- **Feature Gating**: Server-side validation
- **Analytics**: Revenue tracking and user segmentation

#### 6.2 Premium Features
- Advanced AI insights and predictions
- Custom exercise plans
- Detailed progress analytics
- Priority community features
- Ad-free experience
- Early access to new features

### 7. Push Notifications

#### 7.1 Notification Types
- **Habit Reminders**: Customizable timing
- **Streak Milestones**: Achievement celebrations
- **Daily Tips**: AI-generated insights
- **Community**: Likes, comments, follows
- **Challenges**: New challenges and progress updates

#### 7.2 Implementation
- Expo Push Notifications
- User preference management
- Smart timing based on user behavior
- A/B testing for notification content

### 8. Analytics & Monitoring

#### 8.1 User Analytics
- **Events**: App opens, feature usage, conversion funnels
- **Metrics**: DAU, MAU, retention, engagement
- **Tools**: Mixpanel or Amplitude integration
- **Privacy**: GDPR-compliant data collection

#### 8.2 Performance Monitoring
- **Error Tracking**: Sentry integration
- **Performance**: App startup time, API response times
- **Database**: Query performance and optimization
- **Uptime**: Service availability monitoring

## 🚀 Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up Supabase project
- [ ] Create database schema
- [ ] Implement basic authentication
- [ ] Set up file storage
- [ ] Basic habit logging

### Phase 2: Core Features (Weeks 3-4)
- [ ] Complete habit tracking system
- [ ] Exercise library integration
- [ ] Food scanning with database storage
- [ ] Real-time updates
- [ ] Basic community features

### Phase 3: AI & Premium (Weeks 5-6)
- [ ] AI height prediction
- [ ] Daily tips system
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

### Scale Phase (12+ months)
- **Supabase Pro**: $25/month
- **OpenAI API**: $800-2000/month
- **RevenueCat**: 1% of revenue
- **CDN/Storage**: $100-300/month
- **Monitoring**: $50-100/month
- **Total**: $975-2425/month + 1% revenue

## 🔒 Security Considerations

### Data Protection
- **Encryption**: All data encrypted at rest and in transit
- **Access Control**: Row Level Security (RLS) on all tables
- **API Security**: Rate limiting and input validation
- **Privacy**: GDPR compliance and data anonymization

### Authentication Security
- **Password Security**: bcrypt hashing with salt
- **Token Management**: Secure JWT with short expiration
- **Session Security**: Automatic logout on suspicious activity
- **OAuth Security**: Secure redirect URLs and state validation

### Content Security
- **Input Sanitization**: All user inputs sanitized
- **File Upload Security**: Virus scanning and type validation
- **Content Moderation**: AI + human review process
- **Rate Limiting**: Prevent spam and abuse

## 📊 Performance Targets

### Response Times
- **API Endpoints**: < 200ms for 95% of requests
- **Database Queries**: < 100ms for simple queries
- **File Uploads**: < 5 seconds for images
- **Real-time Updates**: < 100ms latency

### Scalability
- **Concurrent Users**: Support 10,000+ simultaneous users
- **Database**: Handle 1M+ records per table
- **Storage**: Support 100GB+ of user uploads
- **API Rate Limits**: 1000 requests/minute per user

### Availability
- **Uptime**: 99.9% availability target
- **Backup**: Daily automated backups
- **Recovery**: < 1 hour RTO, < 4 hours RPO
- **Monitoring**: 24/7 system monitoring

## 🛠️ Development Tools

### Backend Development
- **Supabase CLI**: Database migrations and local development
- **Postman**: API testing and documentation
- **pgAdmin**: Database management and queries
- **Git**: Version control and collaboration

### Monitoring & Analytics
- **Supabase Dashboard**: Real-time metrics and logs
- **Sentry**: Error tracking and performance monitoring
- **Mixpanel**: User analytics and funnel tracking
- **RevenueCat Dashboard**: Subscription analytics

### Testing
- **Jest**: Unit testing for Edge Functions
- **Cypress**: End-to-end testing
- **Load Testing**: Artillery or k6 for performance testing
- **Security Testing**: OWASP ZAP for vulnerability scanning

## 📝 Next Steps

1. **Create Supabase Project**: Set up the backend infrastructure
2. **Database Schema**: Implement the complete database structure
3. **Authentication**: Set up user registration and login
4. **API Development**: Build the core API endpoints
5. **Frontend Integration**: Connect React Native app to backend
6. **Testing**: Comprehensive testing of all features
7. **Deployment**: Production deployment and monitoring setup

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

---

This comprehensive backend plan provides a solid foundation for building a scalable, secure, and feature-rich height optimization app. The phased approach ensures rapid development while maintaining quality and security standards.
