// Onboarding10.js (Page 10 - How many hours do you sleep?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';

const Onboarding10 = ({ navigation }) => {
  const [sleepHours, setSleepHours] = useState(7);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '67%' }]} />
        </View>
        <Text style={styles.progressText}>10/15</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>How many hours do you sleep?</Text>

        <View style={styles.sleepContainer}>
          <Text style={styles.sleepValue}>{sleepHours}</Text>
          <Text style={styles.sleepLabel}>hours per night</Text>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={4}
            maximumValue={12}
            step={0.5}
            value={sleepHours}
            onValueChange={setSleepHours}
            minimumTrackTintColor="#3B5FE3"
            maximumTrackTintColor="#2A2F3E"
            thumbTintColor="#3B5FE3"
          />

          <View style={styles.sliderLabelsContainer}>
            <Text style={styles.sliderLabel}>4 hrs</Text>
            <Text style={styles.sliderLabel}>12 hrs</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {sleepHours < 7
              ? "You may not be getting enough sleep for optimal growth hormone production."
              : sleepHours >= 9
                ? "Great! You're getting plenty of sleep for optimal growth hormone production."
                : "Good! 7-9 hours is recommended for optimal growth hormone production."}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding11')}
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 32,
    letterSpacing: -0.5, // Tighter letter-spacing for headlines
  },
  sleepContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sleepValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: '#FFFFFF',
  },
  sleepLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#AAAAAA',
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
    color: '#AAAAAA',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(59, 95, 227, 0.1)', // Very subtle cobalt accent
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B5FE3', // Cobalt accent
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
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

export default Onboarding10;
