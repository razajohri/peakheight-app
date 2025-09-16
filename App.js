import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, StatusBar, View, Image, Text, Animated, Easing, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// We rely on Expo's default auto-hide for native splash and show our own custom splash

// Services
import { supabase } from './src/config/supabase';
import { AuthService } from './src/services/auth';

// Context
import { UserProvider } from './src/contexts/UserContext';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import CompleteOnboardingFlow from './src/screens/onboarding/CompleteOnboardingFlow';
import AuthScreen from './src/screens/AuthScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import MainApp from './src/screens/MainApp';
import ErrorScreen from './src/screens/ErrorScreen';

// Map onboarding form keys to profile update keys expected by AuthService.updateUserProfile
const mapOnboardingToProfile = (data) => {
	if (!data) return {};
	return {
		// Identity
		displayName: data.displayName,
		firstName: data.firstName,
		lastName: data.lastName,
		dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : undefined,
		gender: data.gender,
		// Heights
		currentHeight: data.currentHeight, // in cm
		targetHeight: data.targetHeight ?? data.dreamHeight, // support older key
		// Parents
		parentHeightFather: data.parentHeightFather ?? data.fatherCm,
		parentHeightMother: data.parentHeightMother ?? data.motherCm,
		parentMeasurementSystem: data.parentMeasurementSystem,
		fatherFeet: data.fatherFeet,
		fatherInches: data.fatherInches,
		motherFeet: data.motherFeet,
		motherInches: data.motherInches,
		// Lifestyle
		ethnicity: data.ethnicity,
		footSize: data.footSize,
		footSizeSystem: data.footSizeSystem,
		workoutFrequency: data.workoutFrequency,
		sleepHours: data.sleepHours,
		smokingStatus: data.smokingStatus,
		drinkingStatus: data.drinkingStatus,
		// Motivation
		motivation: data.motivation,
		barriers: data.barriers ? `{${data.barriers.map(b => `"${b}"`).join(',')}}` : undefined,
		// Completion flag
		onboardingCompleted: true,
	};
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [user, setUser] = useState(null);
  const [onboardingData, setOnboardingData] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isHandlingAuth, setIsHandlingAuth] = useState(false);
  const [userContextKey, setUserContextKey] = useState(0);
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const splashProgress = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.95)).current;
  const appState = useRef(AppState.currentState);
  const didMountRef = useRef(false);

  const startSplashAnimations = () => {
    try { splashProgress.setValue(0); } catch {}
    Animated.timing(splashProgress, {
      toValue: 1,
      duration: 2500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    try { logoScale.setValue(0.95); } catch {}
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();

  };

  // Show splash briefly whenever app returns to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (!didMountRef.current) { didMountRef.current = true; return; }
      const prev = appState.current;
      appState.current = nextState;
      if ((prev === 'background' || prev === 'inactive') && nextState === 'active') {
        setShowCustomSplash(true);
        startSplashAnimations();
        setTimeout(() => setShowCustomSplash(false), 2500);
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    initializeApp();

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id, 'isHandlingAuth:', isHandlingAuth);

        if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out, showing custom splash then welcome');
          setUser(null);
          setOnboardingData({});
          setShowCustomSplash(true);
          startSplashAnimations();
          setTimeout(() => {
            setShowCustomSplash(false);
            setCurrentScreen('onboarding');
          }, 2500);
        } else if (event === 'SIGNED_IN' && session?.user) {
          // DISABLED: Let handleAuthSuccess handle all sign-in navigation
          console.log('🔐 SIGNED_IN event detected, but letting handleAuthSuccess handle navigation');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user is already authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error:', sessionError);
        setError('Failed to check authentication status.');
        setIsReady(true);
        return;
      }

      if (session?.user) {
        // User is authenticated, check if onboarding is completed
        // Wait a moment for the database trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 500));

        const { profile, error: profileError } = await AuthService.getUserProfile(session.user.id);

        if (profileError) {
          console.error('Profile error:', profileError);
          // Don't set error, just treat as new user
          console.log('Profile not found, treating as new user');
          setUser(session.user);
          setCurrentScreen('onboarding');
        } else if (profile) {
          setUser(profile);

          if (profile.onboarding_completed) {
            // User has completed onboarding, go to main app
            setCurrentScreen('main-app');
          } else {
            // User needs to complete onboarding
            setCurrentScreen('onboarding');
          }
        } else {
          // Profile not found, start onboarding
          setUser(session.user);
          setCurrentScreen('onboarding');
        }
      } else {
        // No authenticated user, go straight to onboarding
        setCurrentScreen('onboarding');
      }

      setIsReady(true);
      // Show custom splash for 2.5 seconds
      setShowCustomSplash(true);
      startSplashAnimations();
      setTimeout(() => setShowCustomSplash(false), 2500);

    } catch (error) {
      console.error('Failed to initialize app:', error);
      setError('Failed to initialize app. Please restart.');
      setIsReady(true);
      setShowCustomSplash(true);
      startSplashAnimations();
      setTimeout(() => setShowCustomSplash(false), 2500);
    }
  };

  const navigateTo = (screen, data = {}) => {
    setCurrentScreen(screen);
    if (data.user) setUser(data.user);
    if (data.onboardingData) setOnboardingData(data.onboardingData);
  };

  const handleOnboardingComplete = async (data) => {
    try {
      setOnboardingData(data);

      // Store onboarding data in AsyncStorage as backup
      await AsyncStorage.setItem('pendingOnboardingData', JSON.stringify(data));
      console.log('💾 Stored onboarding data in AsyncStorage');

      if (!user) {
        // User needs to sign up first
        navigateTo('auth', { onboardingData: data });
      } else {
        // User is authenticated, save onboarding data to database
        const mapped = mapOnboardingToProfile(data);
        const { profile, error } = await AuthService.updateUserProfile(user.id, mapped);

        if (error) {
          throw new Error(error);
        }

        setUser(profile);
        setUserContextKey((k) => k + 1); // refresh UserProvider to get latest first_name
        navigateTo('main-app');
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setError('Failed to save your data. Please try again.');
    }
  };

  const handleAuthSuccess = async (authUser, onboardingDataFromAuth) => {
    try {
      console.log('🔐 handleAuthSuccess called with user:', authUser.id);
      console.log('📊 OnboardingData from AuthScreen:', onboardingDataFromAuth);
      console.log('📊 Current onboardingData from state:', onboardingData);
      console.log('📊 Current onboardingData keys:', Object.keys(onboardingData || {}));
      setIsHandlingAuth(true);
      setUser(authUser);

      // Try to get onboarding data from AuthScreen parameter first, then state, then AsyncStorage
      let dataToSave = onboardingDataFromAuth || onboardingData;
      if (!dataToSave || Object.keys(dataToSave).length === 0) {
        try {
          const storedData = await AsyncStorage.getItem('pendingOnboardingData');
          if (storedData) {
            dataToSave = JSON.parse(storedData);
            console.log('📦 Retrieved onboarding data from AsyncStorage:', dataToSave);
            setOnboardingData(dataToSave);
          }
        } catch (error) {
          console.error('Failed to retrieve onboarding data from AsyncStorage:', error);
        }
      }

      // Check if user has onboarding data to save
      if (dataToSave && Object.keys(dataToSave).length > 0) {
        console.log('📝 Saving onboarding data...');
        console.log('📝 Data to save:', dataToSave);

        // Wait a moment for the database trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Save onboarding data to database
        const mapped = mapOnboardingToProfile(dataToSave);
        console.log('🗺️ Mapped data:', mapped);
        console.log('🗺️ Mapped data keys:', Object.keys(mapped));
        console.log('🗺️ Date of birth in mapped data:', mapped.dateOfBirth);
        console.log('🗺️ Gender in mapped data:', mapped.gender);
        console.log('🗺️ Barriers in mapped data:', mapped.barriers);
        console.log('🗺️ Smoking status in mapped data:', mapped.smokingStatus);
        console.log('🗺️ Drinking status in mapped data:', mapped.drinkingStatus);

        const { profile, error } = await AuthService.updateUserProfile(authUser.id, mapped);

        if (error) {
          console.error('❌ Failed to save onboarding data:', error);
          throw new Error(error);
        }

        console.log('✅ Onboarding data saved successfully');

        // Clear the stored onboarding data after successful save
        await AsyncStorage.removeItem('pendingOnboardingData');
        console.log('🧹 Cleared pending onboarding data from AsyncStorage');

        setUser(profile);
        setUserContextKey((k) => k + 1); // refresh provider so greeting shows correct name
        console.log('✅ Navigating to main app');
        setCurrentScreen('main-app');
      } else {
        console.log('🔍 No onboarding data found, checking existing profile...');
        // No onboarding data, check if user has existing profile
        // Wait a moment for the database trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { profile, error } = await AuthService.getUserProfile(authUser.id);
        console.log('👤 Profile result:', profile ? 'found' : 'not found', error ? `error: ${error}` : '');

        if (profile) {
          setUser(profile);
          if (profile.onboarding_completed) {
            console.log('✅ User completed onboarding, navigating to main-app');
            setCurrentScreen('main-app');
          } else {
            // User just signed up without onboarding data, send them to onboarding
            console.log('🆕 New user signed up without onboarding data, sending to onboarding');
            setCurrentScreen('onboarding');
          }
        } else {
          // Profile not found, this is likely a new user who just signed up
          // Start onboarding for them
          console.log('🆕 New user, navigating to onboarding');
          setUser(authUser);
          setCurrentScreen('onboarding');
        }
      }
    } catch (error) {
      console.error('❌ Auth success handler failed:', error);
      setError('Authentication successful but failed to save data.');
    } finally {
      setIsHandlingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await AuthService.signOut();

      if (error) {
        throw new Error(error);
      }

      setUser(null);
      setOnboardingData({});
      setShowCustomSplash(true);
      startSplashAnimations();
      setTimeout(() => {
        setShowCustomSplash(false);
        navigateTo('onboarding');
      }, 2500);
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  const clearError = () => setError(null);

  // While native splash is visible, render nothing from React
  if (!isReady) {
    return null;
  }

  if (error) {
    return (
      <SafeAreaProvider>
        <StatusBar backgroundColor="#1a1a1a" barStyle="light-content" />
        <ErrorScreen message={error} onRetry={clearError} />
      </SafeAreaProvider>
    );
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <CompleteOnboardingFlow
            onComplete={handleOnboardingComplete}
            onAuthRequired={(data) => navigateTo('auth', { onboardingData: data })}
            initialData={onboardingData}
            onBack={() => navigateTo('onboarding')}
          />
        );

      case 'auth':
        return (
          <AuthScreen
            onSuccess={handleAuthSuccess}
            onBack={() => navigateTo('onboarding')}
            onboardingData={onboardingData}
          />
        );

      case 'paywall':
        return (
          <PaywallScreen
            onSuccess={() => navigateTo('main-app')}
            onBack={() => navigateTo('auth')}
          />
        );

      case 'main-app':
        return (
          <MainApp
            onLogout={handleLogout}
          />
        );

      default:
        return <ErrorScreen message="Screen not found" onRetry={() => navigateTo('welcome')} />;
    }
  };

  return (
    <SafeAreaProvider>
      <UserProvider key={userContextKey}>
        <View style={styles.container}>
          <StatusBar backgroundColor={showCustomSplash ? '#000000' : '#ffffff'} barStyle={showCustomSplash ? 'light-content' : 'dark-content'} />
          {showCustomSplash ? (
            <View style={styles.splashContainer}>
              <Animated.Image
                source={require('./assets/peakheight-logo-removebg-preview.png')}
                style={[styles.splashLogo, { transform: [{ scale: logoScale }] }]}
                resizeMode="contain"
              />
              <Text style={styles.splashTitle}>PeakHeight</Text>
              <Text style={styles.splashTagline}>Small Habits, Peak Height</Text>
              <View style={styles.progressBarTrack}>
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.progressBarGlow,
                    { width: splashProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }
                  ]}
                />
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    { width: splashProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }
                  ]}
                />
              </View>
            </View>
          ) : (
            renderCurrentScreen()
          )}
        </View>
      </UserProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 32,
  },
  splashLogo: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },

  splashTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  splashTagline: {
    marginTop: 6,
    fontSize: 14,
    color: '#DDDDDD',
  },
  progressBarTrack: {
    marginTop: 24,
    width: '70%',
    height: 10,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#111111',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  progressBarGlow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    opacity: 0.35,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
  },
});
