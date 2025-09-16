// Onboarding5.js (Page 5 - What is your height & weight?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const Onboarding5 = ({ navigation, data, updateData }) => {
  const [measurementSystem, setMeasurementSystem] = useState(data.measurementSystem || 'imperial'); // 'imperial' or 'metric'

  // Imperial
  const [feet, setFeet] = useState(data.feet || 5);
  const [inches, setInches] = useState(data.inches || 6);
  const [pounds, setPounds] = useState(data.pounds || 150);

  // Metric
  const [cm, setCm] = useState(data.cm || 168);
  const [kg, setKg] = useState(data.kg || 68);


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
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
        <Text style={styles.progressText}>5/15</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>What is your height & weight?</Text>

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
                      minimumValue={4}
                      maximumValue={7}
                      step={1}
                      value={feet}
                      onValueChange={(value) => {
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
                    minimumValue={120}
                    maximumValue={220}
                    step={1}
                    value={cm}
                    onValueChange={(value) => {
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
                    minimumValue={80}
                    maximumValue={300}
                    step={1}
                    value={pounds}
                    onValueChange={(value) => {
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
                    minimumValue={36}
                    maximumValue={136}
                    step={1}
                    value={kg}
                    onValueChange={(value) => {
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


          <View style={styles.confidenceTag}>
            <Text style={styles.confidenceText}>Confidence: High</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
            handleContinue();
          }}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 4,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#1f1f1f',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#111111',
  },
  segmentButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  segmentButtonTextActive: {
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
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
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    width: 60,
    textAlign: 'right',
  },
  confidenceTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#0a0a0a',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  confidenceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#9CA3AF',
  },
  buttonContainer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
});

export default Onboarding5;
