import {
  useFonts,
  RobotoCondensed_400Regular,
  RobotoCondensed_700Bold,
} from "@expo-google-fonts/roboto-condensed";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';
import {
  TrendingUp,
  Calendar,
  Camera,
  BarChart3,
} from "lucide-react-native";
import { useState, useEffect } from "react";
import ScreenContainer from "../components/ScreenContainer";
import { useTheme } from "../hooks/useTheme";

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const screenHeight = Dimensions.get('window').height;
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Weekly plan state
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null); // 0..6
  const [plan, setPlan] = useState(null);
  const [streak, setStreak] = useState(0);

  const [fontsLoaded] = useFonts({
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });

  useEffect(() => {
    fetchMeasurements();
    initializePlan();
  }, []);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      // Mock data for now since we don't have API endpoints
      setMeasurements([
        { height_inches: 68.5, measurement_date: "2024-01-15" },
        { height_inches: 68.0, measurement_date: "2024-01-01" },
        { height_inches: 67.8, measurement_date: "2024-12-15" }
      ]);
    } catch (err) {
      console.error("Error fetching measurements:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  if (!fontsLoaded) {
    return null;
  }

  const formatHeight = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = (inches % 12).toFixed(1);
    return `${feet}'${remainingInches}"`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const calculateChange = (current, previous) => {
    if (!previous) return "baseline";
    const diff = current - previous;
    return diff > 0 ? `+${diff.toFixed(1)}"` : `${diff.toFixed(1)}"`;
  };

  const progressStats = [
    {
      title: "Height Growth",
      value:
        measurements.length > 0
          ? formatHeight(measurements[0].height_inches)
          : "N/A",
      period: "Latest",
      trend: "up",
      color: colors.success,
    },
    {
      title: "Monthly Change",
      value:
        measurements.length > 1
          ? calculateChange(
              measurements[0].height_inches,
              measurements[measurements.length - 1].height_inches,
            )
          : "N/A",
      period: "This period",
      trend: "up",
      color: colors.accent,
    },
    {
      title: "Total Logs",
      value: `${measurements.length}`,
      period: "All time",
      trend: "up",
      color: colors.warning,
    },
  ];

  const recentMeasurements = measurements.map((measurement, index) => ({
    date: formatDate(measurement.measurement_date),
    height: formatHeight(measurement.height_inches),
    change:
      index < measurements.length - 1
        ? calculateChange(
            measurement.height_inches,
            measurements[index + 1].height_inches,
          )
        : "baseline",
  }));

  // -------- Weekly Plan Logic --------
  const PLAN_STORAGE_KEY = 'ph_weekly_plan_v1';
  const STREAK_KEY = 'ph_weekly_streak_v1';
  // Toggle persistence on/off. Set to false to run purely frontend with no storage.
  const PERSIST_ENABLED = false;

  const safeSetItem = async (key, value) => {
    try {
      if (!PERSIST_ENABLED) return;
      let str;
      if (typeof value === 'string') {
        str = value;
      } else {
        str = JSON.stringify(value);
      }
      if (str == null) {
        // Never pass null/undefined to AsyncStorage
        str = JSON.stringify({});
      }
      await AsyncStorage.setItem(key, str);
    } catch (e) {
      console.error('AsyncStorage setItem failed for key', key, e);
    }
  };

  const defaultDayBlocks = () => ([
    {
      id: 'stretching',
      title: 'Stretching & Posture',
      tasks: [
        { id: 'seated_twist', title: 'Seated twist 1 min', done: false },
        { id: 'pigeon', title: 'Pigeon both sides', done: false },
      ],
    },
    {
      id: 'sleep',
      title: 'Sleep Habits',
      tasks: [
        { id: 'screens_off', title: 'Screens off 30m before bed', done: false },
        { id: 'bedtime', title: 'Fixed bedtime', done: false },
      ],
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      tasks: [
        { id: 'water', title: 'Drink 8 glasses water', done: false },
        { id: 'protein', title: 'Hit protein goal', done: false },
      ],
    },
  ]);

  const generateDefaultPlan = () => {
    const weeks = 4;
    const daysPerWeek = 7;
    const baseDate = new Date();
    // Normalize to start of today
    baseDate.setHours(0,0,0,0);

    const planObj = {
      weeks: Array.from({ length: weeks }, (_, w) => ({
        weekNumber: w + 1,
        days: Array.from({ length: daysPerWeek }, (_, d) => ({
          index: d,
          // Date label moves forward for each absolute day from today for week 1,
          // and sequentially for later weeks (preview only)
          date: new Date(baseDate.getTime() + (w * daysPerWeek + d) * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          locked: w > 0, // Only week 1 unlocked by default
          blocks: defaultDayBlocks(),
        })),
      })),
    };
    return planObj;
  };

  async function initializePlan() {
    try {
      if (!PERSIST_ENABLED) {
        const generated = generateDefaultPlan();
        setPlan(generated);
        setStreak(0);
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
      setStreak(savedStreak ? parseInt(savedStreak) : 0);
    } catch (e) {
      console.error('initializePlan error', e);
    }
  }

  const persistPlan = async (nextPlan) => {
    setPlan(nextPlan);
    await safeSetItem(PLAN_STORAGE_KEY, nextPlan);
  };

  const formatDayLabel = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

    // Mark all tasks done and complete day
    day.blocks.forEach(b => b.tasks.forEach(t => t.done = true));
    day.completed = true;

    // If all days in week completed, unlock next week
    const allDaysDone = week.days.every(d => d.completed);
    if (allDaysDone && next.weeks[weekIdx + 1]) {
      next.weeks[weekIdx + 1].days.forEach(d => d.locked = false);
    }

    // Update streak if this day is today
    try {
      const todayKey = new Date().toDateString();
      const dayKey = new Date(day.date).toDateString();
      if (todayKey === dayKey) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        await safeSetItem(STREAK_KEY, String(nextStreak));
      }
    } catch {}

    await persistPlan(next);
  };

  return (
    <ScreenContainer>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: screenHeight > 700 ? 100 : 40,
          minHeight: '100%'
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: insets.top + 20,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "RobotoCondensed_700Bold",
              fontSize: 28,
              color: colors.textPrimary,
            }}
          >
            Progress
          </Text>
          <Text
            style={{
              fontFamily: "RobotoCondensed_400Regular",
              fontSize: 16,
              color: colors.textSecondary,
              marginTop: 4,
            }}
          >
            Track your growth journey - Peak Height
          </Text>
        </View>

        {/* Progress Overview */}
        <View
          style={{
            paddingHorizontal: 24,
            marginBottom: 32,
          }}
        >
          <Text
            style={{
              fontFamily: "RobotoCondensed_700Bold",
              fontSize: 20,
              color: colors.textPrimary,
              marginBottom: 16,
            }}
          >
            Overview
          </Text>

          <View style={{ gap: 16 }}>
            {progressStats.map((stat, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "RobotoCondensed_400Regular",
                      fontSize: 14,
                      color: colors.textSecondary,
                    }}
                  >
                    {stat.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "RobotoCondensed_700Bold",
                      fontSize: 24,
                      color: colors.textPrimary,
                      marginTop: 2,
                    }}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "RobotoCondensed_400Regular",
                      fontSize: 12,
                      color: colors.textSecondary,
                      marginTop: 2,
                    }}
                  >
                    {stat.period}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: stat.color + "20",
                    borderRadius: 8,
                    padding: 8,
                  }}
                >
                  <TrendingUp size={20} color={stat.color} />
                </View>
              </View>
            ))}
          </View>
        </View>


        {/* Weekly Plan */}
        <View
          style={{
            paddingHorizontal: 24,
            marginBottom: 32,
          }}
        >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "RobotoCondensed_700Bold",
                  fontSize: 20,
                  color: colors.textPrimary,
                }}
              >
                Weekly Plan
              </Text>

              {/* Week Selector */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(plan ? plan.weeks : [{ weekNumber: 1 }]).map((w, idx) => (
                  <TouchableOpacity
                    key={w.weekNumber}
                    onPress={() => plan && setSelectedWeek(w.weekNumber)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor:
                        selectedWeek === w.weekNumber ? colors.accent : colors.surface,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "RobotoCondensed_700Bold",
                        color: selectedWeek === w.weekNumber
                          ? colors.surfaceElevated
                          : colors.textPrimary,
                      }}
                    >
                      Week {w.weekNumber}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Days */}
            <View style={{ gap: 12 }}>
              {!plan && (
                <View style={{ gap: 12 }}>
                  <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16 }}>
                    <Text style={{ fontFamily: 'RobotoCondensed_700Bold', fontSize: 16, color: colors.textPrimary }}>
                      Week 1 (Preview)
                    </Text>
                    <Text style={{ marginTop: 4, fontFamily: 'RobotoCondensed_400Regular', color: colors.textSecondary }}>
                      Tap days to view tasks once plan loads
                    </Text>
                  </View>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <View key={idx} style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16 }}>
                      <Text style={{ fontFamily: 'RobotoCondensed_700Bold', color: colors.textPrimary }}>Day {idx + 1} – Pending</Text>
                      <Text style={{ fontFamily: 'RobotoCondensed_400Regular', color: colors.textSecondary, marginTop: 4 }}>
                        Stretching • Sleep • Nutrition
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              {plan && plan.weeks[selectedWeek - 1].days.map((d, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedDayIndex(selectedDayIndex === idx ? null : idx)}
                  disabled={d.locked}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 16,
                    opacity: d.locked ? 0.6 : 1,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={{ fontFamily: 'RobotoCondensed_700Bold', fontSize: 16, color: colors.textPrimary }}>
                        Day {idx + 1} – {formatDayLabel(d.date)}
                      </Text>
                      <Text style={{ fontFamily: 'RobotoCondensed_400Regular', fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                        {d.completed ? 'Completed ✅' : (d.locked ? 'Locked 🔒' : 'Pending')}
                      </Text>
                    </View>
                    <Text style={{ color: colors.textSecondary }}>
                      {selectedDayIndex === idx ? 'Hide' : 'View'}
                    </Text>
                  </View>

                  {/* Daily Blocks */}
                  {selectedDayIndex === idx && (
                    <View style={{ marginTop: 12, gap: 12 }}>
                      {d.blocks.map((b) => (
                        <View key={b.id} style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12 }}>
                          <Text style={{ fontFamily: 'RobotoCondensed_700Bold', color: colors.textPrimary, marginBottom: 8 }}>{b.title}</Text>
                          {b.tasks.map((t) => (
                            <TouchableOpacity
                              key={t.id}
                              onPress={() => toggleTask(selectedWeek - 1, idx, b.id, t.id)}
                              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
                              disabled={d.locked}
                            >
                              <View style={{
                                width: 20, height: 20, borderRadius: 10, borderWidth: 2,
                                borderColor: colors.accent, marginRight: 12,
                                backgroundColor: t.done ? colors.accent : 'transparent',
                                justifyContent: 'center', alignItems: 'center'
                              }}>
                                {t.done && (
                                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                                )}
                              </View>
                              <Text style={{ fontFamily: 'RobotoCondensed_400Regular', color: t.done ? colors.textSecondary : colors.textPrimary, textDecorationLine: t.done ? 'line-through' : 'none' }}>
                                {t.title}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ))}

                      {!d.completed && !d.locked && (
                        <TouchableOpacity
                          onPress={() => completeDay(selectedWeek - 1, idx)}
                          style={{
                            marginTop: 4,
                            backgroundColor: colors.accent,
                            paddingVertical: 12,
                            borderRadius: 10,
                            alignItems: 'center'
                          }}
                        >
                          <Text style={{ fontFamily: 'RobotoCondensed_700Bold', color: colors.surfaceElevated }}>Complete Day</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
        </View>

        {/* Height Chart Placeholder */}
        <View
          style={{
            paddingHorizontal: 24,
            marginBottom: 32,
          }}
        >
          {/* Weekly Summary */}
          {plan && (
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontFamily: 'RobotoCondensed_700Bold', fontSize: 20, color: colors.textPrimary }}>
                  Weekly Summary
                </Text>
                <Text style={{ fontFamily: 'RobotoCondensed_400Regular', color: colors.textSecondary }}>
                  Week {selectedWeek}
                </Text>
              </View>

              {(() => {
                const week = plan.weeks[selectedWeek - 1];
                const totalDays = week.days.length;
                const completedDays = week.days.filter(d => d.completed).length;
                const completionPct = Math.round((completedDays / totalDays) * 100);

                // tasks stats
                const totalTasks = week.days.reduce((sum, d) => sum + d.blocks.reduce((s, b) => s + b.tasks.length, 0), 0);
                const completedTasks = week.days.reduce((sum, d) => sum + d.blocks.reduce((s, b) => s + b.tasks.filter(t => t.done).length, 0), 0);

                return (
                  <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16 }}>
                    {/* Ring progress */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                      {(() => {
                        const size = 72;
                        const stroke = 8;
                        const radius = (size - stroke) / 2;
                        const circumference = 2 * Math.PI * radius;
                        const dashOffset = circumference * (1 - completionPct / 100);
                        return (
                          <Svg width={size} height={size}>
                            <Circle cx={size/2} cy={size/2} r={radius} stroke={colors.border} strokeWidth={stroke} fill="none" />
                            <Circle
                              cx={size/2}
                              cy={size/2}
                              r={radius}
                              stroke={colors.accent}
                              strokeWidth={stroke}
                              strokeDasharray={`${circumference} ${circumference}`}
                              strokeDashoffset={dashOffset}
                              strokeLinecap="round"
                              fill="none"
                            />
                          </Svg>
                        );
                      })()}
                      <View style={{ marginLeft: 14 }}>
                        <Text style={{ fontFamily: 'RobotoCondensed_700Bold', color: colors.textPrimary, fontSize: 18 }}>
                          {completionPct}% complete
                        </Text>
                        <Text style={{ fontFamily: 'RobotoCondensed_400Regular', color: colors.textSecondary }}>
                          {completedDays}/{totalDays} days
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View>
                        <Text style={{ fontFamily: 'RobotoCondensed_400Regular', color: colors.textSecondary }}>Tasks</Text>
                        <Text style={{ fontFamily: 'RobotoCondensed_700Bold', color: colors.textPrimary }}>{completedTasks}/{totalTasks}</Text>
                      </View>
                      <View>
                        <Text style={{ fontFamily: 'RobotoCondensed_400Regular', color: colors.textSecondary }}>Streak</Text>
                        <Text style={{ fontFamily: 'RobotoCondensed_700Bold', color: colors.textPrimary }}>🔥 {streak}</Text>
                      </View>
                    </View>

                    {/* Start next week CTA */}
                    {completedDays === totalDays && plan.weeks[selectedWeek] && plan.weeks[selectedWeek].days.every(d => d.locked) && (
                      <TouchableOpacity
                        onPress={() => setSelectedWeek(selectedWeek + 1)}
                        style={{ marginTop: 12, backgroundColor: colors.accent, paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}
                      >
                        <Text style={{ fontFamily: 'RobotoCondensed_700Bold', color: colors.surfaceElevated }}>
                          Start Week {selectedWeek + 1}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })()}
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "RobotoCondensed_700Bold",
                fontSize: 20,
                color: colors.textPrimary,
              }}
            >
              Height Chart
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <BarChart3 size={16} color={colors.textSecondary} />
              <Text
                style={{
                  fontFamily: "RobotoCondensed_400Regular",
                  fontSize: 14,
                  color: colors.textSecondary,
                }}
              >
                View Chart
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 20,
              height: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BarChart3 size={48} color={colors.textSecondary} />
            <Text
              style={{
                fontFamily: "RobotoCondensed_700Bold",
                fontSize: 16,
                color: colors.textPrimary,
                marginTop: 12,
              }}
            >
              Height Progress Chart
            </Text>
            <Text
              style={{
                fontFamily: "RobotoCondensed_400Regular",
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Track your growth over time
            </Text>
          </View>
        </View>



      </ScrollView>

      {/* Floating Action Button for Chat */}
      <TouchableOpacity style={styles.fabButton}>
        <View style={styles.fabGradient}>
          <Icon name="chatbubble" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    alignItems: 'center',
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
