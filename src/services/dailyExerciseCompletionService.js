import { supabase } from '../config/supabase';

export class DailyExerciseCompletionService {
  // Mark an exercise as completed for today
  static async markExerciseCompleted(userId, dayNumber, exerciseId, subExerciseId = null) {
    try {
      const { data, error } = await supabase
        .from('daily_exercise_completions')
        .upsert({
          user_id: userId,
          day_number: dayNumber,
          exercise_id: exerciseId,
          sub_exercise_id: subExerciseId,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,day_number,exercise_id,sub_exercise_id'
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error marking exercise as completed:', error);
      return { data: null, error: error.message };
    }
  }

  // Get completed exercises for a specific day
  static async getCompletedExercises(userId, dayNumber) {
    try {
      const { data, error } = await supabase
        .from('daily_exercise_completions')
        .select('*')
        .eq('user_id', userId)
        .eq('day_number', dayNumber);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error getting completed exercises:', error);
      return { data: [], error: error.message };
    }
  }

  // Check if a specific exercise is completed for today
  static async isExerciseCompleted(userId, dayNumber, exerciseId, subExerciseId = null) {
    try {
      const { data, error } = await supabase
        .from('daily_exercise_completions')
        .select('id')
        .eq('user_id', userId)
        .eq('day_number', dayNumber)
        .eq('exercise_id', exerciseId)
        .eq('sub_exercise_id', subExerciseId)
        .maybeSingle();

      if (error) throw error;
      return { isCompleted: !!data, error: null };
    } catch (error) {
      console.error('Error checking exercise completion:', error);
      return { isCompleted: false, error: error.message };
    }
  }

  // Get completion status for multiple exercises
  static async getCompletionStatus(userId, dayNumber, exercises) {
    try {
      const { data, error } = await supabase
        .from('daily_exercise_completions')
        .select('exercise_id, sub_exercise_id')
        .eq('user_id', userId)
        .eq('day_number', dayNumber);

      if (error) throw error;

      const completedExercises = new Set();
      (data || []).forEach(completion => {
        const key = completion.sub_exercise_id
          ? `${completion.exercise_id}-${completion.sub_exercise_id}`
          : completion.exercise_id;
        completedExercises.add(key);
      });

      // Map exercises to their completion status
      const statusMap = {};
      exercises.forEach((exercise, index) => {
        const exerciseId = exercise.parentExercise?.id || exercise.id;
        const subExerciseId = exercise.subExercise?.id || null;
        const key = subExerciseId ? `${exerciseId}-${subExerciseId}` : exerciseId;
        statusMap[index] = completedExercises.has(key);
      });

      return { statusMap, error: null };
    } catch (error) {
      console.error('Error getting completion status:', error);
      return { statusMap: {}, error: error.message };
    }
  }
}
