// Onboarding17.js (Page 17 - Account Creation)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding17 = ({ navigation, data, updateData, onAuthRequired }) => {
  const handleCreateAccount = () => {
    // Navigate directly to AuthScreen with onboarding data
    onAuthRequired(data);
  };

  const handleSignIn = () => {
    // Navigate directly to AuthScreen with onboarding data
    onAuthRequired(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>
          Save your progress and access your personalized height growth plan
        </Text>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>What you'll get:</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>✓ Personalized growth plan</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>✓ Progress tracking</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>✓ AI-powered insights</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>✓ Expert guidance</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>✓ Community support</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>✓ Premium features</Text>
          </View>
        </View>

        <View style={styles.dataPreview}>
          <Text style={styles.dataPreviewTitle}>Your Profile Summary:</Text>
          <Text style={styles.dataPreviewText}>
            {data.gender && `Gender: ${data.gender}`}
            {data.currentHeight && ` • Height: ${data.currentHeight}`}
            {data.targetHeight && ` • Goal: ${data.targetHeight}`}
            {data.motivation && ` • Motivation: ${data.motivation}`}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateAccount}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('Onboarding18')}
        >
          <Text style={styles.skipText}>Continue as Guest</Text>
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
  contentContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1A1F2D',
    borderWidth: 1,
    borderColor: '#2A2F3E',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  benefitsContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  benefitsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  benefitItem: {
    marginBottom: 8,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  dataPreview: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    marginTop: 20,
  },
  dataPreviewTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  dataPreviewText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
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
  signInButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  signInText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  signInLink: {
    color: '#9CA3AF',
    fontFamily: 'Inter-Medium',
  },
  skipButton: {
    alignItems: 'center',
  },
  skipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
});

export default Onboarding17;
