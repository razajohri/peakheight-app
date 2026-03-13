// ProgressHeader - Standardized progress indicator for onboarding pages
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { 
  ONBOARDING_COLORS, 
  ONBOARDING_SPACING, 
  ONBOARDING_TYPOGRAPHY,
  ONBOARDING_TOTAL_STEPS 
} from '../../utils/onboardingConstants';

const ProgressHeader = ({ 
  currentStep, 
  totalSteps = ONBOARDING_TOTAL_STEPS,
  onBack,
  showBackButton = true 
}) => {
  const progress = (currentStep / totalSteps) * 100;
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack && onBack();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: progressWidth }
            ]} 
          />
        </View>
      </View>
      <Text style={styles.progressText}>
        {currentStep}/{totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    paddingTop: ONBOARDING_SPACING.XS,
    marginBottom: ONBOARDING_SPACING.LG,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ONBOARDING_SPACING.SM + 4,
    backgroundColor: ONBOARDING_COLORS.SURFACE_ELEVATED,
    borderRadius: 20,
  },
  progressBarContainer: {
    flex: 1,
    marginRight: ONBOARDING_SPACING.SM + 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: ONBOARDING_COLORS.PROGRESS_BAR,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: ONBOARDING_COLORS.PROGRESS_FILL,
    borderRadius: 2,
  },
  progressText: {
    ...ONBOARDING_TYPOGRAPHY.PROGRESS_TEXT,
    minWidth: 40,
    textAlign: 'right',
  },
});

export default ProgressHeader;
