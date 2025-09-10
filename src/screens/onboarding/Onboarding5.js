// Onboarding5.js (Page 5 - What is your height & weight?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';

const Onboarding5 = ({ navigation }) => {
  const [measurementSystem, setMeasurementSystem] = useState('imperial'); // 'imperial' or 'metric'

  // Imperial
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(8);
  const [pounds, setPounds] = useState(150);

  // Metric
  const [cm, setCm] = useState(173);
  const [kg, setKg] = useState(68);

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
                      onValueChange={setFeet}
                      minimumTrackTintColor="#3B5FE3"
                      maximumTrackTintColor="#2A2F3E"
                      thumbTintColor="#3B5FE3"
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
                      onValueChange={setInches}
                      minimumTrackTintColor="#3B5FE3"
                      maximumTrackTintColor="#2A2F3E"
                      thumbTintColor="#3B5FE3"
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
                    onValueChange={setCm}
                    minimumTrackTintColor="#3B5FE3"
                    maximumTrackTintColor="#2A2F3E"
                    thumbTintColor="#3B5FE3"
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
                    onValueChange={setPounds}
                    minimumTrackTintColor="#3B5FE3"
                    maximumTrackTintColor="#2A2F3E"
                    thumbTintColor="#3B5FE3"
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
                    onValueChange={setKg}
                    minimumTrackTintColor="#3B5FE3"
                    maximumTrackTintColor="#2A2F3E"
                    thumbTintColor="#3B5FE3"
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
          onPress={() => navigation.navigate('Onboarding6')}
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
  confidenceTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 95, 227, 0.1)', // Very subtle cobalt accent
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  confidenceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#3B5FE3', // Cobalt accent
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

export default Onboarding5;
