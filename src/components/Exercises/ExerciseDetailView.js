import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');

export default function ExerciseDetailView({
  styles,
  selectedExercise,
  selectedSubExercise,
  getExerciseImageUrl,
  timer,
  isTimerRunning,
  onTogglePlay,
  onReset,
  onPrevious,
  onNext
}) {
  if (!selectedExercise && !selectedSubExercise) return null;

  const exercise = selectedSubExercise || selectedExercise;
  const totalTime = selectedSubExercise ? selectedSubExercise.duration : (selectedExercise?.durationMin * 60);
  const progress = totalTime > 0 ? ((totalTime - timer) / totalTime) * 100 : 0;
  const radius = 124; // slightly larger than image radius (120) for small gap
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <ScrollView
      contentContainerStyle={styles.detailContent}
      showsVerticalScrollIndicator={true}
      scrollEnabled={true}
      bounces={true}
    >
      {/* Header with exercise name */}
      <View style={[styles.exerciseHeader, { marginTop: 10, marginBottom: 10 }]}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
      </View>

      {/* Main Exercise Timer Section */}
      <View style={styles.mainTimerSection}>
        {/* Circular Timer with Exercise Image */}
        <View style={styles.circularTimerContainer}>
          <Svg width={260} height={260} style={styles.timerSvg}>
            {/* Background Circle */}
            <Circle
              cx={130}
              cy={130}
              r={radius}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={8}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx={130}
              cy={130}
              r={radius}
              stroke="#000000"
              strokeWidth={8}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 130 130)"
            />
          </Svg>

          {/* Exercise Image in Center */}
          <View style={styles.exerciseImageContainer}>
            <Image
              source={getExerciseImageUrl(exercise)}
              style={styles.exerciseImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Timer Display */}
        <Text style={styles.timerDisplay}>
          {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </Text>

        {/* Timer Controls */}
        <View style={styles.timerControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onPrevious();
            }}
          >
            <Icon name="play-skip-back" size={32} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.playButton]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onTogglePlay();
            }}
          >
            <Icon name={isTimerRunning ? "pause" : "play"} size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onNext();
            }}
          >
            <Icon name="play-skip-forward" size={32} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Steps Section */}
      <View style={styles.stepsSection}>
        <Text style={styles.sectionHeading}>Steps</Text>
        <View style={styles.steps}>
          {(exercise.steps || []).map((s, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>{idx + 1}</Text></View>
              <Text style={styles.stepText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}
