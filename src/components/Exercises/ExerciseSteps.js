import React from 'react';
import { View, Text } from 'react-native';

export default function ExerciseSteps({ styles, exercise }) {
  if (!exercise.steps || exercise.steps.length === 0) return null;

  return (
    <View style={styles.exerciseStepsSection}>
      <Text style={[styles.exerciseStepsTitle, {
        fontSize: 22,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 24,
        letterSpacing: -0.3
      }]}>How to do it</Text>
      {exercise.steps.map((step, index) => (
        <View key={index} style={[styles.exerciseStep, {
          flexDirection: 'row',
          marginBottom: 20,
          alignItems: 'flex-start'
        }]}>
          <View style={[styles.exerciseStepNumber, {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
            marginTop: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3
          }]}>
            <Text style={[styles.exerciseStepNumberText, {
              fontSize: 14,
              fontWeight: '700',
              color: '#FFFFFF'
            }]}>{index + 1}</Text>
          </View>
          <Text style={[styles.exerciseStepText, {
            flex: 1,
            fontSize: 16,
            color: '#333333',
            lineHeight: 24,
            fontWeight: '500'
          }]}>{step}</Text>
        </View>
      ))}
    </View>
  );
}
