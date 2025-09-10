// Onboarding4.js (Page 4 - What is your ethnicity?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

const Onboarding4 = ({ navigation }) => {
  const [selectedEthnicity, setSelectedEthnicity] = useState(null);

  const ethnicities = [
    'Asian',
    'Black/African',
    'Caucasian',
    'Hispanic/Latino',
    'Middle Eastern',
    'Native American',
    'Pacific Islander',
    'Mixed',
    'Other'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '27%' }]} />
        </View>
        <Text style={styles.progressText}>4/15</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>What is your ethnicity?</Text>

        <ScrollView style={styles.scrollView}>
          <View style={styles.optionsContainer}>
            {ethnicities.map((ethnicity) => (
              <TouchableOpacity
                key={ethnicity}
                style={[
                  styles.optionCard,
                  selectedEthnicity === ethnicity && styles.selectedCard
                ]}
                onPress={() => setSelectedEthnicity(ethnicity)}
              >
                <Text style={styles.optionText}>{ethnicity}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            !selectedEthnicity && styles.buttonDisabled
          ]}
          disabled={!selectedEthnicity}
          onPress={() => navigation.navigate('Onboarding5')}
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
    marginBottom: 32,
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
  scrollView: {
    flex: 1,
  },
  optionsContainer: {
    paddingBottom: 16,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#D9D9D9', // Platinum gray
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
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

export default Onboarding4;
