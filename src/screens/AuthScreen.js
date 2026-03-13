import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  Modal,
  StatusBar,
  Animated,
  Dimensions,
  Image,
  PanResponder
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedReanimated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing, FadeIn } from 'react-native-reanimated';

import Button from '../components/UI/Button';
import { AuthService } from '../services/auth';
import { COLORS, APP_CONFIG } from '../utils/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Email Form Modal Component
const EmailFormModal = ({
  visible,
  onClose,
  onSuccess,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  passwordFeedback,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  mode,
  loading,
  checkPasswordStrength,
  setPasswordFeedback,
}) => {
  const translateY = useSharedValue(screenHeight);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const startY = useSharedValue(0);
  const isDragging = useRef(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const insets = useSafeAreaInsets();

  const animateClose = () => {
    translateY.value = withTiming(screenHeight, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(0, { duration: 250 });
    scale.value = withTiming(0.9, { duration: 250 });
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animateClose();
  };

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 200,
        mass: 0.8,
      });
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 300,
      });
    } else {
      translateY.value = screenHeight;
      opacity.value = 0;
      scale.value = 0.9;
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        const { locationY } = evt.nativeEvent;
        return locationY < 120;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        startY.value = 0;
        isDragging.current = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isDragging.current) {
          const newY = Math.max(0, startY.value + gestureState.dy);
          translateY.value = newY;
          const dragProgress = Math.min(1, newY / screenHeight);
          opacity.value = 1 - dragProgress * 0.5;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        isDragging.current = false;
        const swipeThreshold = screenHeight * 0.2;
        if (gestureState.dy > swipeThreshold || gestureState.vy > 0.5) {
          animateClose();
        } else {
          translateY.value = withSpring(0, {
            damping: 25,
            stiffness: 200,
          });
          opacity.value = withTiming(1, { duration: 200 });
        }
      },
    })
  ).current;

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Lift the bottom sheet above the keyboard on both platforms
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const height = e?.endCoordinates?.height ?? 0;
      setKeyboardOffset(height);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <AnimatedReanimated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          overlayAnimatedStyle,
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
      </AnimatedReanimated.View>

      <AnimatedReanimated.View
        {...panResponder.panHandlers}
        style={[
          {
            position: 'absolute',
            // When keyboard is shown, position from top to ensure header stays below safe area
            // When keyboard is hidden, position from bottom as normal
            ...(keyboardOffset > 0 
              ? {
                  top: insets.top,
            bottom: keyboardOffset,
                }
              : {
                  bottom: 0,
                }
            ),
            left: 0,
            right: 0,
            backgroundColor: '#000000',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            // Limit max height to prevent going too high
            maxHeight: keyboardOffset > 0 
              ? screenHeight - keyboardOffset - insets.top
              : screenHeight * 0.9,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 20,
          },
          modalAnimatedStyle,
        ]}
      >
        {/* Drag Handle */}
        <View style={emailModalStyles.dragHandleContainer}>
          <View style={emailModalStyles.dragHandle} />
        </View>

        {/* Header */}
        <View style={[
          emailModalStyles.modalHeader,
          // Add safe area top padding when keyboard is shown to prevent going under notch
          { paddingTop: keyboardOffset > 0 ? Math.max(24, insets.top + 8) : 24 }
        ]}>
          <Text style={emailModalStyles.modalTitle}>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Text>
          <TouchableOpacity
            style={emailModalStyles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="rgba(255, 255, 255, 0.9)" />
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <ScrollView
          style={emailModalStyles.modalContent}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name Fields - Only show for signup */}
          {mode === 'signup' && (
            <View style={emailModalStyles.nameRow}>
              <View style={emailModalStyles.nameInputWrapper}>
                <View style={emailModalStyles.inputCard}>
                  <View style={emailModalStyles.inputIconContainer}>
                    <Ionicons name="person-outline" size={20} color="rgba(255, 255, 255, 0.9)" />
                  </View>
                  <TextInput
                    style={emailModalStyles.inputField}
                    placeholder="First Name"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>
              <View style={emailModalStyles.nameInputWrapper}>
                <View style={emailModalStyles.inputCard}>
                  <View style={emailModalStyles.inputIconContainer}>
                    <Ionicons name="person-outline" size={20} color="rgba(255, 255, 255, 0.9)" />
                  </View>
                  <TextInput
                    style={emailModalStyles.inputField}
                    placeholder="Last Name"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Email Input */}
          <View style={emailModalStyles.inputCard}>
            <View style={emailModalStyles.inputIconContainer}>
              <Ionicons name="mail-outline" size={20} color="rgba(255, 255, 255, 0.9)" />
            </View>
            <TextInput
              style={emailModalStyles.inputField}
              placeholder="Email"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={emailModalStyles.inputCard}>
            <View style={emailModalStyles.inputIconContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="rgba(255, 255, 255, 0.9)" />
            </View>
            <TextInput
              style={emailModalStyles.inputField}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordFeedback(checkPasswordStrength(text));
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={emailModalStyles.eyeIconContainer}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color="rgba(255, 255, 255, 0.7)"
              />
            </TouchableOpacity>
          </View>

          {/* Password Feedback - Only show for signup */}
          {mode === 'signup' && password && passwordFeedback.message && (
            <View style={emailModalStyles.feedbackContainer}>
              <Text
                style={[
                  emailModalStyles.feedbackText,
                  passwordFeedback.strength === 'weak' && emailModalStyles.weakText,
                  passwordFeedback.strength === 'medium' && emailModalStyles.mediumText,
                  passwordFeedback.strength === 'strong' && emailModalStyles.strongText,
                ]}
              >
                {passwordFeedback.message}
              </Text>
            </View>
          )}

          {/* Confirm Password - Only show for signup */}
          {mode === 'signup' && (
            <View style={emailModalStyles.inputCard}>
              <View style={emailModalStyles.inputIconContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="rgba(255, 255, 255, 0.9)" />
              </View>
              <TextInput
                style={emailModalStyles.inputField}
                placeholder="Confirm Password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={emailModalStyles.eyeIconContainer}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="rgba(255, 255, 255, 0.7)"
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={onSuccess}
            disabled={loading}
            activeOpacity={0.8}
            style={emailModalStyles.submitButton}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F5F5F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={emailModalStyles.submitButtonGradient}
            >
              <Text style={emailModalStyles.submitButtonText}>
                {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
              </Text>
              {!loading && (
                <Ionicons name="arrow-forward" size={20} color="#000000" style={emailModalStyles.buttonIcon} />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </AnimatedReanimated.View>
    </Modal>
  );
};

const emailModalStyles = StyleSheet.create({
  dragHandleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    // Add safe area top padding to prevent header going under notch/navbar
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: 24,
    flexGrow: 1,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  nameInputWrapper: {
    flex: 1,
  },
  feedbackContainer: {
    marginTop: -8,
    marginBottom: 8,
    paddingLeft: 4,
  },
  feedbackText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    lineHeight: 16,
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
  submitButton: {
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  inputIconContainer: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#FFFFFF',
    paddingVertical: 0,
    letterSpacing: 0.2,
  },
  eyeIconContainer: {
    padding: 4,
    marginLeft: 8,
  },
});

export default function AuthScreen({ onSuccess, onBack, onboardingData, initialMode = 'signup', fromOnboarding = false, onModeChange }) {
  console.log('🔐 AuthScreen received onboardingData:', onboardingData);
  console.log('🔐 AuthScreen onboardingData keys:', Object.keys(onboardingData || {}));
  console.log('🔐 AuthScreen initialMode:', initialMode);
  console.log('🔐 AuthScreen fromOnboarding:', fromOnboarding);
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  // Update mode when initialMode changes from parent
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Password feedback state
  const [passwordFeedback, setPasswordFeedback] = useState({ strength: 'empty', message: '' });

  // Terms modal state
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Email form modal state
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Intelligent password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return { strength: 'empty', message: '' };
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

    // Basic email validation - more lenient for signin (users may have signed up with any email)
    const normalizedEmail = String(email).trim().toLowerCase();
    
    // Only restrict domains for signup, not signin (user might have used any email to sign up)
    if (mode === 'signup') {
    const allowedDomains = ['@gmail.com', '@yahoo.com', '@outlook.com', '@icloud.com', '@hotmail.com', '@apple.com'];
    const hasAllowedDomain = allowedDomains.some((d) => normalizedEmail.endsWith(d));
    if (!hasAllowedDomain) {
      Alert.alert('Enter correct email address', 'Please use a valid email like name@gmail.com');
      return;
      }
    } else {
      // For signin, just check basic email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }
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

    // For signup, show terms modal first
    if (mode === 'signup') {
      setShowTermsModal(true);
      return;
    }

    // For signin, proceed directly
    await proceedWithAuth();
  };

  const proceedWithAuth = async () => {
    setLoading(true);
    try {
      // Normalize email (trim and lowercase) before auth
      const normalizedEmail = String(email).trim().toLowerCase();
      
      let result;

      if (mode === 'signup') {
        // Sign up new user with name data
        const userData = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          displayName: `${firstName.trim()} ${lastName.trim()}`
        };
        result = await AuthService.signUp(normalizedEmail, password, userData);
      } else {
        // Sign in existing user - use normalized email
        // Trim password in case there's any whitespace
        const trimmedPassword = String(password).trim();
        console.log('🔐 Attempting sign in with email:', normalizedEmail);
        console.log('🔐 Password length:', trimmedPassword.length);
        result = await AuthService.signIn(normalizedEmail, trimmedPassword);
        console.log('🔐 Sign in result:', result.error ? `ERROR: ${result.error}` : 'SUCCESS');
      }

      if (result.error) {
        console.error('🔐 Authentication failed:', result.error);
        Alert.alert('Authentication Failed', result.error || 'Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      // Get user profile
      const { profile, error: profileError } = await AuthService.getUserProfile(result.data.user.id);

      if (profileError) {
        console.error('Profile error:', profileError);
        // Still proceed with auth user if profile fetch fails
        console.log('🔐 Calling onSuccess with user and onboardingData:', result.data.user.id, onboardingData);
        onSuccess(result.data.user, onboardingData, false); // Email auth is not Apple Sign In
      } else {
        console.log('🔐 Calling onSuccess with profile and onboardingData:', (profile || result.data.user).id, onboardingData);
        onSuccess(profile || result.data.user, onboardingData, false); // Email auth is not Apple Sign In
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

  const handleAgreeToTerms = async () => {
    setShowTermsModal(false);
    await proceedWithAuth();
  };

  const handleSocialAuth = async (provider) => {
    setLoading(true);
    try {
      console.log('🔐 Starting authentication for:', provider);

      let result;

      if (provider === 'facebook') {
        result = await AuthService.signInWithFacebook();
      } else if (provider === 'apple') {
        result = await AuthService.signInWithApple();
      } else {
        Alert.alert('Unsupported Provider', `${provider} authentication is not supported yet.`);
        setLoading(false);
        return;
      }

      if (result && result.error) {
        console.log('🔐 Auth error:', result.error);
        Alert.alert('Authentication Failed', result.error);
        setLoading(false);
        return;
      }

      console.log('🔐 Auth successful:', result);

      // Call the onSuccess callback to handle navigation
      if (onSuccess && result.data?.user) {
        onSuccess(result.data.user, onboardingData, provider === 'apple');
      }

      setLoading(false);
    } catch (error) {
      console.error('🔐 Social auth error:', error);
      Alert.alert(
        'Authentication Failed',
        'Please try again or use email authentication.'
      );
      setLoading(false);
    }
  };

  const renderInputField = (icon, placeholder, value, onChangeText, options = {}) => {
    const {
      secureTextEntry = false,
      keyboardType = 'default',
      autoCapitalize = 'none',
      showEyeIcon = false,
      onToggleVisibility = null,
      isVisible = false,
    } = options;

  return (
      <View style={styles.inputCard}>
        <View style={styles.inputIconContainer}>
          <Ionicons name={icon} size={20} color="rgba(255, 255, 255, 0.9)" />
        </View>
        <TextInput
          style={styles.inputField}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
        {showEyeIcon && (
          <TouchableOpacity
            onPress={onToggleVisibility}
            style={styles.eyeIconContainer}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isVisible ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="rgba(255, 255, 255, 0.7)"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.background}>
        <LinearGradient
          colors={['#000000', '#0A0A0A', '#000000']}
          style={StyleSheet.absoluteFill}
        />
        {/* Premium gradient overlay for depth */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.03)', 'transparent', 'rgba(0, 0, 0, 0.4)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {/* Additional subtle radial gradient for depth */}
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.01)', 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
    <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Animated.View
              style={[
                styles.contentContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header Section */}
              <View style={[styles.headerSection, mode === 'signin' && styles.headerSectionSignin]}>
                {/* Back Button - Show when in signin mode */}
                {mode === 'signin' && (
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      // If came from onboarding, go back to onboarding
                      // Otherwise, switch to signup mode
                      if (fromOnboarding) {
                        onBack && onBack();
                      } else {
                        const newMode = 'signup';
                        setMode(newMode);
                        if (onModeChange) {
                          onModeChange(newMode);
                        }
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
            {mode === 'signup' && (
                  <Image
                    source={require('../../assets/Premium Signup Icon - Edited.png')}
                    style={styles.headerIcon}
                    resizeMode="contain"
                  />
                )}
                <Text style={[styles.mainTitle, mode === 'signin' && styles.mainTitleSignin]}>
                  {mode === 'signin' ? 'Welcome Back!' : 'Create Your Account!'}
                </Text>
            </View>

              {/* Action Buttons Card */}
              <View style={styles.formCard}>
                {/* Subtitle */}
                <Text style={styles.cardSubtitle}>
                  {mode === 'signin'
                    ? 'Sign in to continue your journey'
                    : 'Join others achieving their height goals'}
                </Text>

                {/* For Sign In: Show Apple auth + email/password fields directly */}
                {mode === 'signin' ? (
                  <>
                    {/* Continue with Apple Button */}
                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        handleSocialAuth('apple');
                      }}
                      activeOpacity={0.8}
                    >
                      <FontAwesome name="apple" size={22} color="#FFFFFF" />
                      <Text style={styles.socialButtonText}>Continue with Apple</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>or</Text>
                      <View style={styles.dividerLine} />
                    </View>

                    {/* Email Input */}
                    {renderInputField(
                      'mail-outline',
                      'Email',
                      email,
                      setEmail,
                      { keyboardType: 'email-address' }
                    )}

                    {/* Password Input */}
                    {renderInputField(
                      'lock-closed-outline',
                      'Password',
                      password,
                      (text) => {
                        setPassword(text);
                        setPasswordFeedback(checkPasswordStrength(text));
                      },
                      {
                        secureTextEntry: true,
                        showEyeIcon: true,
                        isVisible: showPassword,
                        onToggleVisibility: () => setShowPassword(!showPassword),
                      }
                    )}

                    {/* Sign In Button */}
                    <TouchableOpacity
                      style={styles.emailButton}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        handleEmailAuth();
                      }}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <Text style={styles.emailButtonText}>Please wait...</Text>
                      ) : (
                        <>
                          <Text style={styles.emailButtonText}>Sign In</Text>
                          <Ionicons name="arrow-forward" size={20} color="#000000" style={{ marginLeft: 8 }} />
                        </>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                {/* Continue with Apple Button */}
              <TouchableOpacity
                  style={styles.socialButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleSocialAuth('apple');
                }}
                  activeOpacity={0.8}
              >
                  <FontAwesome name="apple" size={22} color="#FFFFFF" />
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>

                {/* Continue with Email Button */}
                <TouchableOpacity
                  style={styles.emailButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowEmailModal(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="mail-outline" size={22} color="#000000" />
                  <Text style={styles.emailButtonText}>Continue with Email</Text>
                </TouchableOpacity>
                  </>
                )}

            {/* Footer - Always show to allow switching between signup and signin */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <Text
                  style={styles.footerLink}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    const newMode = mode === 'signin' ? 'signup' : 'signin';
                    setMode(newMode);
                    if (onModeChange) {
                      onModeChange(newMode);
                    }
                  }}
                >
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </View>
              </View>
            </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Email Form Modal */}
      <EmailFormModal
        visible={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSuccess={proceedWithAuth}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={(text) => {
          setPassword(text);
          // Password feedback will be updated via useEffect
        }}
        setPasswordFeedback={setPasswordFeedback}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        passwordFeedback={passwordFeedback}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        mode={mode}
        loading={loading}
        checkPasswordStrength={checkPasswordStrength}
      />

      {/* Terms and Service Modal */}
      <Modal
        visible={showTermsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms of Service & Privacy Policy</Text>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTermsModal(false)}
                  activeOpacity={0.7}
              >
                  <Ionicons name="close" size={24} color="rgba(255, 255, 255, 0.7)" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSectionTitle}>Terms of Service</Text>
              <Text style={styles.modalText}>
                By using Peak Height, you agree to our Terms of Service. This includes:
              </Text>
              <Text style={styles.modalBullet}>• You must be at least 13 years old to use this service</Text>
              <Text style={styles.modalBullet}>• You are responsible for maintaining the security of your account</Text>
              <Text style={styles.modalBullet}>• You agree to use the service for lawful purposes only</Text>
              <Text style={styles.modalBullet}>• We may update these terms at any time</Text>
              <Text style={styles.modalBullet}>• Peak Height provides general lifestyle, fitness, and health guidance</Text>
              <Text style={styles.modalBullet}>• We do not guarantee results such as increased height</Text>
              <Text style={styles.modalBullet}>• Individual outcomes vary, and the App is not a substitute for medical advice</Text>

              <Text style={styles.modalSectionTitle}>Privacy Policy</Text>
              <Text style={styles.modalText}>
                We respect your privacy and are committed to protecting your personal information:
              </Text>
              <Text style={styles.modalBullet}>• We collect personal information you provide (size, weight, gender, age, ethnicity, parent height, etc.)</Text>
              <Text style={styles.modalBullet}>• We do not collect biometric data such as facial recognition</Text>
              <Text style={styles.modalBullet}>• Payment data is processed by Apple or Google; we do not store card details</Text>
              <Text style={styles.modalBullet}>• We process data to predict growth patterns and personalize your experience</Text>
              <Text style={styles.modalBullet}>• We use AI-powered chatbot interactions through OpenAI's API</Text>
              <Text style={styles.modalBullet}>• Chatbot conversations are processed in real time and not stored on our servers</Text>
              <Text style={styles.modalBullet}>• We do not sell your personal information to third parties</Text>
              <Text style={styles.modalBullet}>• Account data is deleted within 30 days of account deletion unless required by law</Text>
              <Text style={styles.modalBullet}>• You can request data deletion at any time by contacting rlakhnyuk@gmail.com</Text>

              <Text style={styles.modalText}>
                By clicking "I Agree", you acknowledge that you have read, understood, and agree to be bound by our Terms of Service and Privacy Policy. For questions, contact us at rlakhnyuk@gmail.com.
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => setShowTermsModal(false)}
                  activeOpacity={0.8}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.agreeButton}
                onPress={handleAgreeToTerms}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#F5F5F5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.agreeButtonGradient}
              >
                <Text style={styles.agreeButtonText}>I Agree</Text>
                  </LinearGradient>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    flex: 1,
    position: 'relative',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? -40 : -20,
    paddingBottom: 30,
  },
  contentContainer: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 0,
    marginTop: -50,
    position: 'relative',
  },
  headerSectionSignin: {
    marginTop: 40,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: -9,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerIcon: {
    width: 450,
    height: 450,
    marginBottom: -99,
  },
  mainTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
    textShadowColor: 'rgba(255, 255, 255, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 24,
  },
  mainTitleSignin: {
    marginTop: 20,
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  formCard: {
    backgroundColor: '#0A0A0A',
    borderRadius: 32,
    padding: 28,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 32 },
    shadowOpacity: 0.8,
    shadowRadius: 48,
    elevation: 30,
    overflow: 'hidden',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  nameInputWrapper: {
    flex: 1,
  },
  nameInputCard: {
    marginBottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  nameInputIconContainer: {
    marginRight: 10,
  },
  nameInputField: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    paddingVertical: 0,
    letterSpacing: 0.2,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIconContainer: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#FFFFFF',
    paddingVertical: 0,
    letterSpacing: 0.2,
  },
  eyeIconContainer: {
    padding: 4,
    marginLeft: 8,
  },
  feedbackContainer: {
    marginTop: -8,
    marginBottom: 8,
    paddingLeft: 4,
  },
  feedbackText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    lineHeight: 16,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 12,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  primaryButton: {
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  primaryButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.3,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0F0F',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 14,
  },
  socialButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 14,
    letterSpacing: 0.4,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 28,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  emailButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
    marginLeft: 14,
    letterSpacing: 0.4,
  },
  cardSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
    marginBottom: 28,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  footerLink: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    letterSpacing: 0.2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 28,
    width: '100%',
    maxWidth: screenWidth - 40,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: 24,
    maxHeight: 400,
  },
  modalSectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 12,
  },
  modalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 12,
  },
  modalBullet: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 10,
    paddingLeft: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  declineButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  declineButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  agreeButton: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  agreeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agreeButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
  },
});
