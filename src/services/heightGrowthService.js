import { supabase } from '../config/supabase';

/**
 * Science-Based Height Growth Service
 * Optimized for real results over 100 days
 */
export class HeightGrowthService {

  // =============================================
  // SCIENTIFIC TASK CATEGORIES & PROGRESSIONS
  // =============================================

  static getTaskCategories() {
    return {
      sleep: {
        name: 'Sleep Optimization',
        importance: 'critical',
        science: 'Growth hormone peaks during deep sleep (10pm-2am). 8-9 hours optimal for growth.',
        progression: {
          growthHormone: ['Sleep schedule', 'Dark room', 'No screens 1hr before bed'],
          building: ['Sleep quality tracking', 'Temperature optimization', 'Wind-down routine'],
          optimization: ['Sleep stages monitoring', 'Advanced recovery', 'Circadian rhythm optimization'],
          maintenance: ['Habit consolidation', 'Long-term sustainability', 'Lifestyle integration']
        }
      },
      nutrition: {
        name: 'Growth Nutrition',
        importance: 'critical',
        science: 'Protein (1.2g/kg), calcium (1000mg), vitamin D (1000IU), zinc (11mg) essential for bone growth.',
        progression: {
          growthHormone: ['Protein tracking', 'Calcium-rich foods', 'Hydration'],
          building: ['Micronutrient optimization', 'Meal timing', 'Growth-supporting foods'],
          optimization: ['Advanced nutrition tracking', 'Supplement optimization', 'Recovery nutrition'],
          maintenance: ['Sustainable eating habits', 'Long-term nutrition plan', 'Lifestyle integration']
        }
      },
      posture: {
        name: 'Posture Correction',
        importance: 'high',
        science: 'Proper posture can add 1-2 inches of apparent height and prevent spinal compression.',
        progression: {
          growthHormone: ['Posture awareness', 'Basic corrections', 'Ergonomic setup'],
          building: ['Advanced posture exercises', 'Workplace optimization', 'Daily posture checks'],
          optimization: ['Posture monitoring', 'Advanced corrections', 'Professional guidance'],
          maintenance: ['Posture habit formation', 'Long-term maintenance', 'Lifestyle integration']
        }
      },
      recovery: {
        name: 'Recovery & Stress Management',
        importance: 'medium',
        science: 'Chronic stress increases cortisol, which can inhibit growth hormone production.',
        progression: {
          growthHormone: ['Stress awareness', 'Basic relaxation', 'Breathing exercises'],
          building: ['Meditation practice', 'Recovery techniques', 'Stress management'],
          optimization: ['Advanced recovery', 'Professional techniques', 'Comprehensive wellness'],
          maintenance: ['Stress resilience', 'Long-term wellness', 'Lifestyle balance']
        }
      },
      measurement: {
        name: 'Progress Tracking',
        importance: 'medium',
        science: 'Regular measurement helps track progress and maintain motivation.',
        progression: {
          growthHormone: ['Weekly measurements', 'Basic tracking', 'Goal setting'],
          building: ['Detailed tracking', 'Progress analysis', 'Adjustment strategies'],
          optimization: ['Advanced analytics', 'Professional assessment', 'Optimization strategies'],
          maintenance: ['Long-term tracking', 'Habit maintenance', 'Continued growth']
        }
      }
    };
  }

  // =============================================
  // PHASE-SPECIFIC TASK GENERATION
  // =============================================

