import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import CachedImage from '../UI/CachedImage';
import Icon from '../UI/Icon';
import * as Haptics from 'expo-haptics';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ExerciseTimer({
  styles,
  exercise,
  getExerciseImageUrl,
  timer,
  isTimerRunning,
  totalTime,
  progress,
  onTogglePlay,
  onReset,
  onNext,
}) {
  const imageDiameter = 300;
  const strokeWidth = 6;
  const padding = 2; // Space between ring and image
  const imageSize = imageDiameter - (strokeWidth * 2) - (padding * 2);
  const center = imageDiameter / 2;
  const radius = (imageDiameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = Math.max(0, Math.min(100, progress || 0));
  
  // Animation values
  const progressAnim = useSharedValue(progressPercentage);
  const pulseAnim = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const playButtonScale = useSharedValue(1);
  const nextButtonScale = useSharedValue(1);
  const resetButtonScale = useSharedValue(1);
  const [showCompletion, setShowCompletion] = useState(false);

  // Update progress animation
  useEffect(() => {
    progressAnim.value = withTiming(progressPercentage, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [progressPercentage]);

  // Pulse animation when timer is running
  useEffect(() => {
    if (isTimerRunning) {
      pulseAnim.value = withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(0, { duration: 300 });
    }
  }, [isTimerRunning]);

  // Completion celebration
  useEffect(() => {
    if (timer === 0 && totalTime > 0) {
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 2000);
    }
  }, [timer, totalTime]);

  // Animated progress circle props
  const animatedProgressProps = useAnimatedProps(() => {
    const offset = circumference - (progressAnim.value / 100) * circumference;
    return {
      strokeDashoffset: offset,
    };
  });

  // Animated pulse style for image
  const animatedPulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnim.value, [0, 1], [1, 1.02]);
    return {
      transform: [{ scale }],
    };
  });

  // Button press animations
  const handlePlayPress = () => {
    playButtonScale.value = withSpring(0.9, {}, () => {
      playButtonScale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onTogglePlay();
  };

  const handleResetPress = () => {
    resetButtonScale.value = withSpring(0.9, {}, () => {
      resetButtonScale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onReset();
  };

  const handleNextPress = () => {
    const isCompleted = timer <= 0 || totalTime === 0;
    
    if (!isCompleted) {
      Alert.alert('please complete this exercise first');
      return;
    }
    
    nextButtonScale.value = withSpring(0.9, {}, () => {
      nextButtonScale.value = withSpring(1);
    });
    
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}
    
    if (typeof onNext === 'function') {
      onNext();
    }
  };

  const playButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playButtonScale.value }],
  }));

  const resetButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resetButtonScale.value }],
  }));

  const nextButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nextButtonScale.value }],
  }));

  const isCompleted = timer <= 0 || totalTime === 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={localStyles.container}>
      {/* Central Circle with Exercise Image and Progress Ring */}
      <View style={localStyles.circleContainer}>
        {/* SVG Progress Ring - Behind the image */}
        <Svg
          width={imageDiameter}
          height={imageDiameter}
          style={localStyles.progressRing}
        >
          {/* Background Circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
            stroke="#E0E0E0"
            strokeWidth={strokeWidth}
              fill="none"
            />
          {/* Animated Progress Circle */}
          <AnimatedCircle
              cx={center}
              cy={center}
              r={radius}
            stroke={isTimerRunning ? "#000000" : "#666666"}
            strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
            animatedProps={animatedProgressProps}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
        </Svg>

        {/* Exercise Image - Centered and smaller to show ring */}
        <Animated.View 
          style={[
            localStyles.imageCircle, 
            { 
              width: imageSize, 
              height: imageSize, 
              borderRadius: imageSize / 2,
            },
            animatedPulseStyle
          ]}
        >
          <CachedImage
            source={getExerciseImageUrl(exercise)}
            style={localStyles.exerciseImage}
            resizeMode="cover"
            priority="high"
          />
          {/* Completion overlay */}
          {showCompletion && (
            <View style={localStyles.completionOverlay}>
              <Icon name="checkmark-circle" size={60} color="#4CD964" />
        </View>
          )}
        </Animated.View>
      </View>

      {/* Control Buttons */}
      <View style={localStyles.controlsContainer}>
        {/* Reset Button */}
        <View style={localStyles.controlButtonWrapper}>
          <AnimatedTouchable 
          activeOpacity={0.8}
            onPress={handleResetPress}
            style={[localStyles.controlButtonContainer, resetButtonAnimatedStyle]}
        >
          <LinearGradient
            colors={['#000000', '#333333']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
              style={localStyles.controlButton}
          >
              <Icon name="refresh" size={22} color="#FFFFFF" />
          </LinearGradient>
          </AnimatedTouchable>
          <Text style={localStyles.controlLabel}>Reset</Text>
        </View>

        {/* Play/Pause Button - Center, Larger */}
        <View style={[localStyles.controlButtonWrapper, localStyles.playButtonWrapper]}>
          <AnimatedTouchable
          activeOpacity={0.8}
            onPress={handlePlayPress}
            style={[
              localStyles.playButtonContainer,
              playButtonAnimatedStyle,
              isTimerRunning && localStyles.playButtonActive
            ]}
        >
          <LinearGradient
              colors={isTimerRunning ? ['#1a1a1a', '#4a4a4a'] : ['#000000', '#333333']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
              style={localStyles.playButton}
          >
            <Icon
              name={isTimerRunning ? "pause" : "play"}
                size={isTimerRunning ? 30 : 34}
              color="#FFFFFF"
            />
          </LinearGradient>
          </AnimatedTouchable>
        </View>

        {/* Next Button */}
        <View style={localStyles.controlButtonWrapper}>
          <AnimatedTouchable
            activeOpacity={isCompleted ? 0.8 : 0.5}
            onPress={handleNextPress}
            style={[
              localStyles.controlButtonContainer,
              nextButtonAnimatedStyle,
              !isCompleted && localStyles.controlButtonDisabled
            ]}
        >
          <LinearGradient
              colors={isCompleted ? ['#000000', '#333333'] : ['#666666', '#888888']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
              style={localStyles.controlButton}
          >
              <Icon name="arrow-forward" size={22} color="#FFFFFF" />
          </LinearGradient>
          </AnimatedTouchable>
          <Text style={[localStyles.controlLabel, !isCompleted && localStyles.controlLabelDisabled]}>
            Next
          </Text>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  imageCircle: {
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  completionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 36,
    paddingHorizontal: 20,
  },
  controlButtonWrapper: {
    alignItems: 'center',
    gap: 10,
  },
  playButtonWrapper: {
    marginTop: 16, // Move center button down relative to other buttons
  },
  controlButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  playButtonContainer: {
    width: 82,
    height: 82,
    borderRadius: 41,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  playButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginTop: 4,
  },
  controlLabelDisabled: {
    color: '#999999',
  },
});

