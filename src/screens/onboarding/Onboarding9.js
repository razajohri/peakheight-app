// Onboarding9.js (Page 9 - How often do you work out?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import HapticFeedback from '../../utils/hapticFeedback';
import { Ionicons } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS 
} from '../../utils/onboardingConstants';

const mapLegacyFrequency = (value) => {
  if (value === '3-5') return '3-4';
  if (value === '6+') return '5-7';
  return value;
};

const Onboarding9 = ({ navigation, data, updateData }) => {
  const [selectedFrequency, setSelectedFrequency] = useState(mapLegacyFrequency(data.workoutFrequency) || null);
  

  const frequencies = [
    { id: '0-2', label: '0-2 times a week', icon: 'circle' },
    { id: '3-4', label: '3-4 times a week', icon: 'dots3' },
    { id: '5-7', label: '5-7 times a week', icon: 'dots6' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={11} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>How often do you work out?</Text>
        </View>

        <View style={styles.optionsContainer}>
          {frequencies.map((frequency) => {
            const isSelected = selectedFrequency === frequency.id;
            return (
              <TouchableOpacity
                key={frequency.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.selectedCard
                ]}
                onPress={() => {
                  HapticFeedback.selection();
                  setSelectedFrequency(frequency.id);
                  updateData({ workoutFrequency: frequency.id });
                }}
              >
                <View style={styles.optionContent}>
                  <View style={styles.iconContainer}>
                    {frequency.icon === 'circle' ? (
                      <View style={styles.singleDotWrapper}>
                        <View style={styles.singleDot} />
                      </View>
                    ) : frequency.icon === 'dots3' ? (
                      <View style={styles.dotsContainer}>
                        <View style={[styles.dot, !isSelected && styles.dotDark, { marginBottom: 2 }]} />
                        <View style={styles.dotsRow}>
                          <View style={[styles.dot, !isSelected && styles.dotDark, styles.dotMargin]} />
                          <View style={[styles.dot, !isSelected && styles.dotDark]} />
                        </View>
                      </View>
                    ) : (
                      <View style={styles.dotsContainer6}>
                        <View style={styles.dotsRow}>
                          <View style={[styles.dot, !isSelected && styles.dotDark, styles.dotMargin]} />
                          <View style={[styles.dot, !isSelected && styles.dotDark, styles.dotMargin]} />
                          <View style={[styles.dot, !isSelected && styles.dotDark]} />
                        </View>
                        <View style={styles.dotsRow}>
                          <View style={[styles.dot, !isSelected && styles.dotDark, styles.dotMargin]} />
                          <View style={[styles.dot, !isSelected && styles.dotDark, styles.dotMargin]} />
                          <View style={[styles.dot, !isSelected && styles.dotDark]} />
                        </View>
                      </View>
                    )}
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={[
                      styles.optionLabel,
                      isSelected && styles.selectedLabel
                    ]}>{frequency.label}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.subtitleBelow}>
          This will be used to calibrate your custom plan.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => navigation.navigate('Onboarding10')}
          disabled={!selectedFrequency}
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
    marginBottom: ONBOARDING_SPACING.LG,
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 28,
    marginBottom: ONBOARDING_SPACING.SM,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#1f1f1f',
    backgroundColor: '#0a0a0a',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: '#FFFFFF',
    backgroundColor: '#1f1f1f',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  singleDotWrapper: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  dotsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  dotsContainer6: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  dotMargin: {
    marginRight: 4,
  },
  dotDark: {
    backgroundColor: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
  subtitleBelow: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding9;
