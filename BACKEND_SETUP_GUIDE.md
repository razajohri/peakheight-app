# PeakHeight Backend Setup Guide

## 🚀 Complete Backend Implementation

This guide will help you set up the complete backend infrastructure for PeakHeight, including database, authentication, AI integration, and premium features.

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **OpenAI API Key**: Get your API key from [platform.openai.com](https://platform.openai.com)
3. **Google Cloud Vision API**: For food scanning (optional)
4. **RevenueCat Account**: For premium subscriptions (optional)

## 🗄️ Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Set a strong database password
4. Wait for the project to be created

### Step 2: Run Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `database/schema.sql`
3. Paste and run the SQL script
4. Verify all tables are created successfully

### Step 3: Configure Row Level Security

The schema includes RLS policies, but you may need to verify they're active:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## 🔐 Authentication Setup

### Step 1: Configure Auth Providers

In your Supabase dashboard, go to Authentication > Providers:

1. **Email/Password**: Enable (default)
2. **Google OAuth**: 
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL: `peakheight://auth/callback`
3. **Apple Sign-In**:
   - Enable Apple provider (iOS only)
   - Add your Apple OAuth credentials
   - Set redirect URL: `peakheight://auth/callback`

### Step 2: Configure Auth Settings

```sql
-- Update auth settings
UPDATE auth.users SET 
  email_confirm = false,
  phone_confirm = false
WHERE true;
```

## 🤖 AI Integration Setup

### Step 1: OpenAI Configuration

1. Get your OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Add it to your environment variables:

```bash
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### Step 2: Test AI Integration

```javascript
import { AIService } from './src/services/aiService';

// Test height prediction
const result = await AIService.generateHeightPrediction('user_id', {
  age: 18,
  currentHeight: 170,
  targetHeight: 180,
  gender: 'male',
  // ... other data
});
```

## 💰 Premium Features Setup

### Step 1: RevenueCat Integration

1. Create account at [revenuecat.com](https://revenuecat.com)
2. Create your app and products
3. Add your API key to environment variables:

```bash
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_api_key_here
```

### Step 2: Configure Subscription Plans

The database includes default plans, but you can customize them:

```sql
-- Update subscription plans
UPDATE subscription_plans 
SET price = 9.99, features = '["unlimited_ai", "advanced_analytics"]'
WHERE id = 'monthly';
```

## 📱 Frontend Integration

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# Google Vision API (optional)
EXPO_PUBLIC_GOOGLE_VISION_API_KEY=your_google_vision_api_key

# RevenueCat Configuration
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_api_key

# Analytics (optional)
EXPO_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
```

### Step 3: Update Supabase Configuration

Update `src/config/supabase.js` with your actual Supabase URL and key:

```javascript
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';
```

## 🔄 Real-time Features

### Step 1: Enable Real-time

In your Supabase dashboard:
1. Go to Database > Replication
2. Enable real-time for the following tables:
   - `habit_logs`
   - `streaks`
   - `posts`
   - `comments`
   - `user_badges`
   - `ai_insights`

### Step 2: Test Real-time Connection

```javascript
import { RealtimeService } from './src/services/realtimeService';

// Subscribe to habit updates
const subscription = RealtimeService.subscribeToHabitUpdates('user_id', (payload) => {
  console.log('Habit update:', payload);
});
```

## 📊 Analytics Setup

### Step 1: Mixpanel Integration (Optional)

1. Create account at [mixpanel.com](https://mixpanel.com)
2. Get your project token
3. Add to environment variables:

```bash
EXPO_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
```

### Step 2: Configure Analytics

```javascript
import { Analytics } from './src/services/analyticsService';

// Track user events
Analytics.track('habit_logged', {
  habit_type: 'sleep',
  value: 8,
  user_id: 'user_id'
});
```

## 🔒 Security Configuration

### Step 1: API Security

1. **Rate Limiting**: Configured in the database schema
2. **Content Moderation**: Uses OpenAI moderation API
3. **Data Encryption**: Handled by Supabase
4. **Access Control**: Row Level Security policies

### Step 2: Content Moderation

```javascript
import { AIService } from './src/services/aiService';

// Moderate community content
const result = await AIService.moderateContent('User post content');
if (result.result.flagged) {
  // Handle flagged content
}
```

## 🚀 Deployment

### Step 1: Production Environment

1. Create production Supabase project
2. Update environment variables for production
3. Configure production auth providers
4. Set up monitoring and alerts

### Step 2: Performance Optimization

1. **Database Indexes**: Already included in schema
2. **CDN**: Supabase handles this automatically
3. **Caching**: Implement Redis for frequently accessed data
4. **Monitoring**: Set up Supabase monitoring

## 📈 Monitoring & Maintenance

### Step 1: Set Up Monitoring

1. **Supabase Dashboard**: Monitor database performance
2. **Error Tracking**: Implement Sentry or similar
3. **Analytics**: Track user behavior and app performance
4. **Uptime Monitoring**: Use services like UptimeRobot

### Step 2: Regular Maintenance

1. **Database Optimization**: Weekly query performance review
2. **Security Updates**: Monthly security patches
3. **Backup Verification**: Weekly backup tests
4. **Performance Monitoring**: Daily metrics review

## 🧪 Testing

### Step 1: Unit Tests

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native

# Run tests
npm test
```

### Step 2: Integration Tests

```javascript
// Test database operations
import { DatabaseService } from './src/services/database';

const result = await DatabaseService.logHabit('user_id', 'sleep', 8);
expect(result.error).toBeNull();
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout
- `POST /auth/reset-password` - Password reset

### Habit Tracking

- `POST /habits/log` - Log a habit
- `GET /habits/logs` - Get habit logs
- `GET /habits/streaks` - Get user streaks

### Community Features

- `POST /posts` - Create a post
- `GET /posts` - Get community posts
- `POST /posts/:id/like` - Like/unlike a post
- `POST /posts/:id/comments` - Add comment

### AI Features

- `POST /ai/height-prediction` - Generate height prediction
- `POST /ai/daily-tip` - Generate daily tip
- `POST /ai/progress-analysis` - Analyze progress

## 🆘 Troubleshooting

### Common Issues

1. **Authentication Errors**: Check Supabase configuration
2. **Database Connection**: Verify RLS policies
3. **AI API Errors**: Check OpenAI API key and rate limits
4. **Real-time Issues**: Verify table replication settings

### Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **RevenueCat Docs**: [docs.revenuecat.com](https://docs.revenuecat.com)

## ✅ Checklist

- [ ] Supabase project created and configured
- [ ] Database schema deployed
- [ ] Authentication providers configured
- [ ] OpenAI API key added
- [ ] Environment variables configured
- [ ] Real-time features enabled
- [ ] Premium features configured
- [ ] Security policies verified
- [ ] Monitoring set up
- [ ] Testing completed

## 🎉 You're Ready!

Your PeakHeight backend is now fully configured and ready for production use. The system includes:

- ✅ Complete database with all tables and relationships
- ✅ Secure authentication with multiple providers
- ✅ AI-powered height predictions and insights
- ✅ Real-time updates and notifications
- ✅ Premium subscription management
- ✅ Community features with moderation
- ✅ Comprehensive security and rate limiting
- ✅ Scalable architecture for millions of users

Start building amazing height growth experiences! 🚀
