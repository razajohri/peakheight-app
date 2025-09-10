// Test Supabase connection
import { supabase } from './src/config/supabase.js';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');

  try {
    // Test 1: Check if we can connect
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful!');

    // Test 2: Check if tables exist
    const tables = ['users', 'habit_logs', 'streaks', 'exercises', 'posts'];

    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.error(`❌ Table ${table} not found:`, error.message);
        } else {
          console.log(`✅ Table ${table} exists`);
        }
      } catch (err) {
        console.error(`❌ Error checking table ${table}:`, err.message);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testSupabaseConnection();
