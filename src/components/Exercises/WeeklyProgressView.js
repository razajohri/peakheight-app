import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import Icon from '../UI/Icon';
import { useUser } from '../../contexts/UserContext';
import { CustomExercisePlanService } from '../../services/customExercisePlanService';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const WeeklyProgressView = ({ styles, onExerciseSelect, onTodayListUpdate, completedExercises = new Set() }) => {
  const { userProfile, userProgress } = useUser();
  const [todayExercises, setTodayExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userProfile && userProgress) {
      loadTodayExercises();
    }
  }, [userProfile, userProgress]);

  const loadTodayExercises = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Get user's exercise plan and generate today's exercises based on current day
      const exercisePlan = await CustomExercisePlanService.getUserExercisePlan(userProfile.id);

      // Update the exercise plan with the real current day from user progress
      const updatedPlan = await CustomExercisePlanService.updateUserExercisePlan(userProfile.id, {
        current_day: userProgress.current_day,
        phase: CustomExercisePlanService.getPhaseForDay(userProgress.current_day)
      });

      // Generate today's exercises based on the real current day
      const exercises = CustomExercisePlanService.generateDailyExercises(
        userProgress.current_day,
        CustomExercisePlanService.getPhaseForDay(userProgress.current_day)
      );

      setTodayExercises(exercises);
      if (typeof onTodayListUpdate === 'function') {
        onTodayListUpdate(exercises);
      }
    } catch (error) {
      console.error('Error loading today exercises:', error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const onRefresh = useCallback(() => {
    loadTodayExercises(true);
  }, [userProfile, userProgress]);

  const getDaysLeft = () => {
    if (!userProgress) return 0;
    return Math.max(0, 120 - userProgress.current_day + 1);
  };

  const getCurrentWeek = () => {
    if (!userProgress) return 1;
    return Math.ceil(userProgress.current_day / 7);
  };

  const getCurrentDayInWeek = () => {
    if (!userProgress) return 1;
    return ((userProgress.current_day - 1) % 7) + 1;
  };

  const isDayCompleted = (week, day) => {
    if (!userProgress) return false;
    const dayNumber = (week - 1) * 7 + day;
    return dayNumber < userProgress.current_day;
  };

  const isCurrentDay = (week, day) => {
    if (!userProgress) return false;
    const dayNumber = (week - 1) * 7 + day;
    return dayNumber === userProgress.current_day;
  };

  const isDayLocked = (week, day) => {
    if (!userProgress) return false;
    const dayNumber = (week - 1) * 7 + day;
    return dayNumber > userProgress.current_day;
  };

  const isWeekLocked = (week) => {
    if (!userProgress) return false;
    const weekStartDay = (week - 1) * 7 + 1;
    return weekStartDay > userProgress.current_day;
  };

  const renderDayCircle = (week, day) => {
    const dayNumber = (week - 1) * 7 + day;
    const completed = isDayCompleted(week, day);
    const current = isCurrentDay(week, day);
    const locked = isDayLocked(week, day);

    return (
      <View key={day} style={styles.dayContainer}>
        <View style={[
          styles.dayCircle,
          completed && styles.dayCircleCompleted,
          current && styles.dayCircleCurrent,
          locked && styles.dayCircleLocked
        ]}>
          {locked ? (
            <Icon name="lock-closed" size={12} color="#999999" />
          ) : (
            <Text style={[
              styles.dayNumber,
              completed && styles.dayNumberCompleted,
              current && styles.dayNumberCurrent,
              locked && styles.dayNumberLocked
            ]}>
              {day}
            </Text>
          )}
        </View>
        {completed && (
          <View style={styles.completionBadge}>
            <Icon name="checkmark-circle" size={16} color="#10B981" />
          </View>
        )}
      </View>
    );
  };

  const renderWeek = (weekNumber) => {
    const locked = isWeekLocked(weekNumber);
    const currentWeek = getCurrentWeek();
    const isCurrentWeek = weekNumber === currentWeek;

    return (
      <View key={weekNumber} style={[styles.weekContainer, weekNumber === 1 && { marginTop: 12 }]}>
        <View style={styles.weekHeader}>
          <View style={styles.weekTitleContainer}>
            <View style={[
              styles.weekIcon,
              locked && styles.weekIconLocked
            ]}>
              {locked ? (
                <Icon name="lock-closed" size={16} color="#999999" />
              ) : (
                <Icon name="calendar" size={16} color="#4CD964" />
              )}
            </View>
            <Text style={[
              styles.weekTitle,
              locked && styles.weekTitleLocked
            ]}>
              WEEK {weekNumber}
            </Text>
          </View>
        </View>

        <View style={[
          styles.weekContent,
          locked && styles.weekContentLocked
        ]}>
          {/* Day circles arranged in the pattern from the image */}
          <View style={styles.daysContainer}>
            {/* Top row: Days 1, 2, 3, 4 */}
            <View style={styles.dayRow}>
              {[1, 2, 3, 4].map(day => renderDayCircle(weekNumber, day))}
            </View>

            {/* Bottom row: Days 7, 6, 5 */}
            <View style={styles.dayRow}>
              {[7, 6, 5].map(day => renderDayCircle(weekNumber, day))}
            </View>
          </View>

          {/* Show today's exercises only for current day */}
          {isCurrentWeek && !locked && (
            <View style={styles.todayExercisesContainer}>
              <Text style={styles.todayExercisesTitle}>Today's Exercises</Text>
              {todayExercises.map((exercise, index) => {
                const displayName = exercise.subExercise?.name || exercise.name;
                const displayDuration = exercise.subExercise?.duration || exercise.durationMin || exercise.subExercise?.durationMin || 0;

                // Check if this exercise is completed
                const exerciseId = exercise.parentExercise?.id || exercise.id;
                const subExerciseId = exercise.subExercise?.id || null;
                const key = subExerciseId ? `${exerciseId}-${subExerciseId}` : exerciseId;
                const isCompleted = completedExercises.has(key);

                return (
                <TouchableOpacity
                  key={exercise.id}
                  style={[styles.dailyExerciseCard, isCompleted && styles.dailyExerciseCardCompleted]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onExerciseSelect(
                      exercise.parentExercise || exercise,
                      exercise.subExercise || null,
                      index
                    );
                  }}
                >
                  <View style={styles.dailyExerciseContent}>
                    <View style={styles.dailyExerciseInfo}>
                      <View style={styles.dailyExerciseNumberContainer}>
                        {isCompleted ? (
                          <Icon name="checkmark-circle" size={20} color="#10B981" />
                        ) : (
                          <Text style={styles.dailyExerciseNumber}>{index + 1}</Text>
                        )}
                      </View>
                      <View style={styles.dailyExerciseDetails}>
                        <Text style={[styles.dailyExerciseName, isCompleted && styles.dailyExerciseNameCompleted]}>
                          {displayName}
                        </Text>
                        <Text style={styles.dailyExerciseMeta}>
                          {displayDuration >= 60
                            ? (displayDuration >= 90
                                ? `${Math.round(displayDuration / 60)} min`
                                : `1 min`)
                            : `${Math.max(1, Math.round(displayDuration))} sec`
                          } • {exercise.difficulty}
                        </Text>
                      </View>
                    </View>
                    <Icon name="chevron-forward" size={20} color="#666666" />
                  </View>
                </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  const totalWeeks = Math.ceil(120 / 7); // 17 weeks total

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#4CD964']}
          tintColor="#4CD964"
        />
      }
    >


      {/* Weeks */}
      {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(weekNumber =>
        renderWeek(weekNumber)
      )}

      {/* Bottom padding */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};


export default WeeklyProgressView;

const localStyles = StyleSheet.create({
  weekCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  currentWeekBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B5FE3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  currentWeekText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  completedWeekBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedWeekText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  lockedWeekBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  lockedWeekText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  weekProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weekProgressBar: {
    width: 60,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  weekProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  weekProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    minWidth: 30,
  },
  todayExercisesContainer: {
    marginTop: 16,
  },
  todayExercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  todayExercisesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  exerciseCountBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  exerciseCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  exerciseCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  exerciseNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  exerciseNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  difficultyBeginner: {
    backgroundColor: '#DCFCE7',
  },
  difficultyIntermediate: {
    backgroundColor: '#FEF3C7',
  },
  difficultyAdvanced: {
    backgroundColor: '#FEE2E2',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

