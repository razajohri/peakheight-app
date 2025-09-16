-- Gamification System Tables
-- This migration adds tables for points, challenges, and achievements

-- =============================================
-- 1. POINTS SYSTEM
-- =============================================

-- User points and level tracking
CREATE TABLE user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  points_in_current_level INTEGER DEFAULT 0,
  points_needed_for_next_level INTEGER DEFAULT 1000,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Points transaction history
CREATE TABLE points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'TASK_COMPLETED', 'DAY_COMPLETED', 'CHALLENGE_COMPLETED', etc.
  points_awarded INTEGER NOT NULL,
  total_after_transaction INTEGER NOT NULL,
  metadata JSONB, -- Additional data about the action
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 2. DAILY CHALLENGES SYSTEM
-- =============================================

-- Challenge templates
CREATE TABLE challenge_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id TEXT UNIQUE NOT NULL, -- 'early_bird', 'streak_master', etc.
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER NOT NULL,
  category TEXT NOT NULL, -- 'timing', 'completion', 'nutrition', etc.
  condition_type TEXT NOT NULL, -- 'complete_task_before_9am', 'complete_all_tasks', etc.
  target_value INTEGER DEFAULT 1, -- How many times to complete the condition
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily challenges assigned to users
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_template_id UUID REFERENCES challenge_templates(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  progress INTEGER DEFAULT 0,
  target INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, challenge_template_id, date)
);

-- Challenge completion history
CREATE TABLE challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_template_id UUID REFERENCES challenge_templates(id) ON DELETE CASCADE,
  daily_challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  points_awarded INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 3. ACHIEVEMENTS & BADGES SYSTEM
-- =============================================

-- Achievement templates
CREATE TABLE achievement_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id TEXT UNIQUE NOT NULL, -- 'first_inch', 'monthly_master', etc.
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- 'height_milestone', 'consistency', 'habit_specialist', etc.
  points_awarded INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_template_id UUID REFERENCES achievement_templates(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_template_id)
);

-- =============================================
-- 4. STREAKS & PROGRESS TRACKING
-- =============================================

