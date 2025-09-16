-- Migration: Remove achievements and points system
-- Remove all achievement and points related tables and functionality

-- Drop foreign key constraints first
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop foreign key constraints for points_transactions
    FOR r IN (SELECT conname FROM pg_constraint WHERE conname LIKE '%points_transactions%')
    LOOP
        EXECUTE 'ALTER TABLE points_transactions DROP CONSTRAINT IF EXISTS ' || r.conname;
    END LOOP;

    -- Drop foreign key constraints for user_achievements
    FOR r IN (SELECT conname FROM pg_constraint WHERE conname LIKE '%user_achievements%')
    LOOP
        EXECUTE 'ALTER TABLE user_achievements DROP CONSTRAINT IF EXISTS ' || r.conname;
    END LOOP;

    -- Drop foreign key constraints for user_points
    FOR r IN (SELECT conname FROM pg_constraint WHERE conname LIKE '%user_points%')
    LOOP
        EXECUTE 'ALTER TABLE user_points DROP CONSTRAINT IF EXISTS ' || r.conname;
    END LOOP;
END $$;

-- Drop RLS policies
DROP POLICY IF EXISTS "Users can view own points" ON user_points;
DROP POLICY IF EXISTS "Users can update own points" ON user_points;
DROP POLICY IF EXISTS "Users can view own transactions" ON points_transactions;
DROP POLICY IF EXISTS "System can insert transactions" ON points_transactions;
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "System can insert achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can view achievement templates" ON achievement_templates;

-- Drop indexes
DROP INDEX IF EXISTS idx_user_points_user_id;
DROP INDEX IF EXISTS idx_user_points_level;
DROP INDEX IF EXISTS idx_points_transactions_user_id;
DROP INDEX IF EXISTS idx_points_transactions_created_at;
DROP INDEX IF EXISTS idx_user_achievements_user_id;
DROP INDEX IF EXISTS idx_user_achievements_created_at;
DROP INDEX IF EXISTS idx_achievement_templates_category;

-- Drop tables in correct order (dependent tables first)
DROP TABLE IF EXISTS points_transactions;
DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS user_points;
DROP TABLE IF EXISTS achievement_templates;

-- Drop any functions related to points/achievements
DROP FUNCTION IF EXISTS calculate_user_level(points INTEGER);
DROP FUNCTION IF EXISTS award_points(user_uuid UUID, points_amount INTEGER, transaction_type TEXT);
DROP FUNCTION IF EXISTS check_achievements(user_uuid UUID);

-- Drop any triggers
DROP TRIGGER IF EXISTS tr_user_points_updated ON user_points;
DROP TRIGGER IF EXISTS tr_points_transaction_inserted ON points_transactions;
DROP TRIGGER IF EXISTS tr_achievement_unlocked ON user_achievements;

-- Note: user_progress table is kept as it contains streak data which is still needed
-- Only removing achievement and points columns if they exist
DO $$
BEGIN
    -- Remove points-related columns from user_progress if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'total_points') THEN
        ALTER TABLE user_progress DROP COLUMN total_points;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'current_level') THEN
        ALTER TABLE user_progress DROP COLUMN current_level;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'points_today') THEN
        ALTER TABLE user_progress DROP COLUMN points_today;
    END IF;
EXCEPTION
    WHEN undefined_table THEN
        NULL; -- Table doesn't exist, continue
END $$;

-- Clean up any remaining achievement/points data
DELETE FROM notification_history WHERE notification_type IN ('achievement', 'level_up', 'points_milestone');
DELETE FROM notification_preferences WHERE category IN ('achievement_notifications', 'level_notifications');
