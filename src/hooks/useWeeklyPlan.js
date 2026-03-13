import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Manages local weekly plan prototype used in DailyRoutineScreen
export function useWeeklyPlan() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [plan, setPlan] = useState(null);
  const [weeklyStreak, setWeeklyStreak] = useState(0);

  const PLAN_STORAGE_KEY = 'ph_weekly_plan_v1';
  const STREAK_KEY = 'ph_weekly_streak_v1';
  const PERSIST_ENABLED = false;

  const safeSetItem = async (key, value) => {
    try {
      if (!PERSIST_ENABLED) return;
      const str = typeof value === 'string' ? value : JSON.stringify(value ?? {});
      await AsyncStorage.setItem(key, str);
    } catch (e) {
      console.error('AsyncStorage setItem failed for key', key, e);
    }
  };

  const defaultDayBlocks = () => ([
    { id: 'stretching', title: 'Stretching & Posture', tasks: [
      { id: 'seated_twist', title: 'Seated twist 1 min', done: false },
      { id: 'pigeon', title: 'Pigeon both sides', done: false },
    ]},
    { id: 'sleep', title: 'Sleep Habits', tasks: [
      { id: 'screens_off', title: 'Screens off 30m before bed', done: false },
      { id: 'bedtime', title: 'Fixed bedtime', done: false },
    ]},
    { id: 'nutrition', title: 'Nutrition', tasks: [
      { id: 'water', title: 'Drink 8 glasses water', done: false },
      { id: 'protein', title: 'Hit protein goal', done: false },
    ]},
  ]);

  const generateDefaultPlan = () => {
    const weeks = 4;
    const daysPerWeek = 7;
    const baseDate = new Date();
    baseDate.setHours(0,0,0,0);
    return {
      weeks: Array.from({ length: weeks }, (_, w) => ({
        weekNumber: w + 1,
        days: Array.from({ length: daysPerWeek }, (_, d) => ({
          index: d,
          date: new Date(baseDate.getTime() + (w * daysPerWeek + d) * 86400000).toISOString(),
          completed: false,
          locked: w > 0,
          blocks: defaultDayBlocks(),
        })),
      })),
    };
  };

  const initializeWeeklyPlan = async () => {
    try {
      if (!PERSIST_ENABLED) {
        setPlan(generateDefaultPlan());
        setWeeklyStreak(0);
        return;
      }
      const saved = await AsyncStorage.getItem(PLAN_STORAGE_KEY);
      const savedStreak = await AsyncStorage.getItem(STREAK_KEY);
      if (saved) {
        setPlan(JSON.parse(saved));
      } else {
        const generated = generateDefaultPlan();
        setPlan(generated);
        await safeSetItem(PLAN_STORAGE_KEY, generated);
      }
      setWeeklyStreak(savedStreak ? parseInt(savedStreak) : 0);
    } catch (e) {
      console.error('initializeWeeklyPlan error', e);
    }
  };

  const persistPlan = async (nextPlan) => {
    setPlan(nextPlan);
    await safeSetItem(PLAN_STORAGE_KEY, nextPlan);
  };

  const toggleTask = (weekIdx, dayIdx, blockId, taskId) => {
    if (!plan) return;
    const next = { ...plan };
    const day = next.weeks[weekIdx].days[dayIdx];
    if (day.locked) return;
    const block = day.blocks.find(b => b.id === blockId);
    if (!block) return;
    const task = block.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.done = !task.done;
    persistPlan(next);
  };

  const completeDay = async (weekIdx, dayIdx) => {
    if (!plan) return;
    const next = { ...plan };
    const week = next.weeks[weekIdx];
    const day = week.days[dayIdx];
    if (day.locked) return;
    day.blocks.forEach(b => b.tasks.forEach(t => t.done = true));
    day.completed = true;
    const allDaysDone = week.days.every(d => d.completed);
    if (allDaysDone && next.weeks[weekIdx + 1]) {
      next.weeks[weekIdx + 1].days.forEach(d => d.locked = false);
    }
    try {
      const todayKey = new Date().toDateString();
      const dayKey = new Date(day.date).toDateString();
      if (todayKey === dayKey) {
        const nextStreak = weeklyStreak + 1;
        setWeeklyStreak(nextStreak);
        await safeSetItem(STREAK_KEY, String(nextStreak));
      }
    } catch {}
    await persistPlan(next);
  };

  return {
    // state
    selectedWeek,
    setSelectedWeek,
    selectedDayIndex,
    setSelectedDayIndex,
    plan,
    weeklyStreak,
    // actions
    initializeWeeklyPlan,
    toggleTask,
    completeDay,
  };
}
