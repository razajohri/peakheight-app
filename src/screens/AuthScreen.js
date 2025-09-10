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
import Voice from '@react-native-voice/voice';

import Button from '../components/UI/Button';
// import { AuthService } from '../services/auth';
import { COLORS, APP_CONFIG } from '../utils/constants';

export default function AuthScreen({ onSuccess, onBack }) {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // AI-powered features state
  const [isListening, setIsListening] = useState(false);
  const [voiceInputField, setVoiceInputField] = useState(null); // 'email' or 'password'
  const [passwordFeedback, setPasswordFeedback] = useState({ strength: 'empty', message: 'Enter a password' });
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);

  // const authService = new AuthService();

  // Voice recognition setup
  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        const spokenText = e.value[0].toLowerCase().replace(/\s+/g, '');
        if (voiceInputField === 'email') {
          setEmail(spokenText);
        } else if (voiceInputField === 'password') {
          setPassword(spokenText);
        }
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [voiceInputField]);

  // AI-powered email suggestions
  const fetchEmailSuggestion = async (nameHint = "User") => {
    try {
      // For demo purposes, we'll use mock suggestions since we don't have OpenAI API key
      const mockSuggestions = [
        `${nameHint.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        `${nameHint.toLowerCase().replace(/\s+/g, '')}@outlook.com`,
        `${nameHint.toLowerCase().replace(/\s+/g, '')}@yahoo.com`,
        `${nameHint.toLowerCase().replace(/\s+/g, '')}@peakheight.com`
      ];

      setEmailSuggestions(mockSuggestions);
      setShowEmailSuggestions(true);

      // In a real app, you would use OpenAI API:
      /*
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${YOUR_OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that suggests professional email addresses based on names. Respond with just the email, no explanations."
            },
            {
              role: "user",
              content: `Suggest a professional email for someone named ${nameHint}`
            }
          ],
          max_tokens: 60
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
      */
    } catch (error) {
      console.error("Error fetching email suggestion:", error);
      return null;
    }
  };

  // Voice input functions
  const startListening = (field) => {
    setVoiceInputField(field);
    Voice.start('en-US');
  };

  const stopListening = () => {
    Voice.stop();
    setIsListening(false);
  };

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

    if (mode === 'signup' && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, simulate authentication
      setTimeout(() => {
        const mockUser = {
          id: '123',
          email: email,
          created_at: new Date().toISOString()
        };
        onSuccess(mockUser);
        setLoading(false);
      }, 1000);
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
      // For demo purposes, simulate social authentication
      setTimeout(() => {
        const mockUser = {
          id: '123',
          email: `user@${provider}.com`,
          created_at: new Date().toISOString(),
          provider: provider
        };
        onSuccess(mockUser);
        setLoading(false);
      }, 1000);
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

    // For demo purposes, simulate password reset
    Alert.alert(
      'Password Reset',
      'Check your email for password reset instructions'
    );
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
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>{APP_CONFIG.NAME}</Text>
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
            <Button
              title="Continue with Google"
              onPress={() => handleSocialAuth('google')}
              style={[styles.socialButton, styles.googleButton]}
              textStyle={styles.socialButtonText}
              loading={loading}
            />
            <Button
              title="Continue with Apple"
              onPress={() => handleSocialAuth('apple')}
              style={[styles.socialButton, styles.appleButton]}
              textStyle={styles.socialButtonText}
              loading={loading}
            />
            <Button
              title="Continue with Facebook"
              onPress={() => handleSocialAuth('facebook')}
              style={[styles.socialButton, styles.facebookButton]}
              textStyle={styles.socialButtonText}
              loading={loading}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Auth Form */}
          <View style={styles.emailForm}>
            {/* Email Input with Voice and AI Suggestions */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.flexGrow]}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.TEXT_SECONDARY}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setShowEmailSuggestions(false);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => startListening('email')}
                  style={styles.micButton}
                >
                  <Text style={styles.micIcon}>
                    {isListening && voiceInputField === 'email' ? '🔴' : '🎤'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Email Suggestions */}
              <TouchableOpacity
                style={styles.suggestButton}
                onPress={() => fetchEmailSuggestion("User")}
              >
                <Text style={styles.suggestButtonText}>🤖 Suggest Email</Text>
              </TouchableOpacity>

              {showEmailSuggestions && (
                <View style={styles.suggestionsContainer}>
                  {emailSuggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => {
                        setEmail(suggestion);
                        setShowEmailSuggestions(false);
                      }}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Password Input with Voice and Strength Feedback */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.flexGrow]}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.TEXT_SECONDARY}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordFeedback(checkPasswordStrength(text));
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => startListening('password')}
                  style={styles.micButton}
                >
                  <Text style={styles.micIcon}>
                    {isListening && voiceInputField === 'password' ? '🔴' : '🎤'}
                  </Text>
                </TouchableOpacity>
              </View>

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
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
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
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
  },
  authForm: {
    flex: 1,
  },
  socialButtons: {
    marginBottom: 30,
    gap: 12,
  },
  socialButton: {
    borderRadius: 12,
    height: 52,
  },
  googleButton: {
    backgroundColor: '#4285f4',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  facebookButton: {
    backgroundColor: '#1877f2',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  emailForm: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
  },
  emailAuthButton: {
    borderRadius: 12,
    height: 52,
  },
  modeToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  modeToggleText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  modeToggleLink: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  terms: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.PRIMARY,
  },
  // AI-powered features styles
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flexGrow: {
    flex: 1,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.PRIMARY + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  micIcon: {
    fontSize: 20,
  },
  suggestButton: {
    backgroundColor: COLORS.PRIMARY + '15',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '30',
  },
  suggestButtonText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    maxHeight: 120,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  feedbackText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
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
    color: COLORS.TEXT_SECONDARY,
  },
});