  static getPhaseTasks(phase, dayNumber) {
    const categories = this.getTaskCategories();
    const phaseTasks = {
      'Growth Hormone Phase': {
        focus: 'Building core habits and establishing routines',
        duration: 'Days 1-30',
        goals: ['Establish sleep schedule', 'Basic nutrition habits', 'Posture awareness', 'Stress management'],
        tasks: this.generateGrowthHormoneTasks(dayNumber, categories)
      },
      'Building Phase': {
        focus: 'Progressive improvement and habit strengthening',
        duration: 'Days 31-60',
        goals: ['Enhance nutrition', 'Improve sleep quality', 'Advanced posture work', 'Recovery techniques'],
        tasks: this.generateBuildingTasks(dayNumber, categories)
      },
      'Optimization Phase': {
        focus: 'Maximizing results and fine-tuning approach',
        duration: 'Days 61-90',
        goals: ['Micronutrient optimization', 'Recovery protocols', 'Progress optimization', 'Advanced techniques'],
        tasks: this.generateOptimizationTasks(dayNumber, categories)
      },
      'Maintenance Phase': {
        focus: 'Sustaining gains and long-term habit formation',
        duration: 'Days 91-120',
        goals: ['Maintain progress', 'Prevent regression', 'Lifestyle integration', 'Long-term planning'],
        tasks: this.generateMaintenanceTasks(dayNumber, categories)
      }
    };

    return phaseTasks[phase] || phaseTasks['Growth Hormone Phase'];
  }

  // =============================================
  // TASK GENERATION BY PHASE
  // =============================================

  static generateGrowthHormoneTasks(dayNumber, categories) {
    const taskPool = [
      // Sleep tasks
      {
        title: "Sleep 8+ Hours",
        emoji: "🛏️",
        category: "sleep",
        description: "Get 8-9 hours of quality sleep tonight for optimal growth hormone release.",
        estimated_time: "Tonight",
        science: "Growth hormone peaks during deep sleep, essential for height growth"
      },
      {
        title: "Early Bedtime Tonight",
        emoji: "🌙",
        category: "sleep",
        description: "Go to bed before 10pm to maximize growth hormone production.",
        estimated_time: "Tonight",
        science: "Growth hormone peaks between 10pm-2am, early sleep maximizes this window"
      },

      // Nutrition tasks
      {
        title: "Protein Breakfast",
        emoji: "🥚",
        category: "nutrition",
        description: "Eat 25g+ protein within 1 hour of waking (eggs, Greek yogurt, protein shake).",
        estimated_time: "15 minutes",
        science: "Morning protein supports muscle and bone growth throughout the day"
      },
      {
        title: "Calcium Rich Snack",
        emoji: "🧀",
        category: "nutrition",
        description: "Have a calcium-rich snack (cheese, yogurt, fortified milk) this afternoon.",
        estimated_time: "5 minutes",
        science: "Calcium is essential for bone mineralization and growth"
      },
      {
        title: "Drink 5L Water",
        emoji: "💧",
        category: "nutrition",
        description: "Drink 5 liters of water throughout the day for optimal hydration and growth.",
        estimated_time: "All day",
        science: "Proper hydration supports cellular function and nutrient transport for growth"
      },

      // Posture tasks
      {
        title: "Wall Posture Check",
        emoji: "🧍",
        category: "posture",
        description: "Stand against wall: heels, glutes, shoulders, head touching. Hold for 60 seconds.",
        estimated_time: "5 minutes",
        science: "Wall exercises help establish proper spinal alignment"
      },
      {
        title: "Daily Stretches",
        emoji: "📳",
        category: "posture",
        description: "Do 3 short stretch breaks today (neck, shoulders, and back) to reset your posture.",
        estimated_time: "5 minutes",
        science: "Frequent light stretching during the day keeps the spine decompressed and posture aligned"
      },

      // Recovery tasks
      {
        title: "Take Vitamin D",
        emoji: "💊",
        category: "nutrition",
        description: "Take 1000 IU vitamin D supplement to support calcium absorption and bone growth.",
        estimated_time: "2 minutes",
        science: "Vitamin D is essential for calcium absorption and bone mineralization"
      },
      {
        title: "Magnesium Before Bed",
        emoji: "🌙",
        category: "nutrition",
        description: "Take 200-400mg magnesium supplement before bed for better sleep and bone health.",
        estimated_time: "2 minutes",
        science: "Magnesium supports bone density and improves sleep quality for growth"
      }
    ];

    // Select 4 tasks ensuring variety across categories
    const selectedTasks = this.selectVariedTasks(taskPool, 4, dayNumber);
    return selectedTasks.map((task, index) => ({
      id: index + 1,
      ...task
    }));
  }

