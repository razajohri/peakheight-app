// Onboarding6.js (Page 6 - How tall are your parents?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const Onboarding6 = ({ navigation, data, updateData }) => {
  const [measurementSystem, setMeasurementSystem] = useState(data.parentMeasurementSystem || 'imperial'); // 'imperial' or 'metric'

  // Imperial
  const [fatherFeet, setFatherFeet] = useState(data.fatherFeet || 0);
  const [fatherInches, setFatherInches] = useState(data.fatherInches || 0);
  const [motherFeet, setMotherFeet] = useState(data.motherFeet || 0);
  const [motherInches, setMotherInches] = useState(data.motherInches || 0);

  // Metric
  const [fatherCm, setFatherCm] = useState(data.fatherCm || 0);
  const [motherCm, setMotherCm] = useState(data.motherCm || 0);

  const updateParentHeights = () => {
    if (measurementSystem === 'imperial') {
      const fatherHeightInCm = (fatherFeet * 30.48) + (fatherInches * 2.54);
      const motherHeightInCm = (motherFeet * 30.48) + (motherInches * 2.54);
      updateData({
        fatherFeet,
        fatherInches,
        motherFeet,
        motherInches,
        parentHeightFather: fatherHeightInCm,
        parentHeightMother: motherHeightInCm,
        parentMeasurementSystem: measurementSystem
      });
    } else {
      const fatherHeightInFeet = Math.floor(fatherCm / 30.48);
      const fatherHeightInInches = Math.round((fatherCm % 30.48) / 2.54);
      const motherHeightInFeet = Math.floor(motherCm / 30.48);
      const motherHeightInInches = Math.round((motherCm % 30.48) / 2.54);
      updateData({
        fatherCm,
        motherCm,
        parentHeightFather: fatherCm,
        parentHeightMother: motherCm,
        fatherFeet: fatherHeightInFeet,
        fatherInches: fatherHeightInInches,
        motherFeet: motherHeightInFeet,
        motherInches: motherHeightInInches,
        parentMeasurementSystem: measurementSystem
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '40%' }]} />
        </View>
        <Text style={styles.progressText}>6/15</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>How tall are your parents?</Text>

          <View style={styles.segmentContainer}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                measurementSystem === 'imperial' && styles.segmentButtonActive
              ]}
              onPress={() => setMeasurementSystem('imperial')}
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
              onPress={() => setMeasurementSystem('metric')}
            >
              <Text style={[
                styles.segmentButtonText,
                measurementSystem === 'metric' && styles.segmentButtonTextActive
              ]}>Metric</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Father's height</Text>

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
                      value={fatherFeet}
                      onValueChange={(value) => {
                        setFatherFeet(value);
                        updateParentHeights();
                      }}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#1f1f1f"
                      thumbTintColor="#FFFFFF"
                    />
                    <Text style={styles.sliderValue}>{fatherFeet} ft</Text>
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
                      value={fatherInches}
                      onValueChange={(value) => {
                        setFatherInches(value);
                        updateParentHeights();
                      }}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#1f1f1f"
                      thumbTintColor="#FFFFFF"
                    />
                    <Text style={styles.sliderValue}>{fatherInches} in</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Centimeters</Text>
                <View style={styles.sliderValueContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={150}
                    maximumValue={220}
                    step={1}
                    value={fatherCm}
                      onValueChange={(value) => {
                        setFatherCm(value);
                        updateParentHeights();
                      }}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#1f1f1f"
                    thumbTintColor="#FFFFFF"
                  />
                  <Text style={styles.sliderValue}>{fatherCm} cm</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Mother's height</Text>

            {measurementSystem === 'imperial' ? (
              <View>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Feet</Text>
                  <View style={styles.sliderValueContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={4}
                      maximumValue={6}
                      step={1}
                      value={motherFeet}
                      onValueChange={(value) => {
                        setMotherFeet(value);
                        updateParentHeights();
                      }}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#1f1f1f"
                      thumbTintColor="#FFFFFF"
                    />
                    <Text style={styles.sliderValue}>{motherFeet} ft</Text>
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
                      value={motherInches}
                      onValueChange={(value) => {
                        setMotherInches(value);
                        updateParentHeights();
                      }}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#1f1f1f"
                      thumbTintColor="#FFFFFF"
                    />
                    <Text style={styles.sliderValue}>{motherInches} in</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Centimeters</Text>
                <View style={styles.sliderValueContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={140}
                    maximumValue={190}
                    step={1}
                    value={motherCm}
                      onValueChange={(value) => {
                        setMotherCm(value);
                        updateParentHeights();
                      }}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#1f1f1f"
                    thumbTintColor="#FFFFFF"
                  />
                  <Text style={styles.sliderValue}>{motherCm} cm</Text>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              updateParentHeights();
              // Clear parent height fields and proceed
              updateData({
                parentHeightFather: null,
                parentHeightMother: null,
                fatherFeet: null,
                fatherInches: null,
                motherFeet: null,
                motherInches: null,
                fatherCm: null,
                motherCm: null,
                parentMeasurementSystem: measurementSystem
              });
              navigation.navigate('Onboarding7');
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.skipButtonText}>I don't know</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding7')}
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
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
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

export default Onboarding6;
