import React from 'react';
import { View, Text } from 'react-native';
import CachedImage from '../UI/CachedImage';

export default function ExerciseHero({ styles, exercise, getExerciseImageUrl }) {
  return (
    <View style={styles.exerciseHeroSection}>
      <View style={styles.exerciseHeroImageContainer}>
        <CachedImage
          source={getExerciseImageUrl(exercise)}
          style={styles.exerciseHeroImage}
          resizeMode="cover"
          priority="high"
        />
      </View>
      <View style={styles.exerciseHeroContent}>
        <Text style={styles.exerciseHeroTitle}>{exercise.name}</Text>
        <View style={styles.exerciseHeroMeta}>
          <Text style={styles.exerciseHeroDuration}>
            {exercise.durationMin || exercise.duration} min
          </Text>
          <Text style={styles.exerciseHeroDifficulty}>
            {exercise.difficulty}
          </Text>
          {exercise.impact && (
            <Text style={styles.exerciseHeroImpact}>
              {exercise.impact === 'High' ? 'High impact' :
               exercise.impact === 'Medium' ? 'Medium impact' : 'Low impact'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
