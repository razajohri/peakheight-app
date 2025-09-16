import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

export default function SubExercisesView({ styles, selectedExercise, getExerciseImageUrl, openSubExercise }) {
  if (!selectedExercise) return null;

  return (
    <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
      <View style={styles.exerciseHeroContainer}>
        <Image
          source={getExerciseImageUrl(selectedExercise)}
          style={styles.exerciseHeroImage}
          resizeMode="cover"
        />
        <View style={styles.exerciseHeroOverlay}>
          <Text style={styles.exerciseHeroTitle}>{selectedExercise.name}</Text>
          <View style={styles.exerciseHeroChips}>
            <View style={styles.heroChip}><Text style={styles.heroChipText}>{selectedExercise.difficulty}</Text></View>
            <View style={styles.heroChip}><Text style={styles.heroChipText}>{selectedExercise.durationMin} min</Text></View>
          </View>
        </View>
      </View>

      <View style={styles.subExercisesSection}>
        <Text style={styles.sectionHeading}>Choose Your Exercise</Text>
        <Text style={styles.sectionSubheading}>
          This exercise is broken down into {selectedExercise.subExercises.length} parts. Choose one to start:
        </Text>

        {selectedExercise.subExercises.map((subExercise, index) => (
          <TouchableOpacity
            key={subExercise.id}
            style={styles.subExerciseCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              openSubExercise(subExercise);
            }}
          >
            <View style={styles.subExerciseContent}>
              <View style={styles.subExerciseHeader}>
                <Text style={styles.subExerciseNumber}>{index + 1}</Text>
                <View style={styles.subExerciseInfo}>
                  <Text style={styles.subExerciseName}>{subExercise.name}</Text>
                  <Text style={styles.subExerciseDescription}>{subExercise.description}</Text>
                </View>
                <View style={styles.subExerciseDuration}>
                  <Text style={styles.subExerciseDurationText}>{subExercise.duration}s</Text>
                </View>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.exerciseInfoSection}>
        <Text style={styles.sectionHeading}>Benefits</Text>
        <View style={styles.bullets}>
          {(selectedExercise.benefits || []).slice(0,3).map((b, i) => (
            <Text key={i} style={styles.bullet}>• {b}</Text>
          ))}
        </View>

        <Text style={styles.sectionHeading}>Target Muscles</Text>
        <View style={styles.muscleChips}>
          {(selectedExercise.targetMuscles || []).slice(0,6).map(m => (
            <View key={m} style={styles.muscleChip}><Text style={styles.muscleChipText}>{m}</Text></View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
