// Onboarding7.js (Page 7 - Hope)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import HopeSvg from '../../../assets/Untitled design.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding7 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '47%' }]} />
        </View>
        <Text style={styles.progressText}>7/15</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Height isn't just inherited, it's earned</Text>

        <View style={styles.imageContainer}>
          <HopeSvg width={360} height={260} />
        </View>

        <Text style={styles.description}>
          The right habits can unlock hidden growth potential.
        </Text>

      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding8')}
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
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  illustration: {
    width: 300,
    height: 220,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#E5E7EB',
    lineHeight: 26,
    marginBottom: 24,
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

export default Onboarding7;
