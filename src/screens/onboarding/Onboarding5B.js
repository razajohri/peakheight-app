// Onboarding5B.js (Page 5B - What's your dream height?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const Onboarding5B = ({ navigation, data, updateData }) => {
  const [measurementSystem, setMeasurementSystem] = useState(data.measurementSystem || 'imperial'); // 'imperial' or 'metric'

  // Imperial Dream Height
  const [dreamFeet, setDreamFeet] = useState(data.dreamFeet || 5);
  const [dreamInches, setDreamInches] = useState(data.dreamInches || 8);

  // Metric Dream Height
  const [dreamCm, setDreamCm] = useState(data.dreamCm || 173);

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
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '40%' }]} />
        </View>
        <Text style={styles.progressText}>5B/15</Text>
      </View>

      <View style={styles.contentContainer}>
          <Text style={styles.title}>What's your dream height?</Text>

          <View style={styles.segmentContainer}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                measurementSystem === 'imperial' && styles.segmentButtonActive
              ]}
              onPress={() => updateMeasurementSystem('imperial')}
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
              onPress={() => updateMeasurementSystem('metric')}
            >
              <Text style={[
                styles.segmentButtonText,
                measurementSystem === 'metric' && styles.segmentButtonTextActive
              ]}>Metric</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            {measurementSystem === 'imperial' ? (
              <View>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Feet</Text>
                  <View style={styles.sliderValueContainer}>
                    <Text style={styles.sliderValue}>{dreamFeet}</Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={4}
                    maximumValue={7}
                    step={1}
                    value={dreamFeet}
                    onValueChange={setDreamFeet}
                    onSlidingComplete={updateDreamHeight}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#1f1f1f"
                    thumbTintColor="#FFFFFF"
                  />
                </View>

                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Inches</Text>
                  <View style={styles.sliderValueContainer}>
                    <Text style={styles.sliderValue}>{dreamInches}</Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={11}
                    step={1}
                    value={dreamInches}
                    onValueChange={setDreamInches}
                    onSlidingComplete={updateDreamHeight}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#1f1f1f"
                    thumbTintColor="#FFFFFF"
                  />
                </View>

                <View style={styles.displayContainer}>
                  <Text style={styles.displayText}>
                    {dreamFeet}'{dreamInches}"
                  </Text>
                  <Text style={styles.displaySubtext}>
                    {Math.round((dreamFeet * 30.48) + (dreamInches * 2.54))} cm
                  </Text>
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Centimeters</Text>
                  <View style={styles.sliderValueContainer}>
                    <Text style={styles.sliderValue}>{dreamCm}</Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={120}
                    maximumValue={220}
                    step={1}
                    value={dreamCm}
                    onValueChange={setDreamCm}
                    onSlidingComplete={updateDreamHeight}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#1f1f1f"
                    thumbTintColor="#FFFFFF"
                  />
                </View>

                <View style={styles.displayContainer}>
                  <Text style={styles.displayText}>
                    {dreamCm} cm
                  </Text>
                  <Text style={styles.displaySubtext}>
                    {Math.floor(dreamCm / 30.48)}'{Math.round((dreamCm % 30.48) / 2.54)}"
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => { try { require('../../utils/hapticFeedback').default.light(); } catch {} ; handleContinue(); }}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1f1f1f',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  contentContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 40,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 4,
    marginTop: 10,
    marginBottom: 24,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  segmentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  segmentButtonTextActive: {
    color: '#000000',
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
  },
  sliderValueContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 24,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  continueButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minWidth: 180,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
});

export default Onboarding5B;
