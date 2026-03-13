import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../UI/Icon';

export default function CustomExercisePlan({
  styles,
  loadingCustomPlan,
  customExercisePlan,
  userProfile,
  setSelectedExercise,
  setView,
  setSelectedCategory,
  setCustomExercisePlan,
  CustomExercisePlanService,
}) {
  if (loadingCustomPlan) {
    return (
      <View style={styles.gridContainer}>
        <Text style={styles.gridTitle}>MY EXERCISES PLAN</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your custom plan...</Text>
        </View>
      </View>
    );
  }

  if (!customExercisePlan) {
    return (
      <View style={styles.gridContainer}>
        <Text style={styles.gridTitle}>MY EXERCISE PLAN</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load exercise plan</Text>
        </View>
      </View>
    );
  }

  let todayExercises;
  let currentPhase = 'Growth Hormone';
  try {
    todayExercises = CustomExercisePlanService.getTodayExercises(customExercisePlan);
    currentPhase = customExercisePlan.weekly_schedule ?
      (customExercisePlan.weekly_schedule.monday?.exercises?.[0]?.difficulty === 'Beginner' ? 'Growth Hormone' :
       (customExercisePlan.weekly_schedule.monday?.exercises?.[0]?.difficulty === 'Intermediate' || 
        customExercisePlan.weekly_schedule.monday?.exercises?.[0]?.difficulty === 'Inter') ? 'Building' : 'Advancing') : 'Growth Hormone';
  } catch (e) {
    todayExercises = { weekly: [], morning: [], evening: [], focus: 'Posture & Alignment' };
  }

  return (
    <View style={styles.gridContainer}>
      <Text style={styles.gridTitle}>MY EXERCISES PLAN</Text>
      <View style={styles.dailyExercisesSection}>
        <Text style={styles.sectionTitle}>Today's Exercises</Text>
        <Text style={styles.sectionSubtitle}>
          {todayExercises.length} exercises selected for today • {currentPhase} Phase
        </Text>
        {todayExercises.map((exercise, index) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.dailyExerciseCard}
            onPress={() => {
              setSelectedExercise(exercise);
              setView('detail');
            }}
          >
            <View style={styles.dailyExerciseContent}>
              <View style={styles.dailyExerciseInfo}>
                <Text style={styles.dailyExerciseNumber}>{index + 1}</Text>
                <View style={styles.dailyExerciseDetails}>
                  <Text style={styles.dailyExerciseName}>{exercise.name}</Text>
                  <Text style={styles.dailyExerciseMeta}>
                    {exercise.durationMin} min • {exercise.difficulty}
                  </Text>
                </View>
              </View>
              <View style={styles.dailyExerciseActions}>
                <Icon name="chevron-forward" size={20} color="#666666" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => {
          setSelectedCategory('all');
          setView('list');
        }}>
          <Icon name="list" size={20} color="#3B5FE3" />
          <Text style={styles.actionButtonText}>Browse All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={async () => {
            if (userProfile?.id) {
              try {
                const updatedPlan = await CustomExercisePlanService.generateCustomExercisePlan(userProfile.id);
                await CustomExercisePlanService.updateUserExercisePlan(userProfile.id, {
                  daily_exercises: updatedPlan.dailyExercises,
                  last_updated: updatedPlan.lastUpdated,
                });
                setCustomExercisePlan(updatedPlan);
              } catch {}
            }
          }}
        >
          <Icon name="refresh" size={20} color="#10B981" />
          <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Refresh Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

