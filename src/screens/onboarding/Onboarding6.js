// Onboarding6.js (Page 6 - How tall are your parents?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';

const Onboarding6 = ({ navigation }) => {
  const [measurementSystem, setMeasurementSystem] = useState('imperial'); // 'imperial' or 'metric'

  // Imperial
  const [fatherFeet, setFatherFeet] = useState(5);
  const [fatherInches, setFatherInches] = useState(10);
  const [motherFeet, setMotherFeet] = useState(5);
  const [motherInches, setMotherInches] = useState(4);

  // Metric
  const [fatherCm, setFatherCm] = useState(178);
  const [motherCm, setMotherCm] = useState(163);

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
                      onValueChange={setFatherFeet}
                      minimumTrackTintColor="#3B5FE3"
                      maximumTrackTintColor="#2A2F3E"
                      thumbTintColor="#3B5FE3"
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
                      onValueChange={setFatherInches}
                      minimumTrackTintColor="#3B5FE3"
                      maximumTrackTintColor="#2A2F3E"
                      thumbTintColor="#3B5FE3"
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
                    onValueChange={setFatherCm}
                    minimumTrackTintColor="#3B5FE3"
                    maximumTrackTintColor="#2A2F3E"
                    thumbTintColor="#3B5FE3"
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
                      onValueChange={setMotherFeet}
                      minimumTrackTintColor="#3B5FE3"
                      maximumTrackTintColor="#2A2F3E"
                      thumbTintColor="#3B5FE3"
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
                      onValueChange={setMotherInches}
                      minimumTrackTintColor="#3B5FE3"
                      maximumTrackTintColor="#2A2F3E"
                      thumbTintColor="#3B5FE3"
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
                    onValueChange={setMotherCm}
                    minimumTrackTintColor="#3B5FE3"
                    maximumTrackTintColor="#2A2F3E"
                    thumbTintColor="#3B5FE3"
                  />
                  <Text style={styles.sliderValue}>{motherCm} cm</Text>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.skipButton}>
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
    backgroundColor: '#0A0F1D', // Deep navy base
    paddingTop: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#2A2F3E', // Darker gray
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#3B5FE3', // Cobalt accent
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 32,
    letterSpacing: -0.5, // Tighter letter-spacing for headlines
  },
  segmentContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9', // Platinum gray
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#3B5FE3', // Cobalt accent
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
    color: '#AAAAAA',
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
    color: '#AAAAAA',
  },
  buttonContainer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#3B5FE3', // Cobalt accent
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default Onboarding6;
