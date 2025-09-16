import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../contexts/UserContext';
import { CustomExercisePlanService } from '../../services/customExercisePlanService';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const WeeklyProgressView = ({ onExerciseSelect }) => {
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
            <Icon name="medal" size={16} color="#FFD700" />
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
      <View key={weekNumber} style={styles.weekContainer}>
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
              {todayExercises.map((exercise, index) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseCard}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onExerciseSelect(exercise);
                  }}
                >
                  <View style={styles.exerciseContent}>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseNumber}>{index + 1}</Text>
                      <View style={styles.exerciseDetails}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <Text style={styles.exerciseMeta}>
                          {exercise.durationMin} min • {exercise.difficulty}
                        </Text>
                      </View>
                    </View>
                    <Icon name="chevron-forward" size={20} color="#666666" />
                  </View>
                </TouchableOpacity>
              ))}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  weekContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weekIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekIconLocked: {
    backgroundColor: '#F5F5F5',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  weekTitleLocked: {
    color: '#999999',
  },
  weekContent: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginLeft: 16,
  },
  weekContentLocked: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  daysContainer: {
    gap: 8,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleCompleted: {
    backgroundColor: '#4CD964',
    borderColor: '#4CD964',
  },
  dayCircleCurrent: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  dayCircleLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  dayNumberCompleted: {
    color: '#FFFFFF',
  },
  dayNumberCurrent: {
    color: '#FF6B35',
  },
  dayNumberLocked: {
    color: '#999999',
  },
  completionBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  todayExercisesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  todayExercisesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CD964',
    marginRight: 12,
    minWidth: 20,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  exerciseMeta: {
    fontSize: 12,
    color: '#666666',
  },
});

export default WeeklyProgressView;