  static generateBuildingTasks(dayNumber, categories) {
    const taskPool = [
      // Advanced sleep
      {
        title: "Quality Sleep Tonight",
        emoji: "😴",
        category: "sleep",
        description: "Get 8-9 hours of uninterrupted sleep in a cool, dark room.",
        estimated_time: "Tonight",
        science: "Quality sleep maximizes growth hormone release for height growth"
      },
      {
        title: "Take Zinc Supplement",
        emoji: "💊",
        category: "nutrition",
        description: "Take 11mg zinc supplement to support growth hormone production.",
        estimated_time: "2 minutes",
        science: "Zinc deficiency is linked to growth retardation and low growth hormone"
      },

      // Enhanced nutrition
      {
        title: "Get Sunlight Today",
        emoji: "☀️",
        category: "nutrition",
        description: "Get 15-20 minutes of direct sunlight for natural vitamin D production.",
        estimated_time: "20 minutes",
        science: "Vitamin D is crucial for calcium absorption and bone health"
      },
      {
        title: "Protein Rich Lunch",
        emoji: "🥩",
        category: "nutrition",
        description: "Eat a protein-rich lunch with lean meat, fish, or plant proteins.",
        estimated_time: "20 minutes",
        science: "Adequate protein supports muscle and bone growth throughout the day"
      },


      // Advanced posture
      {
        title: "Doorway Chest Stretch",
        emoji: "🚪",
        category: "posture",
        description: "Place forearms on door frame, step through gently. Hold 60 seconds.",
        estimated_time: "5 minutes",
        science: "Chest openers counteract forward head posture and improve alignment"
      }
    ];

    const selectedTasks = this.selectVariedTasks(taskPool, 4, dayNumber);
    return selectedTasks.map((task, index) => ({
      id: index + 1,
      ...task
    }));
  }

  static generateOptimizationTasks(dayNumber, categories) {
    const taskPool = [

      // Micronutrient optimization
      {
        title: "Magnesium Supplement",
        emoji: "💊",
        category: "nutrition",
        description: "Take magnesium supplement (200-400mg) before bed for better sleep.",
        estimated_time: "Tonight",
        science: "Magnesium supports muscle relaxation and sleep quality"
      },
      {
        title: "Omega-3 Intake",
        emoji: "🐟",
        category: "nutrition",
        description: "Include omega-3 rich foods (fish, walnuts, flaxseeds) in a meal.",
        estimated_time: "15 minutes",
        science: "Omega-3s support bone health and reduce inflammation"
      },

      // Advanced recovery
      {
        title: "Meditation Practice",
        emoji: "🧘‍♀️",
        category: "recovery",
        description: "Practice 10-15 minutes of mindfulness meditation.",
        estimated_time: "15 minutes",
        science: "Meditation reduces stress hormones and promotes growth hormone release"
      },

      // Progress tracking
      {
        title: "Weekly Measurement",
        emoji: "📏",
        category: "measurement",
        description: "Measure your height in the morning and track progress.",
        estimated_time: "5 minutes",
        science: "Regular measurements help track progress and maintain motivation"
      }
    ];

    const selectedTasks = this.selectVariedTasks(taskPool, 4, dayNumber);
    return selectedTasks.map((task, index) => ({
      id: index + 1,
      ...task
    }));
  }

