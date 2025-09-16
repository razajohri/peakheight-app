// Onboarding4.js (Page 4 - What is your ethnicity?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding4 = ({ navigation, data, updateData }) => {
  const [selectedEthnicity, setSelectedEthnicity] = useState(data.ethnicity || null);

  const ethnicities = [
    'Asian',
    'South Asian',
    'Black/African',
    'Caucasian',
    'Hispanic/Latino',
    'Middle Eastern',
    'Native American',
    'Pacific Islander',
    'Other',
    'Prefer not to say'
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
                onPress={async () => {
                  try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
                  setSelectedEthnicity(ethnicity);
                  updateData({ ethnicity });
                }}
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
          onPress={async () => {
            try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
            navigation.navigate('Onboarding5');
          }}
          activeOpacity={0.85}
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
  scrollView: {
    flex: 1,
  },
  optionsContainer: {
    paddingBottom: 16,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#1f1f1f',
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: '#FFFFFF',
    backgroundColor: '#111111',
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
  buttonDisabled: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1f1f1f',
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
});

export default Onboarding4;
