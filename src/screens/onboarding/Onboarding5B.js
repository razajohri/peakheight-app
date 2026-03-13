// Onboarding5B.js (Page 5B - What's your dream height?)
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

const Onboarding5B = ({ navigation, data, updateData }) => {
  const [measurementSystem, setMeasurementSystem] = useState(data.measurementSystem || 'imperial'); // 'imperial' or 'metric'
  

  // Imperial Dream Height
  const [dreamFeet, setDreamFeet] = useState(data.dreamFeet || 0);
  const [dreamInches, setDreamInches] = useState(data.dreamInches || 0);

  // Metric Dream Height
  const [dreamCm, setDreamCm] = useState(data.dreamCm || 0);

  const updateMeasurementSystem = (system) => {
    setMeasurementSystem(system);
    updateData({ measurementSystem: system });
  };

  const updateDreamHeight = () => {
    if (measurementSystem === 'imperial') {
      const dreamHeightInCm = (dreamFeet * 30.48) + (dreamInches * 2.54);
      updateData({
        dreamFeet,
        dreamInches,
        dreamCm: dreamHeightInCm,
        targetHeight: dreamHeightInCm
      });
    } else {
      const dreamHeightInFeet = Math.floor(dreamCm / 30.48);
      const dreamHeightInInches = Math.round((dreamCm % 30.48) / 2.54);
      updateData({
        dreamCm,
        dreamFeet: dreamHeightInFeet,
        dreamInches: dreamHeightInInches,
        targetHeight: dreamCm
      });
    }
  };

  const handleContinue = () => {
    updateDreamHeight();
    navigation.navigate('Onboarding6');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={6} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What's your Dream Height?</Text>
        </View>

        <View style={styles.unitSelector}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              styles.unitButtonFirst,
              measurementSystem === 'imperial' && styles.unitButtonSelected
            ]}
            onPress={async () => {
              try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
              updateMeasurementSystem('imperial');
            }}
          >
            <Text style={[
              styles.unitButtonText,
              measurementSystem === 'imperial' && styles.unitButtonTextSelected
            ]}>ft/in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.unitButton,
              measurementSystem === 'metric' && styles.unitButtonSelected
            ]}
            onPress={async () => {
              try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
              updateMeasurementSystem('metric');
            }}
          >
            <Text style={[
              styles.unitButtonText,
              measurementSystem === 'metric' && styles.unitButtonTextSelected
            ]}>cm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heightDisplaySection}>
          <Text style={styles.heightLabel}>Gain Height</Text>
          <Text style={styles.heightValue}>
            {measurementSystem === 'imperial' 
              ? `${dreamFeet}'${dreamInches}"`
              : `${dreamCm} cm`
            }
          </Text>
        </View>

        <View style={styles.rulerContainer}>
          {measurementSystem === 'imperial' ? (
            <View style={styles.rulerWrapper}>
              <View style={styles.ruler} pointerEvents="none">
                {Array.from({ length: 71 }, (_, i) => {
                  const value = 0 + (i * 0.1);
                  const currentValue = dreamFeet + (dreamInches / 12);
                  const isMajorTick = i % 10 === 0;
                  const isActive = Math.abs(value - currentValue) < 0.05;
                  
                  return (
                    <View
                      key={i}
                      style={[
                        styles.tick,
                        isMajorTick && styles.majorTick,
                        isActive && styles.activeTick
                      ]}
                    />
                  );
                })}
              </View>
              <Slider
                style={styles.horizontalSlider}
                minimumValue={0}
                maximumValue={7}
                step={0.0833}
                value={dreamFeet + (dreamInches / 12)}
                onValueChange={(value) => {
                  HapticFeedback.selection();
                  const newFeet = Math.floor(value);
                  const newInches = Math.round((value % 1) * 12);
                  setDreamFeet(newFeet);
                  setDreamInches(newInches);
                  // Update data in real-time
                  const dreamHeightInCm = (newFeet * 30.48) + (newInches * 2.54);
                  updateData({
                    dreamFeet: newFeet,
                    dreamInches: newInches,
                    dreamCm: dreamHeightInCm,
                    targetHeight: dreamHeightInCm
                  });
                }}
                onSlidingComplete={updateDreamHeight}
                minimumTrackTintColor="rgba(255, 255, 255, 0.1)"
                maximumTrackTintColor="rgba(31, 31, 31, 0.3)"
                thumbTintColor="#FFFFFF"
              />
            </View>
          ) : (
            <View style={styles.rulerWrapper}>
              <View style={styles.ruler} pointerEvents="none">
                {Array.from({ length: 221 }, (_, i) => {
                  const value = 0 + i;
                  const isMajorTick = i % 10 === 0;
                  const isActive = Math.round(value) === Math.round(dreamCm);
                  
                  return (
                    <View
                      key={i}
                      style={[
                        styles.tick,
                        isMajorTick && styles.majorTick,
                        isActive && styles.activeTick
                      ]}
                    />
                  );
                })}
              </View>
              <Slider
                style={styles.horizontalSlider}
                minimumValue={0}
                maximumValue={220}
                step={1}
                value={dreamCm}
                onValueChange={(value) => {
                  HapticFeedback.selection();
                  setDreamCm(value);
                  // Update data in real-time
                  const dreamHeightInFeet = Math.floor(value / 30.48);
                  const dreamHeightInInches = Math.round((value % 30.48) / 2.54);
                  updateData({
                    dreamCm: value,
                    dreamFeet: dreamHeightInFeet,
                    dreamInches: dreamHeightInInches,
                    targetHeight: value
                  });
                }}
                onSlidingComplete={updateDreamHeight}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#1f1f1f"
                thumbTintColor="#FFFFFF"
              />
            </View>
          )}
        </View>

        <View style={styles.helperTextContainer}>
          <Text style={styles.helperText}>This will be used to create your personal plan</Text>
        </View>
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
    flex: 1,
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    paddingTop: ONBOARDING_SPACING.PAGE_VERTICAL,
  },
  titleContainer: {
    marginBottom: ONBOARDING_SPACING.LG,
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 28,
    textAlign: 'center',
  },
  unitSelector: {
    flexDirection: 'row',
    marginBottom: ONBOARDING_SPACING.SECTION_GAP,
  },
  unitButton: {
    flex: 1,
    paddingVertical: ONBOARDING_SPACING.SM + 4,
    paddingHorizontal: ONBOARDING_SPACING.LG,
    borderRadius: ONBOARDING_BORDER_RADIUS.SM,
    backgroundColor: ONBOARDING_COLORS.SURFACE_ELEVATED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitButtonFirst: {
    marginRight: ONBOARDING_SPACING.SM + 4,
  },
  unitButtonSelected: {
    backgroundColor: ONBOARDING_COLORS.BUTTON_BACKGROUND,
  },
  unitButtonText: {
    ...ONBOARDING_TYPOGRAPHY.BODY,
    fontSize: 16,
    fontWeight: '600',
    color: ONBOARDING_COLORS.TEXT_SECONDARY,
  },
  unitButtonTextSelected: {
    color: ONBOARDING_COLORS.BACKGROUND,
  },
  heightDisplaySection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heightLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  heightValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  rulerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  helperTextContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  helperText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
  },
  rulerWrapper: {
    position: 'relative',
    height: 80,
    justifyContent: 'center',
  },
  ruler: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    paddingHorizontal: 12,
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  tick: {
    width: 1,
    height: 8,
    backgroundColor: '#1f1f1f',
    flex: 0,
  },
  majorTick: {
    height: 16,
    backgroundColor: '#2a2a2a',
  },
  activeTick: {
    height: 24,
    backgroundColor: '#FFFFFF',
    width: 2,
  },
  horizontalSlider: {
    width: '100%',
    height: 40,
    position: 'absolute',
    left: 0,
    right: 0,
    marginHorizontal: 0,
    zIndex: 2,
  },
  inputSection: {
    flex: 1,
    justifyContent: 'center',
  },
  imperialContainer: {
    alignItems: 'center',
  },
  metricContainer: {
    alignItems: 'center',
  },
  heightDisplay: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  heightValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heightSubtext: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  sliderGroup: {
    width: '100%',
    gap: 24,
  },
  sliderItem: {
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 28,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  sliderValueContainer: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sliderValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  slider: {
    width: '100%',
    height: 40,
  },

  displayContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
    borderRadius: 0,
    marginTop: 8,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  displayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  displaySubtext: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding5B;
