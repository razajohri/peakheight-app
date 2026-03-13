import { API_KEYS, API_ENDPOINTS, OPENAI_MODELS } from '../config/apiKeys';
import { AuthService } from './auth';
import { DailyPlanService } from './dailyPlanService';

// AI Coach Service for comprehensive height growth coaching and app guidance
export class AICoachService {

  // =============================================
  // KNOWLEDGE BASE
  // =============================================

  static KNOWLEDGE_BASE = {
    app_features: {
      overview: "PeakHeight is a comprehensive 120-day height growth app with personalized exercise plans, nutrition tracking, sleep optimization, posture improvement, and community support.",
      exercises: {
        categories: ["Growth Hormone", "Building", "Advancing", "Mastery"],
        types: ["Stretching", "Hanging", "Posture", "Spinal Decompression", "Core Strengthening"],
        daily_plan: "Users get 5 personalized exercises daily based on their current day (1-120) and phase",
        timing: "Each exercise has specific duration and difficulty levels (Beginner, Inter, Advanced)",
        benefits: "Improves spinal alignment, decompresses vertebrae, strengthens core, enhances posture"
      },
      nutrition: {
        tracking: "Food scanner with Open Food Facts API integration",
        growth_score: "Each food gets a growth score based on nutrients beneficial for height growth",
        key_nutrients: ["Protein", "Calcium", "Vitamin D", "Zinc", "Magnesium", "Vitamin K"],
        daily_plan: "Users can add recipes to their daily tasks from the recipe library"
      },
      sleep: {
        importance: "Growth hormone is released during deep sleep, especially in the first 3 hours",
        recommendations: "8-10 hours of quality sleep for optimal growth",
        tracking: "Sleep duration and quality tracking with insights"
      },
      progress: {
        tracking: "120-day plan with daily tasks, weekly progress, and streak tracking",
        phases: "Growth Hormone (1-30), Building (31-60), Advancing (61-90), Mastery (91-120)",
        metrics: "Height measurements, habit consistency, exercise completion, nutrition scores"
      },
      community: {
        tribe: "Community section for sharing progress, tips, and motivation",
        features: ["Posts", "Likes", "Comments", "Progress sharing", "Motivational content"]
      }
    },

    height_growth_science: {
      factors: {
        genetics: "60-80% of height is determined by genetics, but 20-40% can be influenced by lifestyle",
        age: "Growth plates typically close between 16-25 years old, but some growth is possible until 30",
        hormones: "Growth hormone, IGF-1, thyroid hormones, and sex hormones all play crucial roles",
        nutrition: "Protein, calcium, vitamin D, zinc, and other micronutrients are essential for bone growth",
        sleep: "70% of growth hormone is released during deep sleep, especially in the first 3 hours",
        exercise: "Weight-bearing exercises, stretching, and spinal decompression can help maximize height potential",
        posture: "Good posture can add 1-3 inches to apparent height and support spinal health"
      },

      growth_mechanisms: {
        bone_growth: "Long bones grow at growth plates through endochondral ossification",
        spinal_decompression: "Spinal exercises can decompress vertebrae and improve spinal alignment",
        cartilage: "Intervertebral discs can thicken with proper nutrition and exercise",
        muscle_development: "Strong core and back muscles support better posture and spinal health"
      },

      timeline: {
        puberty: "Most rapid growth occurs during puberty (10-16 for girls, 12-18 for boys)",
        post_puberty: "Growth continues at a slower rate until growth plates close",
        adult: "While significant height increase is limited, posture and spinal health improvements can add 1-3 inches"
      }
    },

    exercises: {
      hanging: {
        benefits: "Decompresses spine, stretches back muscles, improves posture",
        types: ["Dead hang", "Active hang", "Hanging leg raises", "Hanging twists"],
        duration: "30 seconds to 2 minutes, 3-5 sets",
        safety: "Start with shorter durations, use proper grip, avoid if you have shoulder issues"
      },

      stretching: {
        spinal: ["Cobra stretch", "Cat-cow", "Spinal twist", "Forward fold"],
        hamstring: ["Seated forward fold", "Standing hamstring stretch", "Downward dog"],
        hip_flexor: ["Lunges", "Hip flexor stretch", "Pigeon pose"],
        benefits: "Improves flexibility, reduces muscle tension, supports spinal alignment"
      },

      posture: {
        exercises: ["Wall angels", "Plank", "Bird dog", "Dead bug", "Posture stabilizer"],
        daily_practice: "Practice good posture throughout the day, not just during exercises",
        ergonomics: "Proper desk setup, pillow height, and sleeping position matter"
      },

      core: {
        importance: "Strong core supports spine and improves posture",
        exercises: ["Plank variations", "Dead bug", "Bird dog", "Mountain climbers"],
        frequency: "3-4 times per week for best results"
      }
    },

    nutrition: {
      growth_nutrients: {
        protein: "Essential for bone and muscle growth, aim for 1.2-1.6g per kg body weight",
        calcium: "Primary mineral in bones, 1000-1300mg daily depending on age",
        vitamin_d: "Helps calcium absorption, 600-2000 IU daily, get sunlight exposure",
        zinc: "Important for growth hormone production, 8-11mg daily",
        magnesium: "Bone health and muscle function, 400-420mg daily",
        vitamin_k: "Bone mineralization, found in leafy greens",
        phosphorus: "Works with calcium for bone strength"
      },

      best_foods: {
        protein: ["Eggs", "Greek yogurt", "Chicken breast", "Fish", "Legumes", "Nuts"],
        calcium: ["Dairy products", "Leafy greens", "Sardines", "Almonds", "Fortified foods"],
        vitamin_d: ["Fatty fish", "Egg yolks", "Fortified milk", "Sunlight exposure"],
        zinc: ["Oysters", "Beef", "Pumpkin seeds", "Chickpeas", "Cashews"]
      },

      meal_timing: {
        breakfast: "High protein breakfast within 1 hour of waking",
        pre_workout: "Light snack 30-60 minutes before exercise",
        post_workout: "Protein and carbs within 30 minutes after exercise",
        dinner: "Balanced meal 2-3 hours before sleep"
      }
    },

    sleep: {
      growth_hormone: {
        release: "70% of daily growth hormone is released during deep sleep",
        peak_times: "First 3 hours of sleep, especially during deep sleep stages",
        factors: "Sleep quality, duration, and timing all affect hormone release"
      },

      optimization: {
        duration: "8-10 hours for teenagers, 7-9 hours for adults",
        schedule: "Consistent sleep and wake times, even on weekends",
        environment: "Cool, dark, quiet room with comfortable mattress and pillows",
        routine: "Relaxing bedtime routine, avoid screens 1 hour before bed"
      },

      sleep_stages: {
        deep_sleep: "Most important for growth hormone release",
        rem_sleep: "Important for memory consolidation and recovery",
        light_sleep: "Transitional stage, less critical for growth"
      }
    },

    common_questions: {
      "Can I grow taller after 18?": "Yes, growth plates typically close between 16-25, but posture improvements and spinal health can add 1-3 inches at any age.",
      "How much can I grow?": "Depends on genetics, age, and current habits. Most people can improve their height by 1-3 inches through posture and spinal health.",
      "How long does it take to see results?": "Posture improvements can be seen in weeks, while structural changes may take 3-6 months of consistent effort.",
      "Do supplements work?": "Most height supplements are ineffective. Focus on proper nutrition, exercise, and sleep instead.",
      "Is hanging safe?": "Yes, when done properly. Start with short durations and use proper form. Avoid if you have shoulder issues."
    }
  };

