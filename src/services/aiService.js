import { API_KEYS, API_ENDPOINTS, MODERATION_THRESHOLDS } from '../config/apiKeys';
import { DatabaseService } from './database';

// AI Service for height predictions, insights, and content moderation
export class AIService {
  // =============================================
  // HEIGHT PREDICTION
  // =============================================

  // Generate height prediction based on user data
  static async generateHeightPrediction(userId, userData) {
    try {
      const prompt = this.buildHeightPredictionPrompt(userData);
      
      const response = await fetch(`${API_ENDPOINTS.OPENAI}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a height growth expert with deep knowledge of human biology, nutrition, exercise science, and growth factors. Provide accurate, science-based height predictions and growth advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const prediction = data.choices[0].message.content;

      // Save the insight to database
      await DatabaseService.saveAIInsight(userId, {
        type: 'height_prediction',
        content: prediction,
        data: {
          userData: userData,
          confidence: this.calculateConfidenceScore(userData),
          timestamp: new Date().toISOString(),
        },
        confidenceScore: this.calculateConfidenceScore(userData),
        isPremium: true,
      });

      return { prediction, error: null };
    } catch (error) {
      console.error('Generate height prediction error:', error);
      return { prediction: null, error: error.message };
    }
  }

  // Build height prediction prompt
  static buildHeightPredictionPrompt(userData) {
    return `
Analyze the following user data and provide a height prediction with growth potential:

User Profile:
- Age: ${userData.age} years
- Current Height: ${userData.currentHeight} cm
- Target Height: ${userData.targetHeight} cm
- Gender: ${userData.gender}
- Parent Heights: Father ${userData.parentHeightFather} cm, Mother ${userData.parentHeightMother} cm

Current Habits:
- Sleep: ${userData.sleepHours} hours/night
- Exercise: ${userData.exerciseMinutes} minutes/day
- Nutrition: ${userData.nutritionScore}/100
- Posture: ${userData.postureHours} hours/day

Recent Progress:
- Height Growth: ${userData.recentGrowth} cm in last 3 months
- Habit Consistency: ${userData.habitConsistency}%

Please provide:
1. Realistic height prediction (range)
2. Growth potential assessment
3. Key factors affecting growth
4. Specific recommendations for improvement
5. Timeline for potential growth

Be encouraging but realistic, focusing on science-based factors.
    `.trim();
  }

  // =============================================
  // DAILY TIPS & INSIGHTS
  // =============================================

  // Generate personalized daily tip
  static async generateDailyTip(userId, userContext) {
    try {
      const prompt = this.buildDailyTipPrompt(userContext);
      
      const response = await fetch(`${API_ENDPOINTS.OPENAI}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a height growth coach providing personalized, actionable daily tips. Be encouraging, specific, and science-based. Keep tips concise and practical.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const tip = data.choices[0].message.content;

      // Save the insight to database
      await DatabaseService.saveAIInsight(userId, {
        type: 'daily_tip',
        content: tip,
        data: {
          userContext: userContext,
          timestamp: new Date().toISOString(),
        },
        confidenceScore: 0.9,
        isPremium: false,
      });

      return { tip, error: null };
    } catch (error) {
      console.error('Generate daily tip error:', error);
      return { tip: null, error: error.message };
    }
  }

  // Build daily tip prompt
  static buildDailyTipPrompt(userContext) {
    return `
Generate a personalized daily tip for height growth based on this user context:

Current Status:
- Age: ${userContext.age} years
- Current Height: ${userContext.currentHeight} cm
- Target Height: ${userContext.targetHeight} cm

Recent Habits:
- Sleep: ${userContext.sleepStreak} day streak
- Exercise: ${userContext.exerciseStreak} day streak
- Nutrition: ${userContext.nutritionScore}/100
- Posture: ${userContext.postureHours} hours yesterday

Current Challenges:
- ${userContext.barriers?.join(', ') || 'None specified'}

Recent Progress:
- Height Growth: ${userContext.recentGrowth} cm
- Habit Consistency: ${userContext.habitConsistency}%

Provide one specific, actionable tip that addresses their current situation and helps them progress toward their height goals. Make it encouraging and practical.
    `.trim();
  }

  // =============================================
  // PROGRESS ANALYSIS
  // =============================================

  // Analyze user progress and provide insights
  static async analyzeProgress(userId, progressData) {
    try {
      const prompt = this.buildProgressAnalysisPrompt(progressData);
      
      const response = await fetch(`${API_ENDPOINTS.OPENAI}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a height growth analyst. Analyze user progress data and provide insights, patterns, and recommendations for improvement.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 400,
          temperature: 0.6,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;

      // Save the insight to database
      await DatabaseService.saveAIInsight(userId, {
        type: 'progress_analysis',
        content: analysis,
        data: {
          progressData: progressData,
          timestamp: new Date().toISOString(),
        },
        confidenceScore: 0.85,
        isPremium: true,
      });

      return { analysis, error: null };
    } catch (error) {
      console.error('Analyze progress error:', error);
      return { analysis: null, error: error.message };
    }
  }

  // Build progress analysis prompt
  static buildProgressAnalysisPrompt(progressData) {
    return `
Analyze this user's height growth progress and provide insights:

Time Period: ${progressData.period} (${progressData.startDate} to ${progressData.endDate})

Height Changes:
- Starting Height: ${progressData.startHeight} cm
- Current Height: ${progressData.currentHeight} cm
- Growth: ${progressData.totalGrowth} cm

Habit Performance:
- Sleep: ${progressData.sleepConsistency}% consistency, ${progressData.sleepStreak} day streak
- Exercise: ${progressData.exerciseConsistency}% consistency, ${progressData.exerciseStreak} day streak
- Nutrition: ${progressData.nutritionConsistency}% consistency, avg score ${progressData.avgNutritionScore}/100
- Posture: ${progressData.postureConsistency}% consistency, avg ${progressData.avgPostureHours} hours/day

Exercise Completions:
- Total: ${progressData.totalExercises} exercises
- Categories: ${progressData.exerciseCategories}

Nutrition Scans:
- Total: ${progressData.totalFoodScans} scans
- Avg Growth Score: ${progressData.avgGrowthScore}/100

Provide:
1. Progress summary
2. Key patterns and trends
3. Strengths and areas for improvement
4. Specific recommendations
5. Growth potential assessment
    `.trim();
  }

  // =============================================
  // CONTENT MODERATION
  // =============================================

  // Moderate community content
  static async moderateContent(content, contentType = 'post') {
    try {
      const response = await fetch(`${API_ENDPOINTS.OPENAI}/moderations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: content,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI moderation API error: ${response.status}`);
      }

      const data = await response.json();
      const moderation = data.results[0];

      const result = {
        flagged: moderation.flagged,
        categories: moderation.categories,
        categoryScores: moderation.category_scores,
        confidence: Math.max(...Object.values(moderation.category_scores)),
        action: this.determineModerationAction(moderation, contentType),
      };

      return { result, error: null };
    } catch (error) {
      console.error('Moderate content error:', error);
      return { result: null, error: error.message };
    }
  }

  // Determine moderation action based on scores
  static determineModerationAction(moderation, contentType) {
    const threshold = MODERATION_THRESHOLDS[contentType.toUpperCase()] || 0.8;
    const maxScore = Math.max(...Object.values(moderation.category_scores));
    
    if (maxScore >= threshold) {
      return 'rejected';
    } else if (maxScore >= 0.5) {
      return 'flagged';
    } else {
      return 'approved';
    }
  }

  // =============================================
  // NUTRITION ADVICE
  // =============================================

  // Generate nutrition advice based on food scans
  static async generateNutritionAdvice(userId, nutritionData) {
    try {
      const prompt = this.buildNutritionAdvicePrompt(nutritionData);
      
      const response = await fetch(`${API_ENDPOINTS.OPENAI}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a nutrition expert specializing in height growth. Provide specific, actionable nutrition advice based on user food intake data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const advice = data.choices[0].message.content;

      // Save the insight to database
      await DatabaseService.saveAIInsight(userId, {
        type: 'nutrition_advice',
        content: advice,
        data: {
          nutritionData: nutritionData,
          timestamp: new Date().toISOString(),
        },
        confidenceScore: 0.8,
        isPremium: false,
      });

      return { advice, error: null };
    } catch (error) {
      console.error('Generate nutrition advice error:', error);
      return { advice: null, error: error.message };
    }
  }

  // Build nutrition advice prompt
  static buildNutritionAdvicePrompt(nutritionData) {
    return `
Analyze this user's nutrition data and provide growth-focused advice:

Daily Intake:
- Calories: ${nutritionData.calories} kcal
- Protein: ${nutritionData.protein}g
- Carbs: ${nutritionData.carbs}g
- Fat: ${nutritionData.fat}g
- Fiber: ${nutritionData.fiber}g
- Calcium: ${nutritionData.calcium}mg
- Vitamin D: ${nutritionData.vitaminD} IU

Recent Food Scans:
- Total Scans: ${nutritionData.totalScans}
- Avg Growth Score: ${nutritionData.avgGrowthScore}/100
- Top Categories: ${nutritionData.topCategories?.join(', ') || 'N/A'}

User Profile:
- Age: ${nutritionData.age} years
- Height: ${nutritionData.height} cm
- Target: ${nutritionData.targetHeight} cm

Provide:
1. Nutrition assessment
2. Growth-supporting recommendations
3. Specific foods to add/avoid
4. Meal timing suggestions
5. Supplement recommendations (if needed)
    `.trim();
  }

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================

  // Calculate confidence score for predictions
  static calculateConfidenceScore(userData) {
    let score = 0.5; // Base score

    // Age factor (younger = higher confidence)
    if (userData.age < 18) score += 0.2;
    else if (userData.age < 25) score += 0.1;

    // Data completeness
    if (userData.parentHeightFather && userData.parentHeightMother) score += 0.1;
    if (userData.currentHeight && userData.targetHeight) score += 0.1;
    if (userData.recentGrowth !== undefined) score += 0.1;

    return Math.min(score, 1.0);
  }

  // Check if user has reached rate limit
  static async checkAIRateLimit(userId, isPremium = false) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await DatabaseService.getAIInsights(userId, null, 1000);
      
      if (error) {
        return { canUse: true, remaining: 50 };
      }

      const todayUsage = data.filter(insight => 
        insight.created_at.startsWith(today)
      ).length;

      const limit = isPremium ? -1 : 10; // Unlimited for premium
      const remaining = limit === -1 ? -1 : Math.max(0, limit - todayUsage);

      return { canUse: remaining !== 0, remaining };
    } catch (error) {
      console.error('Check AI rate limit error:', error);
      return { canUse: true, remaining: 50 };
    }
  }

