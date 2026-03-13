// Onboarding4.js (Page 4 - What is your ethnicity?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import OnboardingOptionCard from '../../components/onboarding/OnboardingOptionCard';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS 
} from '../../utils/onboardingConstants';

const Onboarding4 = ({ navigation, data, updateData }) => {
  const [selectedEthnicity, setSelectedEthnicity] = useState(data.ethnicity || null);
  

  const ethnicities = [
    'Asian',
    'Black/African',
    'Caucasian/White',
    'Hispanic/Latino',
    'Mixed/Other',
    'Prefer not to say'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={4} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What is your ethnicity?</Text>
          <Text style={styles.subtitle}>This helps us personalize your growth plan</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.optionsContainer}>
            {ethnicities.map((ethnicity) => (
              <OnboardingOptionCard
                key={ethnicity}
                label={ethnicity}
                selected={selectedEthnicity === ethnicity}
                onPress={() => {
                  setSelectedEthnicity(ethnicity);
                  updateData({ ethnicity });
                }}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => navigation.navigate('Onboarding5')}
          disabled={!selectedEthnicity}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ONBOARDING_COLORS.BACKGROUND,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    paddingTop: ONBOARDING_SPACING.PAGE_VERTICAL,
  },
  titleContainer: {
    marginBottom: ONBOARDING_SPACING.SECTION_GAP,
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 28,
    marginBottom: ONBOARDING_SPACING.SM,
    textAlign: 'center',
  },
  subtitle: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  optionsContainer: {
    paddingBottom: ONBOARDING_SPACING.MD,
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding4;
