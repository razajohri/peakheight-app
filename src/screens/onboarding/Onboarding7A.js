// Onboarding7A.js (Page 7A - What have you tried?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import OnboardingOptionCard from '../../components/onboarding/OnboardingOptionCard';
import HapticFeedback from '../../utils/hapticFeedback';
import { Ionicons } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS 
} from '../../utils/onboardingConstants';

const Onboarding7A = ({ navigation, data, updateData }) => {
  const [selectedOptions, setSelectedOptions] = useState(data.triedOptions || []);

  const triedOptions = [
    { id: 'supplements', label: 'Supplements', icon: 'medical-outline' },
    { id: 'exercises', label: 'Exercises', icon: 'barbell-outline' },
    { id: 'diet', label: 'Diet changes', icon: 'restaurant-outline' },
    { id: 'posture', label: 'Posture correction', icon: 'fitness-outline' },
    { id: 'nothing', label: 'Nothing yet', icon: 'close-circle-outline' },
  ];

  const toggleOption = (optionId) => {
    HapticFeedback.selection();
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId];
    setSelectedOptions(newSelection);
    updateData({ triedOptions: newSelection });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={9} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What have you tried?</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>

        <ScrollView 
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {triedOptions.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            return (
              <OnboardingOptionCard
                key={option.id}
                label={option.label}
                icon={option.icon}
                iconPosition="right"
                selected={isSelected}
                onPress={() => toggleOption(option.id)}
                showCheckmark={isSelected}
              />
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => navigation.navigate('Onboarding8')}
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
    paddingTop: ONBOARDING_SPACING.SM,
  },
  titleContainer: {
    marginBottom: ONBOARDING_SPACING.SECTION_GAP,
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 29,
    marginBottom: ONBOARDING_SPACING.SM,
    textAlign: 'center',
  },
  subtitle: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    marginTop: ONBOARDING_SPACING.MD,
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding7A;

