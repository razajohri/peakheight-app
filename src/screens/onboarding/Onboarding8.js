// Onboarding8.js (Page 8 - What is your foot size?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const Onboarding8 = ({ navigation, data, updateData }) => {
  const [sizeSystem, setSizeSystem] = useState(data.footSizeSystem || 'us'); // 'us', 'eu', or 'uk'
  const [footSize, setFootSize] = useState(data.footSize || 0); // Default to 0

  const updateFootSize = (newSize, newSystem) => {
    updateData({
      footSize: newSize,
      footSizeSystem: newSystem
    });
  };

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
              updateFootSize(9, 'us');
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
              updateFootSize(42, 'eu');
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
              updateFootSize(8, 'uk');
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
            onValueChange={(value) => {
              setFootSize(value);
              updateFootSize(value, sizeSystem);
            }}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#1f1f1f"
            thumbTintColor="#FFFFFF"
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
  segmentContainer: {
    flexDirection: 'row',
    marginBottom: 32,
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
  confidenceTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#0a0a0a',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
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

export default Onboarding8;
