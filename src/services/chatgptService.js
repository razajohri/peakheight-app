import { OPENAI_API_KEY } from '../config/apiKeys';

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateDailyTasks = async (userProfile = {}) => {
  try {
    const prompt = `Generate 5 daily height growth tasks for a person focused on increasing their height.
    The tasks should be practical, achievable, and related to height growth activities like:
    - Physical exercises and stretches
    - Nutrition and supplements
    - Sleep and recovery
    - Posture improvement
    - Lifestyle habits

    Return the response as a JSON array with this exact format:
    [
      {
        "id": 1,
        "title": "Task description",
        "emoji": "relevant emoji",
        "completed": false
      }
    ]

    Make sure each task is specific, actionable, and includes an appropriate emoji.`;

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
    if (!Array.isArray(tasks) || tasks.length !== 5) {
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
    { id: 1, title: 'Morning stretching routine (15 min)', emoji: '🤸', completed: false },
    { id: 2, title: 'Drink protein shake with calcium', emoji: '🥤', completed: false },
    { id: 3, title: 'Take height growth supplements', emoji: '💊', completed: false },
    { id: 4, title: 'Practice good posture exercises', emoji: '🧘', completed: false },
    { id: 5, title: 'Get 8+ hours of quality sleep', emoji: '😴', completed: false },
  ];
};

export const generatePersonalizedTasks = async (userProfile) => {
  try {
    const { age, currentHeight, targetHeight, preferences = {} } = userProfile;

    const prompt = `Generate 5 personalized daily height growth tasks for a ${age}-year-old person who is currently ${currentHeight} and wants to reach ${targetHeight}.

    Consider these preferences: ${JSON.stringify(preferences)}

    Focus on:
    - Age-appropriate exercises
    - Nutrition tailored to their goals
    - Realistic timeline expectations
    - Safe and effective methods

    Return the response as a JSON array with this exact format:
    [
      {
        "id": 1,
        "title": "Specific task description",
        "emoji": "relevant emoji",
        "completed": false
      }
    ]

    Make each task specific, measurable, and achievable for their situation.`;

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

    if (!Array.isArray(tasks) || tasks.length !== 5) {
      throw new Error('Invalid task format received from ChatGPT API');
    }

    return tasks;
  } catch (error) {
    console.error('Error generating personalized tasks with ChatGPT:', error);
    return getFallbackTasks();
  }
};
