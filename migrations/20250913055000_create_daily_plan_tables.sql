-- Create daily plan tables for 120-day growth plan
-- Migration: 20250913055000_create_daily_plan_tables.sql

-- Create user_progress table to track user's progress through the 120-day plan
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    current_day INTEGER NOT NULL DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 120),
    current_streak INTEGER NOT NULL DEFAULT 0,
    total_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    total_tasks_completed INTEGER NOT NULL DEFAULT 0,
    plan_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_tasks table to store daily tasks for each user
CREATE TABLE IF NOT EXISTS daily_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 120),
    tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
    completed_tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
    completion_percentage INTEGER NOT NULL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, day_number)
);

-- Create task_templates table to store task templates for different phases
CREATE TABLE IF NOT EXISTS task_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phase VARCHAR(50) NOT NULL,
    day_range_start INTEGER NOT NULL CHECK (day_range_start >= 1 AND day_range_start <= 120),
    day_range_end INTEGER NOT NULL CHECK (day_range_end >= 1 AND day_range_end <= 120),
    template_prompt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default task templates for different phases
INSERT INTO task_templates (phase, day_range_start, day_range_end, template_prompt) VALUES
('Foundation', 1, 30, 'Generate 5 daily tasks for the foundation phase of height growth. Focus on basic habits like sleep, nutrition, stretching, and posture. Tasks should be simple and achievable for beginners.'),
('Growth', 31, 60, 'Generate 5 daily tasks for the growth phase of height optimization. Include more advanced exercises, nutrition tracking, and habit building. Tasks should be moderately challenging.'),
('Optimization', 61, 90, 'Generate 5 daily tasks for the optimization phase of height growth. Focus on advanced techniques, fine-tuning habits, and maximizing growth potential.'),
('Maintenance', 91, 120, 'Generate 5 daily tasks for the maintenance phase of height growth. Focus on maintaining gains, preventing regression, and building long-term habits.');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON daily_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_day_number ON daily_tasks(day_number);
CREATE INDEX IF NOT EXISTS idx_task_templates_phase ON task_templates(phase);

-- Enable Row Level Security (RLS)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_progress
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for daily_tasks
CREATE POLICY "Users can view their own daily tasks" ON daily_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily tasks" ON daily_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily tasks" ON daily_tasks
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for task_templates (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view task templates" ON task_templates
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_tasks_updated_at BEFORE UPDATE ON daily_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_templates_updated_at BEFORE UPDATE ON task_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
