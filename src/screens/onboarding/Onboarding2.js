// Onboarding2.js (Page 2 - Full name)
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS,
  ONBOARDING_BORDER_RADIUS,
} from '../../utils/onboardingConstants';

const Onboarding2 = ({ navigation, data, updateData }) => {
  const [fullName, setFullName] = useState(data.fullName || data.displayName || '');
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation on mount
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = () => {
    const trimmedFull = fullName.trim();
    if (!trimmedFull) {
      return;
    }

    // Derive first/last name from full name for profile mapping
    const parts = trimmedFull.split(/\s+/);
    const derivedFirst = parts[0] || '';
    const derivedLast = parts.length > 1 ? parts.slice(1).join(' ') : '';
    const displayName = trimmedFull;

    updateData({
      fullName: trimmedFull,
      firstName: derivedFirst,
      lastName: derivedLast || undefined,
      displayName,
    });

    navigation.navigate('Onboarding3');
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      <SafeAreaView style={styles.safeArea}>
        <FloatingStars />
        <ProgressHeader 
          currentStep={2} 
          onBack={() => navigation.goBack()} 
        />

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>First, what&apos;s your name?</Text>
          </View>

          <View style={styles.nameContainer}>
            <View style={styles.nameInputWrapper}>
              <Text style={styles.inputLabel}>Full name</Text>
              <TextInput
                style={styles.nameInput}
                placeholder=""
                placeholderTextColor={ONBOARDING_COLORS.TEXT_SECONDARY}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <OnboardingButton
            title="Continue"
            onPress={handleContinue}
            disabled={!fullName.trim()}
          />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ONBOARDING_COLORS.BACKGROUND,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    paddingTop: ONBOARDING_SPACING.PAGE_VERTICAL + ONBOARDING_SPACING.SM,
  },
  titleContainer: {
    marginBottom: ONBOARDING_SPACING.SECTION_GAP + ONBOARDING_SPACING.MD,
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 28, // Slightly smaller for this page
    marginBottom: ONBOARDING_SPACING.SM,
    textAlign: 'center',
  },
  subtitle: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: ONBOARDING_SPACING.LG,
  },
  nameContainer: {
    flexDirection: 'row',
    gap: ONBOARDING_SPACING.MD,
    marginTop: ONBOARDING_SPACING.MD,
    marginBottom: ONBOARDING_SPACING.LG,
  },
  nameInputWrapper: {
    flex: 1,
  },
  inputLabel: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 17,
    marginBottom: ONBOARDING_SPACING.SM,
  },
  nameInput: {
    borderRadius: ONBOARDING_BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: ONBOARDING_COLORS.BORDER,
    paddingHorizontal: ONBOARDING_SPACING.MD,
    paddingVertical: ONBOARDING_SPACING.MD,
    minHeight: 54,
    color: ONBOARDING_COLORS.TEXT_PRIMARY,
    backgroundColor: ONBOARDING_COLORS.SURFACE,
    fontSize: 18,
  },
  titleSecondary: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 22,
    marginBottom: ONBOARDING_SPACING.SM,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding2;
