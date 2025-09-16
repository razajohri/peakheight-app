// Onboarding15.js (Page 15 - Analyze my answers)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

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
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
        <Text style={styles.progressText}>15/16</Text>
      </View>

      <View style={styles.contentContainer}>
        {analyzing ? (
          <>
            <Text style={styles.title}>Analyzing your answers</Text>

            <View style={styles.analyzeContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
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
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('Onboarding17');
          }}
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
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: -0.5,
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
    backgroundColor: '#1f1f1f',
    borderRadius: 2,
    marginBottom: 8,
  },
  analyzeProgressBar: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  analyzeProgressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
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
    color: '#9CA3AF',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
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
});

export default Onboarding15;
