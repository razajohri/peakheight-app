#!/usr/bin/env node

/**
 * Database Setup Script for Gamification Features
 *
 * This script sets up the necessary database tables for the gamification system.
 * Run this after creating your Supabase project.
 *
 * Usage:
 * 1. Copy the SQL from migrations/20250115000000_create_gamification_tables.sql
 * 2. Run it in your Supabase SQL editor
 * 3. Or use this script if you have the Supabase CLI set up
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need this for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   EXPO_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please add these to your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupGamificationTables() {
  try {
    console.log('🚀 Setting up gamification database tables...');

    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../migrations/20250115000000_create_gamification_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      console.error('❌ Error setting up tables:', error);
      process.exit(1);
    }

    console.log('✅ Gamification tables created successfully!');
    console.log('');
    console.log('📋 Created tables:');
    console.log('   • user_points - User points and level tracking');
    console.log('   • points_transactions - Points transaction history');
    console.log('   • ~~challenge_templates - Daily challenge templates~~ (Removed)');
    console.log('   • ~~daily_challenges - User daily challenges~~ (Removed)');
    console.log('   • ~~challenge_completions - Challenge completion history~~ (Removed)');
    console.log('   • achievement_templates - Achievement templates');
    console.log('   • user_achievements - User unlocked achievements');
    console.log('   • user_progress_enhanced - Enhanced progress tracking');
    console.log('');
    console.log('🎯 Seeded data:');
    console.log('   • 8 challenge templates');
    console.log('   • 12 achievement templates');
    console.log('   • RLS policies for security');
    console.log('   • Database triggers for automation');
    console.log('');
    console.log('🎮 Your gamification system is ready!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Alternative: Manual setup instructions
function showManualSetupInstructions() {
  console.log('📖 Manual Setup Instructions:');
  console.log('');
  console.log('1. Open your Supabase dashboard');
  console.log('2. Go to the SQL Editor');
  console.log('3. Copy and paste the contents of:');
  console.log('   migrations/20250115000000_create_gamification_tables.sql');
  console.log('4. Click "Run" to execute the migration');
  console.log('');
  console.log('This will create all the necessary tables and seed data for:');
  console.log('• Points system');
  console.log('• Daily challenges');
  console.log('• Achievements & badges');
  console.log('• Enhanced progress tracking');
  console.log('');
}

// Check if we should run the setup or show instructions
const args = process.argv.slice(2);
if (args.includes('--manual') || args.includes('-m')) {
  showManualSetupInstructions();
} else {
  setupGamificationTables();
}
