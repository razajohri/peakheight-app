// Onboarding5.js (Page 5 - What is your height & weight?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import HapticFeedback from '../../utils/hapticFeedback';
import { Ionicons } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS,
  ONBOARDING_BORDER_RADIUS 
} from '../../utils/onboardingConstants';

const Onboarding5 = ({ navigation, data, updateData }) => {
  const [measurementSystem, setMeasurementSystem] = useState(data.measurementSystem || 'imperial'); // 'imperial' or 'metric'
  

  // Imperial
  const [feet, setFeet] = useState(data.feet || 0);
  const [inches, setInches] = useState(data.inches || 0);
  const [pounds, setPounds] = useState(data.pounds || 0);

  // Metric
  const [cm, setCm] = useState(data.cm || 0);
  const [kg, setKg] = useState(data.kg || 0);


  const updateMeasurementSystem = (system) => {
    setMeasurementSystem(system);
    updateData({ measurementSystem: system });
  };

  const updateHeightWeight = () => {
    if (measurementSystem === 'imperial') {
      const heightInCm = (feet * 30.48) + (inches * 2.54);
      const weightInKg = pounds * 0.453592;
      updateData({
        feet,
        inches,
        pounds,
        currentHeight: heightInCm,
        currentWeight: weightInKg
      });
    } else {
      const heightInFeet = Math.floor(cm / 30.48);
      const heightInInches = Math.round((cm % 30.48) / 2.54);
      const weightInPounds = Math.round(kg / 0.453592);
      updateData({
        cm,
        kg,
        currentHeight: cm,
        currentWeight: kg,
        feet: heightInFeet,
        inches: heightInInches,
        pounds: weightInPounds
      });
    }
  };

  const handleContinue = () => {
    // Validate that user has entered valid values
    if (measurementSystem === 'imperial') {
      if (feet === 0 && inches === 0) {
        alert('Please enter your height');
        return;
      }
      if (pounds === 0) {
        alert('Please enter your weight');
        return;
      }
    } else {
      if (cm === 0) {
        alert('Please enter your height');
        return;
      }
      if (kg === 0) {
        alert('Please enter your weight');
        return;
      }
    }

    updateHeightWeight();
    navigation.navigate('Onboarding5B');
  };

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={5} 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={true}
      >
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit={true}>What is your height & weight?</Text>
          </View>

          <View style={styles.segmentContainer}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                measurementSystem === 'imperial' && styles.segmentButtonActive
              ]}
              onPress={async () => {
                try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
                updateMeasurementSystem('imperial');
              }}
            >
              <Text style={[
                styles.segmentButtonText,
                measurementSystem === 'imperial' && styles.segmentButtonTextActive
              ]}>Imperial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentButton,
                measurementSystem === 'metric' && styles.segmentButtonActive
              ]}
              onPress={async () => {
                try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
                updateMeasurementSystem('metric');
              }}
            >
              <Text style={[
                styles.segmentButtonText,
                measurementSystem === 'metric' && styles.segmentButtonTextActive
              ]}>Metric</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Height</Text>

            {measurementSystem === 'imperial' ? (
              <View>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Feet</Text>
                  <View style={styles.sliderValueContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={7}
                      step={1}
                      value={feet}
                      onValueChange={(value) => {
                        HapticFeedback.selection();
                        setFeet(value);
                        updateHeightWeight();
                      }}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#1f1f1f"
                      thumbTintColor="#FFFFFF"
                    />
                    <Text style={styles.sliderValue}>{feet} ft</Text>
                  </View>
                </View>

                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Inches</Text>
                  <View style={styles.sliderValueContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={11}
                      step={1}
                      value={inches}
                      onValueChange={(value) => {
                        HapticFeedback.selection();
                        setInches(value);
                        updateHeightWeight();
                      }}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#1f1f1f"
                      thumbTintColor="#FFFFFF"
                    />
                    <Text style={styles.sliderValue}>{inches} in</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Centimeters</Text>
                <View style={styles.sliderValueContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={220}
                    step={1}
                    value={cm}
                    onValueChange={(value) => {
                      HapticFeedback.selection();
                      setCm(value);
                      updateHeightWeight();
                    }}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#1f1f1f"
                    thumbTintColor="#FFFFFF"
                  />
                  <Text style={styles.sliderValue}>{cm} cm</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Weight</Text>

            {measurementSystem === 'imperial' ? (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Pounds</Text>
                <View style={styles.sliderValueContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={300}
                    step={1}
                    value={pounds}
                    onValueChange={(value) => {
                      HapticFeedback.selection();
                      setPounds(value);
                      updateHeightWeight();
                    }}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#1f1f1f"
                    thumbTintColor="#FFFFFF"
                  />
                  <Text style={styles.sliderValue}>{pounds} lbs</Text>
                </View>
              </View>
            ) : (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Kilograms</Text>
                <View style={styles.sliderValueContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={136}
                    step={1}
                    value={kg}
                    onValueChange={(value) => {
                      HapticFeedback.selection();
                      setKg(value);
                      updateHeightWeight();
                    }}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#1f1f1f"
                    thumbTintColor="#FFFFFF"
                  />
                  <Text style={styles.sliderValue}>{kg} kg</Text>
                </View>
              </View>
            )}
          </View>


        </View>
      </ScrollView>

      <View style={styles.helperTextContainer}>
        <Text style={styles.helperText}>This will be used to create your personal plan</Text>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={handleContinue}
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
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    paddingTop: ONBOARDING_SPACING.PAGE_VERTICAL,
    paddingBottom: ONBOARDING_SPACING.LG,
  },
  titleContainer: {
    marginBottom: ONBOARDING_SPACING.SECTION_GAP,
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 25,
    textAlign: 'center',
  },
  subtitle: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    textAlign: 'center',
    marginBottom: ONBOARDING_SPACING.LG,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginBottom: ONBOARDING_SPACING.LG,
    borderRadius: ONBOARDING_BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: ONBOARDING_COLORS.BORDER,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: ONBOARDING_SPACING.SM + 4,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: ONBOARDING_COLORS.SURFACE_ELEVATED,
  },
  segmentButtonText: {
    ...ONBOARDING_TYPOGRAPHY.BODY,
    fontSize: 16,
  },
  segmentButtonTextActive: {
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: ONBOARDING_SPACING.SECTION_GAP,
  },
  sectionTitle: {
    ...ONBOARDING_TYPOGRAPHY.BODY,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: ONBOARDING_SPACING.MD,
  },
  sliderContainer: {
    marginBottom: ONBOARDING_SPACING.MD,
  },
  sliderLabel: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 14,
    marginBottom: ONBOARDING_SPACING.SM,
  },
  sliderValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    ...ONBOARDING_TYPOGRAPHY.OPTION_TEXT,
    fontSize: 16,
    width: 60,
    textAlign: 'right',
  },
  confidenceTag: {
    alignSelf: 'flex-start',
    backgroundColor: ONBOARDING_COLORS.SURFACE,
    paddingVertical: ONBOARDING_SPACING.XS,
    paddingHorizontal: ONBOARDING_SPACING.SM + 4,
    borderRadius: ONBOARDING_BORDER_RADIUS.SM,
    marginTop: ONBOARDING_SPACING.SM,
    borderWidth: 1,
    borderColor: ONBOARDING_COLORS.BORDER,
  },
  confidenceText: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 12,
  },
  helperTextContainer: {
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    marginBottom: ONBOARDING_SPACING.SM,
  },
  helperText: {
    ...ONBOARDING_TYPOGRAPHY.BODY,
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding5;
