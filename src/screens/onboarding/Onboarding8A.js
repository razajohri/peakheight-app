// Onboarding8A.js (Page 8A - What's stopping you from peakheight?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HapticFeedback from '../../utils/hapticFeedback';
import { Ionicons } from '@expo/vector-icons';

const Onboarding8A = ({ navigation, data, updateData }) => {
  const [selectedOptions, setSelectedOptions] = useState(data.stoppingGoals || []);

  const stoppingOptions = [
    { id: 'time', label: 'Lack of time' },
    { id: 'motivation', label: 'Lack of motivation' },
    { id: 'knowledge', label: 'Not sure what to do' },
    { id: 'consistency', label: 'Hard to stay consistent' },
    { id: 'results', label: 'Not seeing results' },
    { id: 'nothing', label: 'Nothing' },
  ];

  const toggleOption = (optionId) => {
    HapticFeedback.selection();
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId];
    setSelectedOptions(newSelection);
    updateData({ stoppingGoals: newSelection });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            HapticFeedback.light();
            navigation.goBack();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '67%' }]} />
        </View>
        <Text style={styles.progressText}>10/15</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What's stopping you from reaching your Peakheight?</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>

        <ScrollView 
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {stoppingOptions.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected
                ]}
                onPress={() => toggleOption(option.id)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            HapticFeedback.medium();
            navigation.navigate('Onboarding9');
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
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
    paddingTop: 16,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    marginTop: 8,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#1f1f1f',
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCardSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#1f1f1f',
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: '#000000',
  },
});

export default Onboarding8A;

