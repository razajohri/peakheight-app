// Onboarding10.js (Page 10 - How many hours do you sleep?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const Onboarding10 = ({ navigation, data, updateData }) => {
  const [sleepHours, setSleepHours] = useState(data.sleepHours || 0);

  const updateSleepHours = (hours) => {
    updateData({ sleepHours: hours });
  };

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
            onValueChange={(value) => {
              setSleepHours(value);
              updateSleepHours(value);
            }}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#1f1f1f"
            thumbTintColor="#FFFFFF"
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: -0.5,
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

export default Onboarding10;
