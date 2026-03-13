import { OPENAI_API_KEY } from '../config/apiKeys';

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateDailyTasks = async (userProfile = {}) => {
  try {
    const prompt = `Generate 4 science-based daily height growth tasks for a person focused on maximizing their height potential.

    SCIENTIFIC FOUNDATION:
    - Growth hormone peaks during deep sleep (10pm-2am)
    - Protein (1.2g/kg body weight) and calcium (1000mg) are essential for bone growth
    - Stretching, hanging, and swimming can decompress the spine
    - Proper posture can add 1-2 inches of apparent height
    - Chronic stress increases cortisol, inhibiting growth hormone

    TASK CATEGORIES (select 4 different ones):
    1. SLEEP: Optimize sleep quality, duration (8-9 hours), and timing
    2. NUTRITION: Focus on protein, calcium, vitamin D, zinc, and hydration
    3. EXERCISE: Stretching, hanging, swimming, resistance training
    4. POSTURE: Spinal alignment, ergonomic setup, posture exercises
    5. RECOVERY: Stress management, meditation, breathing exercises
    6. MEASUREMENT: Track progress, set goals, monitor results

    REQUIREMENTS:
    - Each task must be specific, actionable, and achievable today
    - Include scientific reasoning for each task
    - Tasks should be 5-30 minutes (except sleep tasks)
    - No medical claims or supplement recommendations
    - Focus on lifestyle habits that support growth

    Return the response as a JSON array with this exact format:
    [
      {
        "id": 1,
        "title": "Specific task title",
        "emoji": "relevant emoji",
        "category": "sleep|nutrition|exercise|posture|recovery|measurement",
        "description": "Detailed instruction with scientific benefit",
        "estimated_time": "5 minutes|10 minutes|15 minutes|20 minutes|30 minutes|Tonight",
        "science": "Brief scientific explanation of why this helps height growth"
      }
    ]

    Make each task practical, science-based, and focused on real height growth results.`;

    const response = await fetch(CHATGPT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from ChatGPT API');
    }

    // Parse the JSON response
    const tasks = JSON.parse(content);

    // Validate the response format
    if (!Array.isArray(tasks) || tasks.length !== 4) {
      throw new Error('Invalid task format received from ChatGPT API');
    }

    return tasks;
  } catch (error) {
    console.error('Error generating daily tasks with ChatGPT:', error);

    // Fallback to predefined tasks if API fails
    return getFallbackTasks();
  }
};

const getFallbackTasks = () => {
  return [
    {
      id: 1,
      title: 'Protein Breakfast',
      emoji: '🥚',
      category: 'nutrition',
      description: 'Eat 25g+ protein within 1 hour of waking (eggs, Greek yogurt, protein shake)',
      estimated_time: '10 minutes',
      science: 'Morning protein supports muscle and bone growth throughout the day',
      completed: false
    },
    {
      id: 2,
      title: 'Sleep Schedule',
      emoji: '🛏️',
      category: 'sleep',
      description: 'Set consistent bedtime and wake time for 8-9 hours of sleep',
      estimated_time: 'Tonight',
      science: 'Consistent sleep schedule regulates growth hormone production',
      completed: false
    },
    {
      id: 3,
      title: 'Posture Check',
      emoji: '🧍',
      category: 'posture',
      description: 'Stand against wall: heels, glutes, shoulders, head touching. Hold 60 seconds',
      estimated_time: '5 minutes',
      science: 'Wall exercises help establish proper spinal alignment',
      completed: false
    },
    {
      id: 4,
      title: 'Deep Breathing',
      emoji: '🌬️',
      category: 'recovery',
      description: 'Practice 4-4-4-4 breathing for 5 minutes to reduce stress',
      estimated_time: '5 minutes',
      science: 'Deep breathing reduces cortisol and promotes relaxation',
      completed: false
    },
  ];
};

export const generatePersonalizedTasks = async (userProfile) => {
  try {
    const { age, currentHeight, targetHeight, preferences = {} } = userProfile;

    const prompt = `Generate 4 personalized, science-based daily height growth tasks for a ${age}-year-old person who is currently ${currentHeight} and wants to reach ${targetHeight}.

    USER PROFILE:
    - Age: ${age} years old
    - Current Height: ${currentHeight}
    - Target Height: ${targetHeight}
    - Preferences: ${JSON.stringify(preferences)}

    SCIENTIFIC CONSIDERATIONS:
    - Growth plates typically close by age 18-21 in males, 16-18 in females
    - After growth plate closure, focus on posture, spinal decompression, and apparent height
    - Nutrition needs vary by age and activity level
    - Exercise intensity should match physical development stage

    PERSONALIZATION FACTORS:
    - Age-appropriate exercise intensity and type
    - Realistic growth expectations based on age
    - Nutritional needs for current life stage
    - Safe progression for physical development
    - Lifestyle factors and preferences

    Return the response as a JSON array with this exact format:
    [
      {
        "id": 1,
        "title": "Personalized task title",
        "emoji": "relevant emoji",
        "category": "sleep|nutrition|exercise|posture|recovery|measurement",
        "description": "Specific instruction tailored to their age and goals",
        "estimated_time": "5 minutes|10 minutes|15 minutes|20 minutes|30 minutes|Tonight",
        "science": "Age-appropriate scientific explanation",
        "personalization": "Why this task is specifically good for their situation"
      }
    ]

    Make each task realistic, safe, and specifically beneficial for their age and goals.`;

    const response = await fetch(CHATGPT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from ChatGPT API');
    }

    const tasks = JSON.parse(content);

    if (!Array.isArray(tasks) || tasks.length !== 4) {
      throw new Error('Invalid task format received from ChatGPT API');
    }

    return tasks;
  } catch (error) {
    console.error('Error generating personalized tasks with ChatGPT:', error);
    return getFallbackTasks();
  }
};
