import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

export default function ExerciseItem({ styles, item, onPress, getExerciseImageUrl }) {
  return (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(item);
      }}
    >
      {/* Exercise Image with Overlay */}
      <View style={styles.exerciseThumb}>
        <Image source={getExerciseImageUrl(item)} style={styles.exerciseThumbImg} resizeMode="cover" />
        <View style={styles.exerciseImageOverlay}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyBadgeText}>{item.difficulty}</Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.exerciseContent}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.impactContainer}>
            <View style={[styles.impactDot, item.highImpact ? styles.highImpactDot : styles.mediumImpactDot]} />
            <Text style={[styles.exerciseImpact, item.highImpact ? styles.highImpact : styles.mediumImpact]}>
              {item.impact}
            </Text>
          </View>
        </View>

        <View style={styles.exerciseFooter}>
          <View style={styles.durationContainer}>
            <Icon name="time-outline" size={14} color="#666666" />
            <Text style={styles.exerciseDetails}>{item.duration}</Text>
          </View>
          <Icon name="chevron-forward" size={18} color="#CCCCCC" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
