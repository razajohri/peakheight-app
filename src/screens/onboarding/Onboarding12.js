// Onboarding12.js (Page 12 - Do you smoke or drink alcohol?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding12 = ({ navigation, data, updateData }) => {
  const [smokingStatus, setSmokingStatus] = useState(data.smokingStatus || null);
  const [drinkingStatus, setDrinkingStatus] = useState(data.drinkingStatus || null);

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
              onPress={() => {
                setSmokingStatus(true);
                updateData({ smokingStatus: true });
              }}
            >
              <Text style={styles.optionButtonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                smokingStatus === false && styles.optionButtonSelected
              ]}
              onPress={() => {
                setSmokingStatus(false);
                updateData({ smokingStatus: false });
              }}
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
              onPress={() => {
                setDrinkingStatus(true);
                updateData({ drinkingStatus: true });
              }}
            >
              <Text style={styles.optionButtonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                drinkingStatus === false && styles.optionButtonSelected
              ]}
              onPress={() => {
                setDrinkingStatus(false);
                updateData({ drinkingStatus: false });
              }}
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
          <Text style={[
            styles.buttonText,
            !isReadyToContinue && styles.buttonTextDisabled
          ]}>Continue</Text>
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
    borderColor: '#1f1f1f',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  optionButtonSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#111111',
  },
  optionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f1f1f',
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
    backgroundColor: '#1f1f1f',
    borderColor: '#0a0a0a',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  buttonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default Onboarding12;