  // =============================================
  // CHAT FUNCTIONALITY
  // =============================================

  // Send message to AI coach
  static async sendMessage(userId, message, conversationHistory = []) {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userContext = await this.getUserContext(userId);

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: message }
      ];

      const response = await fetch(`${API_ENDPOINTS.OPENAI}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OPENAI_MODELS.DEFAULT,
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Skip saving conversation to database for now
      await this.saveConversation(userId, message, aiResponse);

      return {
        response: aiResponse,
        error: null,
        conversationId: Date.now().toString()
      };
    } catch (error) {
      console.error('AI Coach send message error:', error);
      return {
        response: null,
        error: error.message,
        conversationId: null
      };
    }
  }

  // Build comprehensive system prompt
  static buildSystemPrompt() {
    return `You are Jacob, their personal coach for their 6 months height growth plan, an expert height growth coach and app guide. Your name is Jacob. You have extensive knowledge about:

APP FEATURES:
- 6 months personalized growth plan with 4 phases (Growth Hormone, Building, Advancing, Mastery)
- Daily exercise plans with 5 exercises based on user's current day and phase
- Nutrition tracking with food scanner and growth scores
- Sleep optimization and tracking
- Posture improvement exercises
- Community features (Tribe) for motivation and sharing
- Progress tracking with streaks and weekly summaries

HEIGHT GROWTH SCIENCE:
- Growth factors: genetics (60-80%), lifestyle (20-40%)
- Growth plates close between 16-25, but posture improvements possible at any age
- Growth hormone released during deep sleep (70% in first 3 hours)
- Key nutrients: protein, calcium, vitamin D, zinc, magnesium
- Exercise benefits: spinal decompression, posture improvement, core strengthening

EXERCISE KNOWLEDGE:
- Hanging exercises: decompress spine, 30 seconds to 2 minutes
- Stretching: spinal, hamstring, hip flexor stretches
- Posture exercises: wall angels, planks, posture stabilizers
- Core strengthening: essential for spinal support

NUTRITION GUIDANCE:
- Protein: 1.2-1.6g per kg body weight
- Calcium: 1000-1300mg daily
- Vitamin D: 600-2000 IU daily
- Best foods: eggs, dairy, leafy greens, fish, nuts

SLEEP OPTIMIZATION:
- 8-10 hours for teens, 7-9 hours for adults
- Consistent sleep schedule
- Cool, dark, quiet environment
- Avoid screens 1 hour before bed

COMMUNICATION STYLE:
- Your name is Jacob - introduce yourself as Jacob and refer to yourself by name when appropriate
- Encouraging and supportive
- Science-based but accessible
- Specific and actionable advice
- Personalized to user's app progress
- Use emojis appropriately
- Keep responses concise but comprehensive
- Always relate advice back to the app features when relevant

When users ask about the app, explain specific features. When they ask about height growth, provide science-based advice. Always be encouraging and help them stay motivated on their 6 months height growth journey. Speak as their dedicated personal coach Jacob who is invested in their success.`;
  }

  // Get user context for personalized responses
  static async getUserContext(userId) {
    try {
      // Get user profile and progress
      const userProfile = await AuthService.getUserProfile(userId);
      const userProgress = await DailyPlanService.getUserProgress(userId);

      return {
        currentDay: userProgress?.current_day || 1,
        phase: this.getPhaseForDay(userProgress?.current_day || 1),
        streak: userProgress?.current_streak || 0,
        age: userProfile?.age,
        height: userProfile?.current_height,
        targetHeight: userProfile?.target_height,
        gender: userProfile?.gender
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return {};
    }
  }

  // Get phase for current day
  static getPhaseForDay(day) {
    if (day <= 30) return 'Growth Hormone';
    if (day <= 60) return 'Building';
    if (day <= 90) return 'Advancing';
    return 'Mastery';
  }

  // Save conversation to database (disabled - no-op)
  static async saveConversation(userId, userMessage, aiResponse) {
    return { success: true };
  }

  // =============================================
  // QUICK RESPONSES
  // =============================================

  // Get quick response for common questions
  static getQuickResponse(message, userContext = {}) {
    const lowerMessage = message.toLowerCase();

    // App-related questions
    if (lowerMessage.includes('app') || lowerMessage.includes('feature')) {
      return "PeakHeight offers a 120-day personalized growth plan with daily exercises, nutrition tracking, sleep optimization, and community support. You're currently on day " + (userContext.currentDay || 1) + " of your " + (userContext.phase || 'Growth Hormone') + " phase! 🎯";
    }

    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      return "Your daily exercise plan includes 5 personalized exercises based on your current phase. Focus on hanging, stretching, and posture exercises for maximum height benefits! 💪";
    }

    if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet')) {
      return "Use the food scanner to track your nutrition! Focus on protein, calcium, vitamin D, and zinc. Each food gets a growth score to help you choose the best options! 🥗";
    }

    if (lowerMessage.includes('sleep')) {
      return "Sleep is crucial for growth! Aim for 8-10 hours of quality sleep. Growth hormone is released during deep sleep, especially in the first 3 hours! 😴";
    }

    if (lowerMessage.includes('progress') || lowerMessage.includes('streak')) {
      return "You're doing amazing with your " + (userContext.streak || 0) + " day streak! Keep up the consistency - it's the key to seeing results! 🔥";
    }

    // Height growth questions
    if (lowerMessage.includes('grow taller') || lowerMessage.includes('height')) {
      return "Height growth is influenced by genetics, nutrition, sleep, exercise, and posture. While genetics play a big role, you can maximize your potential through proper habits! 📏";
    }

    if (lowerMessage.includes('how long') || lowerMessage.includes('time')) {
      return "Results vary, but you can see posture improvements in weeks and structural changes in 3-6 months with consistent effort. Your 120-day plan is designed for optimal results! ⏰";
    }

    if (lowerMessage.includes('age') || lowerMessage.includes('too old')) {
      return "While growth plates typically close between 16-25, you can still improve your height through posture and spinal health at any age! It's never too late to start! 🌟";
    }

    // Default response
    return "I'm here to help with your height growth journey! Ask me about exercises, nutrition, sleep, or any app features. What would you like to know? 🤔";
  }

  // =============================================
  // PERSONALIZED TIPS
  // =============================================

  // Generate personalized tip based on user context
  static generatePersonalizedTip(userContext) {
    const { currentDay, phase, streak, age } = userContext;

    const tips = {
      'Growth Hormone': [
        "Focus on building consistent habits! Start with 10 minutes of daily stretching.",
        "Your growth hormone phase is about establishing routines. Don't worry about perfection!",
        "Sleep is your secret weapon during the growth hormone phase. Aim for 8+ hours!",
        "Track your nutrition daily. Small improvements compound over time!"
      ],
      Building: [
        "You're building momentum! Increase exercise intensity gradually.",
        "Your body is adapting. Keep pushing through the building phase!",
        "Focus on protein intake to support your increased exercise routine.",
        "Consistency is key in the building phase. Your streak shows you're on track!"
      ],
      Advancing: [
        "You're advancing! Challenge yourself with more complex exercises.",
        "Your body is responding to the routine. Keep the momentum going!",
        "Fine-tune your nutrition for optimal growth support.",
        "You're in the advanced phase - your dedication is paying off!"
      ],
      Mastery: [
        "You've reached mastery! Share your knowledge with the community.",
        "Your 120-day journey is almost complete. You're a height growth expert now!",
        "Maintain your habits for lifelong benefits.",
        "Congratulations on reaching the mastery phase! You've transformed your lifestyle!"
      ]
    };

    const phaseTips = tips[phase] || tips['Growth Hormone'];
    return phaseTips[Math.floor(Math.random() * phaseTips.length)];
  }

  // =============================================
  // CONVERSATION MANAGEMENT
  // =============================================

  // Get conversation history (disabled - return empty)
  static async getConversationHistory(userId, limit = 20) {
    return [];
  }

  // Clear conversation history
  static async clearConversationHistory(userId) {
    try {
      // This would need to be implemented in DatabaseService
      // For now, we'll just return success
      return { success: true, error: null };
    } catch (error) {
      console.error('Error clearing conversation history:', error);
      return { success: false, error: error.message };
    }
  }
}

export default AICoachService;
