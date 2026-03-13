import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../UI/Icon';

export default function ExerciseCompletionModal({
  styles,
  visible,
  selectedExercise,
  selectedSubExercise,
  onClose,
  onContinue,
}) {
  if (!visible) return null;

  return (
    <View style={styles.completionModalOverlay}>
      <View style={styles.completionModal}>
        <View style={styles.completionIconContainer}>
          <Icon name="checkmark-circle" size={80} color="#4CD964" />
        </View>
        <Text style={styles.completionTitle}>Keep it up!</Text>
        <Text style={styles.completionMessage}>
          Great job completing {selectedSubExercise?.name || selectedExercise?.name}! You're one step closer to your height goals.
        </Text>
        <TouchableOpacity
          style={styles.completionButton}
          onPress={() => {
            onClose();
            onContinue();
          }}
        >
          <Text style={styles.completionButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

