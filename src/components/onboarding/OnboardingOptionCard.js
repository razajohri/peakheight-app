// OnboardingOptionCard - Standardized option card for selections
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { 
  ONBOARDING_COLORS, 
  ONBOARDING_SPACING, 
  ONBOARDING_TYPOGRAPHY,
  ONBOARDING_BORDER_RADIUS 
} from '../../utils/onboardingConstants';

const OnboardingOptionCard = ({ 
  label,
  icon,
  selected = false,
  onPress,
  style,
  showCheckmark = true,
  iconPosition = 'right', // 'left' or 'right'
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Selection animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
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

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[
          styles.card,
          selected && styles.cardSelected,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={selected ? ONBOARDING_COLORS.TEXT_PRIMARY : ONBOARDING_COLORS.TEXT_SECONDARY} 
              style={styles.iconLeft}
            />
          )}
          <Text style={[
            styles.cardText,
            selected && styles.cardTextSelected,
          ]}>
            {label}
          </Text>
          {showCheckmark && selected && (
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={ONBOARDING_COLORS.TEXT_PRIMARY} 
              style={styles.checkmark}
            />
          )}
          {icon && iconPosition === 'right' && !selected && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={ONBOARDING_COLORS.TEXT_SECONDARY} 
              style={styles.iconRight}
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: ONBOARDING_COLORS.BORDER,
    backgroundColor: ONBOARDING_COLORS.SURFACE,
    borderRadius: ONBOARDING_BORDER_RADIUS.CARD,
    padding: ONBOARDING_SPACING.CARD_PADDING,
    marginBottom: ONBOARDING_SPACING.MD + 2,
  },
  cardSelected: {
    borderColor: ONBOARDING_COLORS.BORDER_SELECTED,
    backgroundColor: ONBOARDING_COLORS.SURFACE_ELEVATED,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    ...ONBOARDING_TYPOGRAPHY.OPTION_TEXT,
    flex: 1,
    textAlign: 'center',
  },
  cardTextSelected: {
    color: ONBOARDING_COLORS.TEXT_PRIMARY,
  },
  checkmark: {
    marginLeft: ONBOARDING_SPACING.SM,
  },
  iconLeft: {
    marginRight: ONBOARDING_SPACING.SM,
  },
  iconRight: {
    marginLeft: ONBOARDING_SPACING.SM,
  },
});

export default OnboardingOptionCard;