-- Enhanced user progress tracking
CREATE TABLE user_progress_enhanced (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_streak INTEGER DEFAULT 0,
  current_day INTEGER DEFAULT 1,
  total_days_completed INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_freeze_count INTEGER DEFAULT 0, -- For premium users
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =============================================
-- 5. INDEXES FOR PERFORMANCE
-- =============================================

-- Points system indexes
CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX idx_points_transactions_created_at ON points_transactions(created_at);

-- Challenges indexes
CREATE INDEX idx_daily_challenges_user_date ON daily_challenges(user_id, date);
CREATE INDEX idx_daily_challenges_completed ON daily_challenges(completed);
CREATE INDEX idx_challenge_completions_user_id ON challenge_completions(user_id);

-- Achievements indexes
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked_at ON user_achievements(unlocked_at);

-- Progress indexes
CREATE INDEX idx_user_progress_enhanced_user_id ON user_progress_enhanced(user_id);

-- =============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress_enhanced ENABLE ROW LEVEL SECURITY;

-- User points policies
CREATE POLICY "Users can view own points" ON user_points
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own points" ON user_points
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own points" ON user_points
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Points transactions policies
CREATE POLICY "Users can view own transactions" ON points_transactions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own transactions" ON points_transactions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Daily challenges policies
CREATE POLICY "Users can view own challenges" ON daily_challenges
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own challenges" ON daily_challenges
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own challenges" ON daily_challenges
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Challenge completions policies
CREATE POLICY "Users can view own completions" ON challenge_completions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own completions" ON challenge_completions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- User progress enhanced policies
CREATE POLICY "Users can view own progress" ON user_progress_enhanced
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own progress" ON user_progress_enhanced
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own progress" ON user_progress_enhanced
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- =============================================
-- 7. INITIAL DATA SEEDING
-- =============================================

-- Insert challenge templates
INSERT INTO challenge_templates (challenge_id, title, description, icon, points, category, condition_type, target_value) VALUES
('early_bird', 'Early Bird', 'Complete your first task before 9 AM', 'sunny', 25, 'timing', 'complete_task_before_9am', 1),
('streak_master', 'Streak Master', 'Complete all 5 daily tasks', 'flame', 50, 'completion', 'complete_all_tasks', 1),
('nutrition_ninja', 'Nutrition Ninja', 'Complete 2 nutrition-related tasks', 'nutrition', 30, 'nutrition', 'complete_nutrition_tasks', 2),
('stretch_warrior', 'Stretch Warrior', 'Complete 3 stretching exercises', 'fitness', 35, 'exercise', 'complete_stretching_tasks', 3),
('consistency_king', 'Consistency King', 'Complete tasks for 3 consecutive days', 'calendar', 100, 'streak', 'consecutive_days', 3),
('speed_demon', 'Speed Demon', 'Complete all tasks in under 2 hours', 'flash', 40, 'speed', 'complete_tasks_quickly', 1),
('weekend_warrior', 'Weekend Warrior', 'Complete all tasks on a weekend', 'happy', 30, 'timing', 'complete_weekend_tasks', 1),
('night_owl', 'Night Owl', 'Complete your last task after 8 PM', 'moon', 25, 'timing', 'complete_task_after_8pm', 1);

-- Insert achievement templates
INSERT INTO achievement_templates (achievement_id, title, description, icon, category, points_awarded, rarity) VALUES
('first_inch', 'First Inch', 'Gained your first inch in height', 'trending-up', 'height_milestone', 500, 'rare'),
('halfway_there', 'Halfway There', 'Completed 60 days of your growth plan', 'target', 'consistency', 300, 'rare'),
('dream_achieved', 'Dream Achieved', 'Reached your target height', 'trophy', 'height_milestone', 1000, 'legendary'),
('seven_day_warrior', '7-Day Warrior', 'Maintained a 7-day streak', 'flame', 'consistency', 100, 'common'),
('monthly_master', 'Monthly Master', 'Completed 30 consecutive days', 'calendar', 'consistency', 500, 'epic'),
('yearly_legend', 'Yearly Legend', 'Completed 365 consecutive days', 'star', 'consistency', 2000, 'legendary'),
('sleep_champion', 'Sleep Champion', 'Perfect sleep score for 7 days', 'moon', 'habit_specialist', 200, 'rare'),
('nutrition_ninja', 'Nutrition Ninja', 'Perfect nutrition score for 7 days', 'nutrition', 'habit_specialist', 200, 'rare'),
('stretch_pro', 'Stretch Pro', 'Perfect stretching score for 7 days', 'fitness', 'habit_specialist', 200, 'rare'),
('early_bird_master', 'Early Bird Master', 'Completed 10 early bird challenges', 'sunny', 'challenge_specialist', 150, 'rare'),
('weekend_warrior_master', 'Weekend Warrior Master', 'Completed 10 weekend challenges', 'happy', 'challenge_specialist', 150, 'rare'),
('speed_demon_master', 'Speed Demon Master', 'Completed 10 speed challenges', 'flash', 'challenge_specialist', 150, 'rare');

-- =============================================
-- 8. TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Function to update user points when transactions are added
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_points (user_id, total_points, current_level, points_in_current_level, points_needed_for_next_level)
  VALUES (NEW.user_id, NEW.points_awarded, 1, NEW.points_awarded, 1000)
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_points = user_points.total_points + NEW.points_awarded,
    current_level = FLOOR((user_points.total_points + NEW.points_awarded) / 1000) + 1,
    points_in_current_level = (user_points.total_points + NEW.points_awarded) % 1000,
    points_needed_for_next_level = 1000 - ((user_points.total_points + NEW.points_awarded) % 1000),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update user points
CREATE TRIGGER trigger_update_user_points
  AFTER INSERT ON points_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_user_points_updated_at
  BEFORE UPDATE ON user_points
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_progress_enhanced_updated_at
  BEFORE UPDATE ON user_progress_enhanced
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
