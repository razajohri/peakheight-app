// Onboarding2.js (Page 2 - Choose your gender)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const Onboarding2 = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '13%' }]} />
        </View>
        <Text style={styles.progressText}>2/15</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Choose your gender</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedGender === 'male' && styles.selectedCard
            ]}
            onPress={() => setSelectedGender('male')}
          >
            <Text style={styles.optionText}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedGender === 'female' && styles.selectedCard
            ]}
            onPress={() => setSelectedGender('female')}
          >
            <Text style={styles.optionText}>Female</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedGender === 'other' && styles.selectedCard
            ]}
            onPress={() => setSelectedGender('other')}
          >
            <Text style={styles.optionText}>Other</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            !selectedGender && styles.buttonDisabled
          ]}
          disabled={!selectedGender}
          onPress={() => navigation.navigate('Onboarding3')}
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
    marginBottom: 40,
    letterSpacing: -0.5, // Tighter letter-spacing for headlines
  },
  optionsContainer: {
    marginTop: 16,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#D9D9D9', // Platinum gray
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  selectedCard: {
    borderColor: '#3B5FE3', // Cobalt accent
    backgroundColor: 'rgba(59, 95, 227, 0.1)', // Very subtle cobalt accent
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
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

export default Onboarding2;