  // Generate batch insights for multiple users
  static async generateBatchInsights(userIds, insightType) {
    try {
      const insights = [];
      
      for (const userId of userIds) {
        try {
          let result;
          switch (insightType) {
            case 'daily_tip':
              result = await this.generateDailyTip(userId, {});
              break;
            case 'height_prediction':
              result = await this.generateHeightPrediction(userId, {});
              break;
            default:
              continue;
          }
          
          if (result.error) {
            console.error(`Batch insight error for user ${userId}:`, result.error);
          } else {
            insights.push({ userId, insight: result });
          }
        } catch (error) {
          console.error(`Batch insight error for user ${userId}:`, error);
        }
      }

      return { insights, error: null };
    } catch (error) {
      console.error('Generate batch insights error:', error);
      return { insights: [], error: error.message };
    }
  }
}

// Export individual functions for backward compatibility
export const generateHeightPrediction = AIService.generateHeightPrediction;
export const generateDailyTip = AIService.generateDailyTip;
export const analyzeProgress = AIService.analyzeProgress;
export const moderateContent = AIService.moderateContent;
export const generateNutritionAdvice = AIService.generateNutritionAdvice;
export const checkAIRateLimit = AIService.checkAIRateLimit;
export const generateBatchInsights = AIService.generateBatchInsights;

export default AIService;
