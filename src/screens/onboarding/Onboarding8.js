// Onboarding8.js (Page 8 - What is your foot size?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';

const Onboarding8 = ({ navigation }) => {
  const [sizeSystem, setSizeSystem] = useState('us'); // 'us', 'eu', or 'uk'
  const [footSize, setFootSize] = useState(9); // Default US size

  const getMinMaxValues = () => {
    switch (sizeSystem) {
      case 'us':
        return { min: 5, max: 15 };
      case 'eu':
        return { min: 35, max: 50 };
      case 'uk':
        return { min: 4, max: 14 };
      default:
        return { min: 5, max: 15 };
    }
  };

  const { min, max } = getMinMaxValues();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '53%' }]} />
        </View>
        <Text style={styles.progressText}>8/15</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>What is your foot size?</Text>

        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              sizeSystem === 'us' && styles.segmentButtonActive
            ]}
            onPress={() => {
              setSizeSystem('us');
              setFootSize(9); // Reset to default US size
            }}
          >
            <Text style={[
              styles.segmentButtonText,
              sizeSystem === 'us' && styles.segmentButtonTextActive
            ]}>US</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              sizeSystem === 'eu' && styles.segmentButtonActive
            ]}
            onPress={() => {
              setSizeSystem('eu');
              setFootSize(42); // Reset to default EU size
            }}
          >
            <Text style={[
              styles.segmentButtonText,
              sizeSystem === 'eu' && styles.segmentButtonTextActive
            ]}>EU</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              sizeSystem === 'uk' && styles.segmentButtonActive
            ]}
            onPress={() => {
              setSizeSystem('uk');
              setFootSize(8); // Reset to default UK size
            }}
          >
            <Text style={[
              styles.segmentButtonText,
              sizeSystem === 'uk' && styles.segmentButtonTextActive
            ]}>UK</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sizeContainer}>
          <Text style={styles.sizeValue}>{footSize}</Text>
          <Text style={styles.sizeLabel}>{sizeSystem.toUpperCase()}</Text>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={min}
            maximumValue={max}
            step={0.5}
            value={footSize}
            onValueChange={setFootSize}
            minimumTrackTintColor="#3B5FE3"
            maximumTrackTintColor="#2A2F3E"
            thumbTintColor="#3B5FE3"
          />

          <View style={styles.sliderLabelsContainer}>
            <Text style={styles.sliderLabel}>{min}</Text>
            <Text style={styles.sliderLabel}>{max}</Text>
          </View>
        </View>

        <View style={styles.confidenceTag}>
          <Text style={styles.confidenceText}>Confidence: Medium</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding9')}
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
  segmentContainer: {
    flexDirection: 'row',
    marginBottom: 40,
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
  sizeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sizeValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: '#FFFFFF',
  },
  sizeLabel: {
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
  confidenceTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 95, 227, 0.1)', // Very subtle cobalt accent
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
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

export default Onboarding8;
