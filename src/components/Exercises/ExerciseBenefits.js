import React from 'react';
import { View, Text } from 'react-native';
import Icon from '../UI/Icon';

export default function ExerciseBenefits({ styles, exercise }) {
  if (!exercise.benefits || exercise.benefits.length === 0) return null;

  return (
    <View style={styles.exerciseBenefitsSection}>
      <Text style={[styles.exerciseBenefitsTitle, {
        fontSize: 22,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 24,
        letterSpacing: -0.3
      }]}>Benefits</Text>
      {exercise.benefits.map((benefit, index) => (
        <View key={index} style={[styles.exerciseBenefit, {
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 16,
          paddingLeft: 4
        }]}>
          <View style={{
            marginRight: 14,
            marginTop: 2
          }}>
            <Icon name="checkmark-circle" size={24} color="#000000" />
          </View>
          <Text style={[styles.exerciseBenefitText, {
            flex: 1,
            fontSize: 16,
            color: '#333333',
            lineHeight: 24,
            fontWeight: '500'
          }]}>{benefit}</Text>
        </View>
      ))}
    </View>
  );
}

