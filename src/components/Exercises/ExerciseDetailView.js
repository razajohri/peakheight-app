import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Icon from '../UI/Icon';
import * as Haptics from 'expo-haptics';
import ExerciseTimer from './ExerciseTimer';
import ExerciseStepsModal from './ExerciseStepsModal';

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
  onNext,
  currentTodayIndex,
  todayList,
  navigation,
  setView,
  onNavigateToProfile
}) {
  const [showStepsModal, setShowStepsModal] = useState(false);
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(20);

  useEffect(() => {
    fadeAnim.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
    slideAnim.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
  }, [selectedExercise, selectedSubExercise]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  if (!selectedExercise && !selectedSubExercise) return null;

  const exercise = selectedSubExercise || selectedExercise;
  const totalTime = selectedSubExercise ? (selectedSubExercise.duration || 30) : ((selectedExercise?.durationMin ? selectedExercise.durationMin * 60 : 30));
  const progress = totalTime > 0 ? ((totalTime - timer) / totalTime) * 100 : 0;
  const hasSteps = exercise?.steps && exercise.steps.length > 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress indicator (e.g., "4/8")
  const getProgressIndicator = () => {
    if (currentTodayIndex != null && todayList && todayList.length > 0) {
      return `${currentTodayIndex + 1}/${todayList.length}`;
    }
    // Check for sub-exercises
    const subs = (selectedExercise && selectedExercise.subExercises) ? selectedExercise.subExercises : [];
    const sel = selectedSubExercise || null;
    if (subs.length > 0 && sel) {
      const idx = subs.findIndex(s => String(s.id) === String(sel.id));
      const pos = idx >= 0 ? idx + 1 : 1;
      return `${pos}/${subs.length}`;
    }
    return '1/1';
  };

  const handleBack = () => {
    if (setView) {
      if (currentTodayIndex !== null && todayList && todayList.length > 0) {
        setView('hub');
      } else if (selectedSubExercise) {
        setView('sub-exercises');
      } else {
        setView('list');
      }
    } else if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleSettings = () => {
    if (typeof onNavigateToProfile === 'function') {
      onNavigateToProfile();
    } else if (navigation && navigation.navigate) {
      navigation.navigate('profile');
    }
  };

  return (
    <View style={localStyles.container}>
      {/* Top Header with Back and Settings Buttons */}
      <View style={localStyles.header}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleBack();
          }}
          activeOpacity={0.7}
          style={localStyles.headerButtonContainer}
        >
          <LinearGradient
            colors={['#000000', '#333333']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={localStyles.headerButton}
          >
            <Icon name="arrow-back" size={19} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleSettings();
          }}
          activeOpacity={0.7}
          style={localStyles.headerButtonContainer}
        >
          <LinearGradient
            colors={['#000000', '#333333']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={localStyles.headerButton}
          >
            <Icon name="settings-outline" size={19} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Animated.View style={[localStyles.content, animatedContentStyle]}>
        {/* Exercise Information Banner */}
        <View style={localStyles.exerciseBannerContainer}>
          <LinearGradient
            colors={['#000000', '#333333']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={localStyles.exerciseBanner}
          >
            <Text style={localStyles.progressText}>{getProgressIndicator()}</Text>
            <View style={localStyles.bannerContent}>
              <Text style={localStyles.exerciseTitle}>{exercise.name}</Text>
              <Text style={localStyles.timerText}>{formatTime(timer)}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Main Exercise Display */}
        <View style={localStyles.timerSection}>
          <ExerciseTimer
            styles={styles}
            exercise={exercise}
            getExerciseImageUrl={getExerciseImageUrl}
            timer={timer}
            isTimerRunning={isTimerRunning}
            totalTime={totalTime}
            progress={progress}
            onTogglePlay={onTogglePlay}
            onReset={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onReset();
            }}
            onNext={onNext}
          />
        </View>

        {/* How to do it Button */}
        {hasSteps && (
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowStepsModal(true);
            }}
            activeOpacity={0.7}
            style={localStyles.howToButtonContainer}
          >
            <LinearGradient
              colors={['#000000', '#333333']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={localStyles.howToButton}
            >
              <Text style={localStyles.howToText}>How to do it</Text>
              <Icon name="chevron-forward" size={22} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Steps Modal */}
      <ExerciseStepsModal
        visible={showStepsModal}
        onClose={() => setShowStepsModal(false)}
        exercise={exercise}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Nudge header slightly higher on iOS; keep comfortable spacing on Android
    paddingTop: Platform.OS === 'ios' ? 8 : 24,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerButtonContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    // Remove extra top padding so content is closer to the header
    paddingTop: 0,
  },
  exerciseBannerContainer: {
    borderRadius: 12,
    // Add more space below the banner for consistent spacing
    marginBottom: Platform.OS === 'ios' ? 24 : 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  exerciseBanner: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#CCCCCC',
    marginBottom: 8,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    flex: 1,
  },
  timerText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  timerSection: {
    // Consistent spacing between timer and "how to do it" button
    marginBottom: Platform.OS === 'ios' ? 24 : 32,
  },
  howToButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    // Remove extra marginTop to keep consistent spacing
    marginTop: 0,
    // Consistent bottom spacing
    marginBottom: Platform.OS === 'ios' ? 24 : 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  howToButton: {
    paddingVertical: 18,
    paddingLeft: 22,
    paddingRight: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
  },
  howToText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

