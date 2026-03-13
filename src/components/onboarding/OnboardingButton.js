// OnboardingButton - Standardized button for onboarding pages
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { 
  ONBOARDING_COLORS, 
  ONBOARDING_SPACING, 
  ONBOARDING_TYPOGRAPHY,
  ONBOARDING_BORDER_RADIUS 
} from '../../utils/onboardingConstants';

const OnboardingButton = ({ 
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  variant = 'primary', // 'primary' or 'secondary'
  haptic = true,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (disabled) return;
    
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    onPress && onPress();
  };

  if (variant === 'primary') {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={0.85}
          style={[
            styles.button,
            disabled && styles.buttonDisabled,
          ]}
        >
          <LinearGradient
            colors={disabled 
              ? ['rgba(255, 255, 255, 0.5)', 'rgba(243, 244, 246, 0.5)']
              : ['#FFFFFF', '#F3F4F6']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={[
              styles.buttonText,
              disabled && styles.buttonTextDisabled,
              textStyle
            ]}>
              {title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Secondary variant (outline style)
  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.85}
        style={[
          styles.buttonSecondary,
          disabled && styles.buttonDisabled,
        ]}
      >
        <Text style={[
          styles.buttonTextSecondary,
          disabled && styles.buttonTextDisabled,
          textStyle
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: ONBOARDING_BORDER_RADIUS.BUTTON,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: ONBOARDING_SPACING.BUTTON_PADDING_VERTICAL,
    paddingHorizontal: ONBOARDING_SPACING.BUTTON_PADDING_HORIZONTAL,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonSecondary: {
    borderRadius: ONBOARDING_BORDER_RADIUS.BUTTON,
    paddingVertical: ONBOARDING_SPACING.BUTTON_PADDING_VERTICAL,
    paddingHorizontal: ONBOARDING_SPACING.BUTTON_PADDING_HORIZONTAL,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ONBOARDING_COLORS.BORDER,
    backgroundColor: 'transparent',
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...ONBOARDING_TYPOGRAPHY.BUTTON_TEXT,
  },
  buttonTextSecondary: {
    ...ONBOARDING_TYPOGRAPHY.BUTTON_TEXT,
    color: ONBOARDING_COLORS.TEXT_PRIMARY,
  },
  buttonTextDisabled: {
    opacity: 0.7,
  },
});

export default OnboardingButton;
