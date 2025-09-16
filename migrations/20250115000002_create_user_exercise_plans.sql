-- Create user_exercise_plans table
CREATE TABLE IF NOT EXISTS user_exercise_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL DEFAULT 'My Custom Plan',
  daily_exercises JSONB NOT NULL DEFAULT '[]',
  phase TEXT DEFAULT 'Foundation',
  current_day INTEGER DEFAULT 1,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_exercise_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own exercise plans" ON user_exercise_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise plans" ON user_exercise_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise plans" ON user_exercise_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise plans" ON user_exercise_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_exercise_plans_user_id ON user_exercise_plans(user_id);
