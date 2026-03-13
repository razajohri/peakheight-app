// Onboarding10.js (Page 10 - How many hours do you sleep?)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import HapticFeedback from '../../utils/hapticFeedback';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS 
} from '../../utils/onboardingConstants';

const Onboarding10 = ({ navigation, data, updateData }) => {
  const [sleepHours, setSleepHours] = useState(data.sleepHours || 6.5);
  
  // Initialize default value if not set
  useEffect(() => {
    if (!data.sleepHours || data.sleepHours === 0) {
      updateData({ sleepHours: 6.5 });
    }
  }, []);

  const updateSleepHours = (hours) => {
    updateData({ sleepHours: hours });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={12} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit={true}>How many hours do you sleep?</Text>
          <Text style={styles.subtitle}>This helps us optimize your growth plan</Text>
        </View>

        <View style={styles.sleepContainerWrapper}>
          <View style={styles.sleepContainer}>
            <Text style={styles.sleepValue}>{sleepHours === 0 ? '—' : sleepHours}</Text>
            <Text style={styles.sleepLabel}>
              {sleepHours === 0 ? 'Select hours' : sleepHours === 1 ? 'hour per night' : 'hours per night'}
            </Text>
          </View>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={12}
            step={0.5}
            value={sleepHours}
            onValueChange={(value) => {
              HapticFeedback.selection();
              setSleepHours(value);
              updateSleepHours(value);
            }}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#1f1f1f"
            thumbTintColor="#FFFFFF"
          />

          <View style={styles.sliderLabelsContainer}>
            <Text style={styles.sliderLabel}>0 hrs</Text>
            <Text style={styles.sliderLabel}>12 hrs</Text>
          </View>
        </View>

        {sleepHours > 0 && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {sleepHours < 7
                ? "You may not be getting enough sleep for optimal growth hormone production."
                : sleepHours >= 9
                  ? "Great! You're getting plenty of sleep for optimal growth hormone production."
                  : "Good! 7-9 hours is recommended for optimal growth hormone production."}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => {
            if (!sleepHours || sleepHours === 0) {
              Alert.alert(
                'Sleep Hours Required',
                'Please select how many hours you sleep per night to continue.',
                [{ text: 'OK', style: 'default' }]
              );
              return;
            }
            navigation.navigate('Onboarding11');
          }}
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
  sleepContainerWrapper: {
    alignSelf: 'center',
    marginBottom: 40,
    marginTop: 24,
    width: 240,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sleepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    borderRadius: 100,
    paddingVertical: 36,
    paddingHorizontal: 48,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    width: '100%',
    height: '100%',
  },
  sleepValue: {
    fontWeight: 'bold',
    fontSize: 56,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  sleepLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 8,
  },
  sliderContainer: {
    marginBottom: 32,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding10;
