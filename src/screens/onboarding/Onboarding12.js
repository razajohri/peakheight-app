// Onboarding12.js (Page 12 - Do you smoke or drink alcohol?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const Onboarding12 = ({ navigation }) => {
  const [smokingStatus, setSmokingStatus] = useState(null);
  const [drinkingStatus, setDrinkingStatus] = useState(null);

  const isReadyToContinue = smokingStatus !== null && drinkingStatus !== null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '80%' }]} />
        </View>
        <Text style={styles.progressText}>12/15</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Do you smoke or drink alcohol?</Text>

        <View style={styles.questionSection}>
          <Text style={styles.questionText}>Do you smoke?</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                smokingStatus === true && styles.optionButtonSelected
              ]}
              onPress={() => setSmokingStatus(true)}
            >
              <Text style={styles.optionButtonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                smokingStatus === false && styles.optionButtonSelected
              ]}
              onPress={() => setSmokingStatus(false)}
            >
              <Text style={styles.optionButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.questionSection}>
          <Text style={styles.questionText}>Do you drink alcohol?</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                drinkingStatus === true && styles.optionButtonSelected
              ]}
              onPress={() => setDrinkingStatus(true)}
            >
              <Text style={styles.optionButtonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                drinkingStatus === false && styles.optionButtonSelected
              ]}
              onPress={() => setDrinkingStatus(false)}
            >
              <Text style={styles.optionButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        {(smokingStatus === true || drinkingStatus === true) && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Research shows that smoking and alcohol consumption can negatively impact growth hormone production and bone development.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            !isReadyToContinue && styles.buttonDisabled
          ]}
          disabled={!isReadyToContinue}
          onPress={() => navigation.navigate('Onboarding13')}
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
  questionSection: {
    marginBottom: 32,
  },
  questionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9', // Platinum gray
    borderRadius: 8,
    marginHorizontal: 8,
  },
  optionButtonSelected: {
    borderColor: '#3B5FE3', // Cobalt accent
    backgroundColor: 'rgba(59, 95, 227, 0.1)', // Very subtle cobalt accent
  },
  optionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(59, 95, 227, 0.1)', // Very subtle cobalt accent
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B5FE3', // Cobalt accent
    marginTop: 16,
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
  buttonDisabled: {
    backgroundColor: '#2A2F3E', // Darker gray
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default Onboarding12;
