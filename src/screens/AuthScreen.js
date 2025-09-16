import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { FontAwesome } from '@expo/vector-icons';

import Button from '../components/UI/Button';
import { AuthService } from '../services/auth';
import { COLORS, APP_CONFIG } from '../utils/constants';

export default function AuthScreen({ onSuccess, onBack, onboardingData }) {
  console.log('🔐 AuthScreen received onboardingData:', onboardingData);
  console.log('🔐 AuthScreen onboardingData keys:', Object.keys(onboardingData || {}));
  const [mode, setMode] = useState('signup'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  // Password feedback state
  const [passwordFeedback, setPasswordFeedback] = useState({ strength: 'empty', message: 'Enter a password' });

  // AuthService is imported as a class with static methods




  // Intelligent password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return { strength: 'empty', message: 'Enter a password' };
    if (password.length < 6) return { strength: 'weak', message: 'Too short! Use at least 6 characters' };

    // Check for common patterns
    if (/^123/.test(password) || /password/i.test(password) || /qwerty/i.test(password)) {
      return { strength: 'weak', message: 'Avoid common patterns like "123", "password", or "qwerty"' };
    }

    // Check for variety
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);

    const varietyScore = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;

    if (varietyScore <= 1) {
      return {
        strength: 'weak',
        message: 'Add uppercase, lowercase, numbers, and symbols for a stronger password'
      };
    }

    if (varietyScore <= 2) {
      return {
        strength: 'medium',
        message: 'Mix uppercase, lowercase, numbers, and symbols for a stronger password'
      };
    }

    if (password.length >= 8 && varietyScore >= 3) {
      return { strength: 'strong', message: 'Great password! 💪' };
    }

    return { strength: 'medium', message: 'Decent, but could be stronger' };
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (mode === 'signup') {
      if (!firstName || !lastName) {
        Alert.alert('Error', 'Please enter your first and last name');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      let result;

      if (mode === 'signup') {
        // Sign up new user with name data
        const userData = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          displayName: `${firstName.trim()} ${lastName.trim()}`
        };
        result = await AuthService.signUp(email, password, userData);
      } else {
        // Sign in existing user
        result = await AuthService.signIn(email, password);
      }

      if (result.error) {
        Alert.alert('Authentication Failed', result.error);
        setLoading(false);
        return;
      }

      // Get user profile
      const { profile, error: profileError } = await AuthService.getUserProfile(result.data.user.id);

      if (profileError) {
        console.error('Profile error:', profileError);
        // Still proceed with auth user if profile fetch fails
        console.log('🔐 Calling onSuccess with user and onboardingData:', result.data.user.id, onboardingData);
        onSuccess(result.data.user, onboardingData);
      } else {
        console.log('🔐 Calling onSuccess with profile and onboardingData:', (profile || result.data.user).id, onboardingData);
        onSuccess(profile || result.data.user, onboardingData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert(
        'Authentication Failed',
        error.message || 'Please check your credentials and try again.'
      );
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setLoading(true);
    try {
      let result;

      if (provider === 'google') {
        result = await AuthService.signInWithGoogle();
      } else if (provider === 'apple') {
        result = await AuthService.signInWithApple();
      } else {
        Alert.alert('Unsupported Provider', `${provider} authentication is not supported yet.`);
        setLoading(false);
        return;
      }

      if (result.error) {
        Alert.alert('Authentication Failed', result.error);
        setLoading(false);
        return;
      }

      // The auth state change listener in App.js will handle the rest
      setLoading(false);
    } catch (error) {
      console.error('Social auth error:', error);
      Alert.alert(
        'Authentication Failed',
        'Please try again or use email authentication.'
      );
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address first');
      return;
    }

    try {
      const { error } = await AuthService.resetPassword(email);

      if (error) {
        Alert.alert('Error', error);
        return;
      }

      Alert.alert(
        'Password Reset',
        'Check your email for password reset instructions'
      );
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >


        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === 'signin' ? 'Welcome back!' : 'Create your account'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'signin'
              ? 'Sign in to continue your height journey'
              : 'Join thousands achieving their height goals'
            }
          </Text>
        </View>

        <View style={styles.authForm}>
          {/* Social Auth Buttons */}
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[styles.socialRowButton, styles.googleRow]}
              activeOpacity={0.9}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); handleSocialAuth('google'); }}
            >
              <Text style={styles.socialRowText}>Continue with Google</Text>
              <FontAwesome name="google" size={20} color="#DB4437" style={styles.socialIconRight} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialRowButton, styles.appleRow]}
              activeOpacity={0.9}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); handleSocialAuth('apple'); }}
            >
              <Text style={styles.socialRowText}>Continue with Apple</Text>
              <FontAwesome name="apple" size={20} color="#FFFFFF" style={styles.socialIconRight} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialRowButton, styles.facebookRow]}
              activeOpacity={0.9}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); /* TODO: implement Facebook */ }}
            >
              <Text style={styles.socialRowText}>Continue with Facebook</Text>
              <FontAwesome name="facebook-square" size={20} color="#1877F2" style={styles.socialIconRight} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Auth Form */}
          <View style={styles.emailForm}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Name Fields - Only show during signup */}
            {mode === 'signup' && (
              <>
                <View style={styles.nameRow}>
                  <View style={[styles.inputGroup, { flex: 1 }, styles.nameInput]}>
                    <Text style={styles.inputLabel}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your first name"
                      placeholderTextColor="#9CA3AF"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }, styles.nameInput]}>
                    <Text style={styles.inputLabel}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your last name"
                      placeholderTextColor="#9CA3AF"
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              </>
            )}

            {/* Password Input with Strength Feedback */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordFeedback(checkPasswordStrength(text));
                }}
                secureTextEntry
                autoCapitalize="none"
              />

              {/* Password Strength Feedback */}
              <Text style={[
                styles.feedbackText,
                passwordFeedback.strength === 'weak' ? styles.weakText :
                passwordFeedback.strength === 'medium' ? styles.mediumText :
                passwordFeedback.strength === 'strong' ? styles.strongText :
                styles.neutralText
              ]}>
                {passwordFeedback.message}
              </Text>
            </View>

            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            )}

            {mode === 'signin' && (
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            <Button
              title={mode === 'signin' ? 'Sign In' : 'Create Account'}
              onPress={handleEmailAuth}
              style={styles.emailAuthButton}
              loading={loading}
            />
          </View>

          {/* Mode Toggle */}
          <View style={styles.modeToggle}>
            <Text style={styles.modeToggleText}>
              {mode === 'signin'
                ? "Don't have an account? "
                : "Already have an account? "
              }
            </Text>
            <TouchableOpacity
              onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              <Text style={styles.modeToggleLink}>
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 28,
  },
  logo: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  authForm: {
    flex: 1,
  },
  socialButtons: {
    marginBottom: 24,
    gap: 10,
  },
  socialRowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 14,
  },
  socialIcon: {
    marginRight: 10,
    zIndex: 1,
  },
  socialIconRight: {
    marginLeft: 10,
  },
  socialRowText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  googleRow: {},
  appleRow: {},
  facebookRow: {},
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1f1f1f',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  emailForm: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1f1f1f',
    marginBottom: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
  emailAuthButton: {
    borderRadius: 12,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1f1f1f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  modeToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  modeToggleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  modeToggleLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  terms: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#FFFFFF',
  },
  // AI-powered features styles
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  nameInput: {
    marginBottom: 0,
  },
  feedbackText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginTop: 4,
  },
  weakText: {
    color: '#FF3B30',
  },
  mediumText: {
    color: '#FF9500',
  },
  strongText: {
    color: '#4CD964',
  },
  neutralText: {
    color: '#9CA3AF',
  },
});
