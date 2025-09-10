// Onboarding11.js (Page 11 - Pain)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';

const Onboarding11 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '73%' }]} />
        </View>
        <Text style={styles.progressText}>11/15</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Losing height potential every night</Text>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/peakheight-logo.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.description}>
          Your body releases the most growth hormones during deep sleep. Research shows that screen time before bed can reduce growth hormone production by up to 30%.
        </Text>

        <View style={styles.methodContainer}>
          <Text style={styles.methodLink}>View sources</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding12')}
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
    lineHeight: 36,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9', // Platinum gray
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 24,
  },
  methodContainer: {
    alignItems: 'flex-start',
  },
  methodLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
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

export default Onboarding11;