  static generateMaintenanceTasks(dayNumber, categories) {
    const taskPool = [
      // Lifestyle integration
      {
        title: "Habit Review",
        emoji: "📋",
        category: "lifestyle",
        description: "Review your growth habits and identify which ones to maintain long-term.",
        estimated_time: "10 minutes",
        science: "Habit review helps consolidate gains and prevent regression"
      },
      {
        title: "Long-term Planning",
        emoji: "🎯",
        category: "lifestyle",
        description: "Plan how to continue your growth journey beyond the 100-day program.",
        estimated_time: "15 minutes",
        science: "Long-term planning ensures sustained progress and habit formation"
      },


      // Nutrition maintenance
      {
        title: "Balanced Meal Planning",
        emoji: "🍽️",
        category: "nutrition",
        description: "Plan balanced meals for the week focusing on growth-supporting nutrients.",
        estimated_time: "15 minutes",
        science: "Meal planning ensures consistent nutrition for continued growth"
      },

      // Progress celebration
      {
        title: "Progress Celebration",
        emoji: "🎉",
        category: "measurement",
        description: "Celebrate your progress and document your growth journey achievements.",
        estimated_time: "10 minutes",
        science: "Celebration reinforces positive behaviors and maintains motivation"
      }
    ];

    const selectedTasks = this.selectVariedTasks(taskPool, 4, dayNumber);
    return selectedTasks.map((task, index) => ({
      id: index + 1,
      ...task
    }));
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  static selectVariedTasks(taskPool, count, dayNumber) {
    // Ensure variety across categories
    const categories = [...new Set(taskPool.map(task => task.category))];
    const selectedTasks = [];
    const usedCategories = new Set();

    // First pass: select one task from each category
    for (const category of categories) {
      if (selectedTasks.length >= count) break;

      const categoryTasks = taskPool.filter(task => task.category === category);
      const taskIndex = (dayNumber + selectedTasks.length) % categoryTasks.length;
      const selectedTask = categoryTasks[taskIndex];

      if (!usedCategories.has(category)) {
        selectedTasks.push(selectedTask);
        usedCategories.add(category);
      }
    }

    // Second pass: fill remaining slots with varied tasks
    while (selectedTasks.length < count) {
      const remainingTasks = taskPool.filter(task => !selectedTasks.includes(task));
      if (remainingTasks.length === 0) break;

      const taskIndex = (dayNumber + selectedTasks.length) % remainingTasks.length;
      selectedTasks.push(remainingTasks[taskIndex]);
    }

    return selectedTasks.slice(0, count);
  }

  // =============================================
  // MEASUREMENT TRACKING
  // =============================================

  static async recordHeightMeasurement(userId, heightCm, measurementType = 'morning', notes = '') {
    try {
      const { data, error } = await supabase
        .from('height_measurements')
        .insert({
          user_id: userId,
          measurement_date: new Date().toISOString().split('T')[0],
          height_cm: heightCm,
          measurement_type: measurementType,
          notes: notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording height measurement:', error);
      throw error;
    }
  }

  static async getHeightProgress(userId, days = 30) {
    try {
      const { data, error } = await supabase
        .from('height_measurements')
        .select('*')
        .eq('user_id', userId)
        .gte('measurement_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('measurement_date', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting height progress:', error);
      throw error;
    }
  }

  // =============================================
  // PROGRESS ANALYSIS
  // =============================================

  static calculateProgressMetrics(measurements) {
    if (measurements.length < 2) {
      return {
        totalGrowth: 0,
        weeklyGrowth: 0,
        trend: 'insufficient_data',
        confidence: 'low'
      };
    }

    const firstMeasurement = measurements[0];
    const lastMeasurement = measurements[measurements.length - 1];
    const totalGrowth = lastMeasurement.height_cm - firstMeasurement.height_cm;

    const daysElapsed = Math.ceil((new Date(lastMeasurement.measurement_date) - new Date(firstMeasurement.measurement_date)) / (1000 * 60 * 60 * 24));
    const weeklyGrowth = (totalGrowth / daysElapsed) * 7;

    let trend = 'stable';
    if (weeklyGrowth > 0.1) trend = 'growing';
    else if (weeklyGrowth < -0.1) trend = 'declining';

    let confidence = 'low';
    if (measurements.length >= 7) confidence = 'medium';
    if (measurements.length >= 14) confidence = 'high';

    return {
      totalGrowth: Math.round(totalGrowth * 100) / 100,
      weeklyGrowth: Math.round(weeklyGrowth * 100) / 100,
      trend,
      confidence,
      measurementsCount: measurements.length
    };
  }
}
