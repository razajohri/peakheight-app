// Onboarding15.js (Page 15 - Analyze my answers)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';

const Onboarding15 = ({ navigation }) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + 0.05;
        if (newProgress >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setAnalyzing(false);
          }, 500);
          return 1;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <Text style={styles.progressText}>15/15</Text>
      </View>

      <View style={styles.contentContainer}>
        {analyzing ? (
          <>
            <Text style={styles.title}>Analyzing your answers</Text>

            <View style={styles.analyzeContainer}>
              <ActivityIndicator size="large" color="#3B5FE3" />
              <Text style={styles.analyzeText}>
                Our algorithm is analyzing your data to create your personalized height optimization plan
              </Text>
              <View style={styles.analyzeProgressContainer}>
                <View style={[styles.analyzeProgressBar, { width: `${progress * 100}%` }]} />
              </View>
              <Text style={styles.analyzeProgressText}>{Math.round(progress * 100)}%</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Analysis complete</Text>

            <View style={styles.completeContainer}>
              <Text style={styles.completeText}>
                We've analyzed your data and created your personalized height optimization plan
              </Text>
              <Text style={styles.completeSubtext}>
                Tap continue to view your report
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            analyzing && styles.buttonDisabled
          ]}
          disabled={analyzing}
          onPress={() => navigation.navigate('Onboarding16')}
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
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 32,
    letterSpacing: -0.5, // Tighter letter-spacing for headlines
    textAlign: 'center',
  },
  analyzeContainer: {
    alignItems: 'center',
    padding: 24,
  },
  analyzeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
    lineHeight: 24,
  },
  analyzeProgressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#2A2F3E', // Darker gray
    borderRadius: 2,
    marginBottom: 8,
  },
  analyzeProgressBar: {
    height: 4,
    backgroundColor: '#3B5FE3', // Cobalt accent
    borderRadius: 2,
  },
  analyzeProgressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
  },
  completeContainer: {
    alignItems: 'center',
    padding: 24,
  },
  completeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  completeSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
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

export default Onboarding15;
