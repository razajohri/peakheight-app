// Onboarding9.js (Page 9 - How often do you work out?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const Onboarding9 = ({ navigation }) => {
  const [selectedFrequency, setSelectedFrequency] = useState(null);

  const frequencies = [
    { id: 'never', label: 'Never' },
    { id: 'rarely', label: '1-2 times a month' },
    { id: 'sometimes', label: '1-2 times a week' },
    { id: 'often', label: '3-4 times a week' },
    { id: 'daily', label: '5+ times a week' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '60%' }]} />
        </View>
        <Text style={styles.progressText}>9/15</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>How often do you work out?</Text>

        <View style={styles.optionsContainer}>
          {frequencies.map((frequency) => (
            <TouchableOpacity
              key={frequency.id}
              style={[
                styles.optionCard,
                selectedFrequency === frequency.id && styles.selectedCard
              ]}
              onPress={() => setSelectedFrequency(frequency.id)}
            >
              <Text style={styles.optionText}>{frequency.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            !selectedFrequency && styles.buttonDisabled
          ]}
          disabled={!selectedFrequency}
          onPress={() => navigation.navigate('Onboarding10')}
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
  optionsContainer: {
    marginTop: 16,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#D9D9D9', // Platinum gray
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  selectedCard: {
    borderColor: '#3B5FE3', // Cobalt accent
    backgroundColor: 'rgba(59, 95, 227, 0.1)', // Very subtle cobalt accent
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
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
  buttonDisabled: {
    backgroundColor: '#2A2F3E', // Darker gray
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default Onboarding9;
