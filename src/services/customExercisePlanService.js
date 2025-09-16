import { supabase } from '../config/supabase';
import { EXERCISES } from '../utils/exercisesData';

export class CustomExercisePlanService {
  // Initialize user's custom exercise plan
  static async initializeUserExercisePlan(userId) {
    try {
      // Check if user already has a custom plan
      const { data: existingPlan } = await supabase
        .from('user_exercise_plans')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingPlan) {
        return existingPlan;
      }

      // Generate custom exercise plan
      const customPlan = await this.generateCustomExercisePlan(userId);

      // Save to database using upsert to handle existing records
      const { data: plan, error } = await supabase
        .from('user_exercise_plans')
        .upsert({
          user_id: userId,
          plan_name: 'My Custom Plan',
          daily_exercises: customPlan.dailyExercises,
          phase: customPlan.phase,
          current_day: customPlan.currentDay,
          last_updated: customPlan.lastUpdated,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;
      return plan;
    } catch (error) {
      console.error('Error initializing user exercise plan:', error);
      throw error;
    }
  }

  // Generate a custom exercise plan based on user's current day and progress
  static async generateCustomExercisePlan(userId) {
    try {
      // Get user's current progress to determine their phase
      const { data: userProgress } = await supabase
        .from('user_progress')
        .select('current_day, current_streak')
        .eq('user_id', userId)
        .maybeSingle();

      const currentDay = userProgress?.current_day || 1;
      const currentStreak = userProgress?.current_streak || 0;
      const phase = this.getPhaseForDay(currentDay);

      // Generate today's 5 daily exercises from main EXERCISES data
      const todayExercises = this.generateDailyExercises(currentDay, phase);

      return {
        dailyExercises: todayExercises,
        phase,
        currentDay,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating custom exercise plan:', error);
      // Return default plan if error
      return this.getDefaultExercisePlan();
    }
  }

  // Get exercises based on focus area and user phase
  static getExercisesForFocus(focus, phase) {
    const exerciseMap = {
      posture: ['posture', 'upper-body', 'shoulders', 'neck'],
      strength: ['upper-body', 'lower-body', 'chest', 'hamstrings'],
      stretching: ['stretching', 'lower-body', 'feet-ankles'],
      core: ['posture', 'upper-body'],
      cardio: ['masai-jump', 'lower-body'],
      recovery: ['recovery', 'stretching'],
      'active-rest': ['recovery', 'stretching', 'hands']
    };

    const categories = exerciseMap[focus] || ['posture'];
    const difficulty = this.getDifficultyForPhase(phase);

    return EXERCISES
      .filter(ex => categories.includes(ex.categoryId))
      .filter(ex => ex.difficulty === difficulty)
      .slice(0, 4) // 4 exercises per day
      .map(ex => ({
        id: ex.id,
        name: ex.name,
        duration: ex.durationMin,
        difficulty: ex.difficulty,
        category: ex.categoryId,
        icon: ex.icon,
        benefits: ex.benefits,
        targetMuscles: ex.targetMuscles,
        steps: ex.steps
      }));
  }

  // Get morning exercises (lighter, energizing)
  static getMorningExercises(phase) {
    const difficulty = this.getDifficultyForPhase(phase);

    return EXERCISES
      .filter(ex => ['posture', 'stretching', 'neck'].includes(ex.categoryId))
      .filter(ex => ex.difficulty === difficulty)
      .filter(ex => ex.durationMin <= 10) // Quick morning exercises
      .slice(0, 3)
      .map(ex => ({
        id: ex.id,
        name: ex.name,
        duration: ex.durationMin,
        difficulty: ex.difficulty,
        category: ex.categoryId,
        icon: ex.icon,
        benefits: ex.benefits,
        targetMuscles: ex.targetMuscles,
        steps: ex.steps
      }));
  }

  // Get evening exercises (relaxing, recovery-focused)
  static getEveningExercises(phase) {
    const difficulty = this.getDifficultyForPhase(phase);

    return EXERCISES
      .filter(ex => ['recovery', 'stretching', 'feet-ankles'].includes(ex.categoryId))
      .filter(ex => ex.difficulty === difficulty)
      .filter(ex => ex.durationMin <= 15) // Relaxing evening exercises
      .slice(0, 3)
      .map(ex => ({
        id: ex.id,
        name: ex.name,
        duration: ex.durationMin,
        difficulty: ex.difficulty,
        category: ex.categoryId,
        icon: ex.icon,
        benefits: ex.benefits,
        targetMuscles: ex.targetMuscles,
        steps: ex.steps
      }));
  }

  // Get phase based on current day
  static getPhaseForDay(dayNumber) {
    if (dayNumber <= 30) return 'Foundation';
    if (dayNumber <= 60) return 'Building';
    if (dayNumber <= 90) return 'Advancing';
    return 'Mastery';
  }

  // Get difficulty level based on phase
  static getDifficultyForPhase(phase) {
    switch (phase) {
      case 'Foundation': return 'Beginner';
      case 'Building': return 'Beginner';
      case 'Advancing': return 'Intermediate';
      case 'Mastery': return 'Advanced';
      default: return 'Beginner';
    }
  }

  // Get total exercise count
  static getTotalExerciseCount(weeklySchedule, dailyExercises) {
    let total = 0;
    Object.values(weeklySchedule).forEach(day => total += day.exercises.length);
    total += dailyExercises.morning.length;
    total += dailyExercises.evening.length;
    return total;
  }

  // Get default exercise plan (fallback)
  static getDefaultExercisePlan() {
    return {
      weeklySchedule: {
        monday: { focus: 'Posture & Alignment', exercises: [] },
        tuesday: { focus: 'Strength & Mobility', exercises: [] },
        wednesday: { focus: 'Stretching & Flexibility', exercises: [] },
        thursday: { focus: 'Core & Stability', exercises: [] },
        friday: { focus: 'Cardio & Jump Training', exercises: [] },
        saturday: { focus: 'Recovery & Relaxation', exercises: [] },
        sunday: { focus: 'Active Rest', exercises: [] }
      },
      dailyExercises: {
        morning: [],
        evening: []
      },
      phase: 'Foundation',
      totalExercises: 0
    };
  }

  // Get user's custom exercise plan
  static async getUserExercisePlan(userId) {
    try {
      const { data, error } = await supabase
        .from('user_exercise_plans')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Initialize if doesn't exist
        return await this.initializeUserExercisePlan(userId);
      }

      return data;
    } catch (error) {
      console.error('Error getting user exercise plan:', error);
      throw error;
    }
  }

  // Update user's exercise plan
  static async updateUserExercisePlan(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_exercise_plans')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user exercise plan:', error);
      throw error;
    }
  }

  // Generate 5 daily exercises from main EXERCISES data
  static generateDailyExercises(currentDay, phase) {
    const difficulty = this.getDifficultyForPhase(phase);

    // Get all exercises with the appropriate difficulty
    const availableExercises = EXERCISES.filter(ex => ex.difficulty === difficulty);

    // Use current day as seed for consistent daily selection
    const seed = currentDay;
    const shuffled = this.shuffleArray([...availableExercises], seed);

    // Select 5 exercises with variety (different categories)
    const selectedExercises = [];
    const usedCategories = new Set();

    for (const exercise of shuffled) {
      if (selectedExercises.length >= 5) break;

      // Try to get variety in categories
      if (!usedCategories.has(exercise.categoryId) || selectedExercises.length >= 3) {
        selectedExercises.push({
          id: exercise.id,
          name: exercise.name,
          categoryId: exercise.categoryId,
          durationMin: exercise.durationMin,
          difficulty: exercise.difficulty,
          icon: exercise.icon,
          benefits: exercise.benefits,
          targetMuscles: exercise.targetMuscles,
          steps: exercise.steps,
          subExercises: exercise.subExercises,
          imageUrl: exercise.imageUrl,
          description: exercise.description
        });
        usedCategories.add(exercise.categoryId);
      }
    }

    return selectedExercises;
  }

  // Shuffle array with seed for consistent daily results
  static shuffleArray(array, seed) {
    const shuffled = [...array];
    let currentIndex = shuffled.length;

    // Use seed for consistent randomization
    const random = () => {
      const x = Math.sin(seed + currentIndex) * 10000;
      return x - Math.floor(x);
    };

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(random() * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }

    return shuffled;
  }

  // Get today's recommended exercises
  static getTodayExercises(exercisePlan) {
    // Check if we need to update daily exercises (different day)
    const today = new Date().toDateString();
    const lastUpdated = exercisePlan.lastUpdated ? new Date(exercisePlan.lastUpdated).toDateString() : null;

    if (lastUpdated !== today || !exercisePlan.dailyExercises || exercisePlan.dailyExercises.length === 0) {
      // Generate new daily exercises
      const currentDay = exercisePlan.currentDay || 1;
      const phase = exercisePlan.phase || 'Foundation';
      return this.generateDailyExercises(currentDay, phase);
    }

    return exercisePlan.dailyExercises || [];
  }
}
