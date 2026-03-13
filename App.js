import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, StatusBar, View, Image, Text, Animated, Easing, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// We rely on Expo's default auto-hide for native splash and show our own custom splash

// Initialize Sentry early - temporarily disabled due to prototype errors
// import { initSentry } from './src/config/sentry';

// Initialize Sentry with error handling - will be called after React Native is ready
// initSentry();

// Services
import { supabase } from './src/config/supabase';
import { AuthService } from './src/services/auth';
import SubscriptionService from './src/services/subscriptionService';
import MockSubscriptionService from './src/services/mockSubscriptionService';

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

  // Prefer explicit first/last, but fall back to fullName/displayName when present
  let firstName = data.firstName;
  let lastName = data.lastName;
  let displayName = data.displayName || data.fullName;

  if (!firstName && (data.fullName || displayName)) {
    const source = (data.fullName || displayName || '').trim();
    if (source) {
      const parts = source.split(/\s+/);
      firstName = parts[0] || undefined;
      lastName = parts.length > 1 ? parts.slice(1).join(' ') : undefined;
    }
  }

	return {
		// Identity
		displayName,
		firstName,
		lastName,
    // Optional onboarding contact email (can differ from login email)
    contactEmail: data.email,
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
		// What user has tried
		triedOptions: data.triedOptions && data.triedOptions.length > 0 ? data.triedOptions : undefined,
		// What's stopping user from goals
		stoppingGoals: data.stoppingGoals && data.stoppingGoals.length > 0 ? data.stoppingGoals : undefined,
		// Profile picture
		avatarUrl: data.avatar_url,
		// Completion flag
		onboardingCompleted: true,
	};
};

export default function App() {
  // Toggle mock subscriptions while developing/testing
  const USE_MOCK_SUBSCRIPTIONS = false;
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [user, setUser] = useState(null);
  const [onboardingData, setOnboardingData] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isHandlingAuth, setIsHandlingAuth] = useState(false);
  const [userContextKey, setUserContextKey] = useState(0);
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'signin'
  const [fromOnboarding, setFromOnboarding] = useState(false);
  const splashProgress = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.95)).current;
  const appState = useRef(AppState.currentState);
  const didMountRef = useRef(false);
  const backgroundTime = useRef(null);

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

  // Show splash only when app was in background for extended period (simulates force close behavior)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (!didMountRef.current) { didMountRef.current = true; return; }
      const prev = appState.current;
      appState.current = nextState;
      
      // Track when app goes to background
      if (nextState === 'background') {
        backgroundTime.current = Date.now();
      }
      
      // Only show splash if coming back after being in background for 5+ minutes
      // This simulates "force close" behavior - quick app switches won't trigger it
      if (prev === 'background' && nextState === 'active') {
        const timeInBackground = backgroundTime.current ? Date.now() - backgroundTime.current : 0;
        const THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        if (timeInBackground > THRESHOLD) {
          setShowCustomSplash(true);
          startSplashAnimations();
          setTimeout(() => setShowCustomSplash(false), 2500);
        }
        backgroundTime.current = null;
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
        // Don't treat session errors as fatal - might just be no stored session
        console.log('No stored session found or session error, user needs to sign in');
        setCurrentScreen('onboarding');
        setIsReady(true);
        setShowCustomSplash(true);
        startSplashAnimations();
        setTimeout(() => setShowCustomSplash(false), 2500);
        return;
      }

      if (session?.user) {
        console.log('✅ Stored session found for user:', session.user.id);
        console.log('📅 Session expires at:', session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'unknown');
        
        // Check if session is expired
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = session.expires_at;
        
        if (expiresAt && expiresAt < now) {
          console.log('⚠️ Session expired, attempting to refresh...');
          try {
            const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError || !refreshedSession) {
              console.error('❌ Failed to refresh expired session:', refreshError?.message);
              // Session expired and couldn't refresh - user needs to login again
              console.log('🔄 Clearing expired session and redirecting to login');
              await supabase.auth.signOut();
              setCurrentScreen('onboarding');
              setIsReady(true);
              setShowCustomSplash(true);
              startSplashAnimations();
              setTimeout(() => setShowCustomSplash(false), 2500);
              return;
            } else {
              console.log('✅ Expired session refreshed successfully');
              // Use refreshed session
            }
          } catch (refreshErr) {
            console.error('❌ Error refreshing expired session:', refreshErr);
            // If we can't refresh, user needs to login again
            await supabase.auth.signOut();
            setCurrentScreen('onboarding');
            setIsReady(true);
            setShowCustomSplash(true);
            startSplashAnimations();
            setTimeout(() => setShowCustomSplash(false), 2500);
            return;
          }
        } else {
          // Session is still valid, try to refresh it in background (non-blocking)
          try {
            const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError) {
              console.log('⚠️ Session refresh failed, but using stored session:', refreshError.message);
              // Continue with stored session even if refresh fails (might be offline)
            } else if (refreshedSession) {
              console.log('✅ Session refreshed successfully');
              // Session refreshed, continue with it
            }
          } catch (refreshErr) {
            console.log('⚠️ Session refresh error (non-fatal):', refreshErr.message);
            // Continue with stored session
          }
        }

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
            // User has completed onboarding, check subscription status
            await checkSubscriptionAndNavigate(profile);
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
        console.log('No authenticated session found');
        setCurrentScreen('onboarding');
      }

      setIsReady(true);
      // Show custom splash for 2.5 seconds
      setShowCustomSplash(true);
      startSplashAnimations();
      setTimeout(() => setShowCustomSplash(false), 2500);

    } catch (error) {
      console.error('Failed to initialize app:', error);
      // Don't set error for auth issues - just go to onboarding
      console.log('Initialization error, defaulting to onboarding screen');
      setCurrentScreen('onboarding');
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
    if (data.authMode) setAuthMode(data.authMode);
    if (data.fromOnboarding !== undefined) setFromOnboarding(data.fromOnboarding);
  };

  // Check subscription status and navigate accordingly
  const checkSubscriptionAndNavigate = async (user, forcePaywall = false) => {
    try {
      console.log('🔒 Checking subscription status...', forcePaywall ? '(forced paywall)' : '');

      // Bypass RevenueCat for test users - check DB premium_status only
      const bypassUserIds = [
        'db497060-1ca7-428f-adcd-7546b72405de', // roman.lakhnyu@gmail.com
        'c8c02575-4351-4953-b04b-3c6c8adbcde2', // usepeakheight@gmail.com
        'a8e234d9-dd05-4d72-9d0b-5cbbfc1022a6', // imeddieking@gmail.com
        'ebb90fe5-eec7-4696-ac61-48432db46e0b', // immujtaba@gmail.com (old ID)
        'b241a0ec-bd7b-46d9-93cf-29ab6a37dde1'  // immujtaba@gmail.com
      ];

      const isBypassUser = user?.id && bypassUserIds.includes(user.id);

      // If forcePaywall is true (new user), always show paywall first (unless bypass user with premium)
      if (forcePaywall && !isBypassUser) {
        console.log('🆕 New user detected, showing paywall first');
        setCurrentScreen('paywall');
        return;
      }

      // 1) Always fetch latest premium_status from DB to avoid stale profile objects
      let premiumFromDb = null;
      try {
        const { data: latestUser, error: latestErr } = await supabase
          .from('users')
          .select('premium_status')
          .eq('id', user?.id)
          .maybeSingle();

        if (!latestErr && latestUser) {
          premiumFromDb = !!latestUser.premium_status;
          console.log('🗄️ Latest premium_status from DB:', premiumFromDb);
        } else if (latestErr) {
          console.log('⚠️ Could not fetch latest premium_status:', latestErr);
        }
      } catch (dbCheckErr) {
        console.log('⚠️ Error while checking premium_status in DB:', dbCheckErr);
      }

      // 1b) Fast path with latest DB value
      if (premiumFromDb === true || user?.premium_status === true) {
        console.log('✅ DB shows premium, going to main app');
        setCurrentScreen('main-app');
        return;
      }

      // 1c) For bypass users, skip RevenueCat entirely - only use DB premium_status
      if (isBypassUser) {
        console.log('🔓 Bypass user detected, skipping RevenueCat check');
        if (premiumFromDb === false || (!premiumFromDb && !user?.premium_status)) {
          console.log('❌ Bypass user has no premium status, showing paywall');
          setCurrentScreen('paywall');
        } else {
          console.log('✅ Bypass user going to main app');
          setCurrentScreen('main-app');
        }
        return;
      }

      // 2) If DB not definitive, check via subscription service (only for non-bypass users)
      let isSubscribed = false;

      if (USE_MOCK_SUBSCRIPTIONS) {
        const result = await MockSubscriptionService.checkSubscriptionStatus();
        isSubscribed = !!result?.isSubscribed;
      } else {
        await SubscriptionService.initialize();
        const result = await SubscriptionService.checkSubscriptionStatus();
        isSubscribed = !!result?.isSubscribed;
      }

      if (isSubscribed) {
        console.log('✅ Active subscription detected, navigating to main app');
        setCurrentScreen('main-app');
      } else {
        console.log('❌ No active subscription, showing paywall');
        setCurrentScreen('paywall');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      // On error, be conservative but avoid RevenueCat noise in mock
      setCurrentScreen('paywall');
    }
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

  const handleAuthSuccess = async (authUser, onboardingDataFromAuth, isAppleSignIn = false) => {
    try {
      console.log('🔐 handleAuthSuccess called with user:', authUser.id);
      console.log('🍎 Is Apple Sign In:', isAppleSignIn);
      console.log('📊 OnboardingData from AuthScreen:', onboardingDataFromAuth);
      console.log('📊 Current onboardingData from state:', onboardingData);
      console.log('📊 Current onboardingData keys:', Object.keys(onboardingData || {}));
      setIsHandlingAuth(true);
      setUser(authUser);

      // Bypass RevenueCat for test users
      const bypassUserIds = [
        'db497060-1ca7-428f-adcd-7546b72405de', // roman.lakhnyu@gmail.com
        'c8c02575-4351-4953-b04b-3c6c8adbcde2', // usepeakheight@gmail.com
        'a8e234d9-dd05-4d72-9d0b-5cbbfc1022a6', // imeddieking@gmail.com
        'ebb90fe5-eec7-4696-ac61-48432db46e0b', // immujtaba@gmail.com (old ID)
        'b241a0ec-bd7b-46d9-93cf-29ab6a37dde1'  // immujtaba@gmail.com
      ];
      const isBypassUser = bypassUserIds.includes(authUser.id);

      // FAST PATH: Check if user is already premium in database first
      console.log('🔍 Checking if user is already premium...', isAppleSignIn ? '(Apple Sign-In)' : '(Email/Password)');
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('premium_status, onboarding_completed')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!userDataError && userData?.premium_status === true) {
        console.log('✅ User is already premium in database - FAST PATH to main app', isAppleSignIn ? '(Apple user)' : '');
        
        // Only log into RevenueCat for non-bypass users (bypass users skip RevenueCat entirely)
        if (!isBypassUser && !USE_MOCK_SUBSCRIPTIONS) {
          SubscriptionService.initialize()
            .then(() => SubscriptionService.logUserIntoRevenueCat(authUser.id))
            .then(() => console.log('✅ Background RevenueCat sync completed'))
            .catch(rcError => console.log('⚠️ Background RevenueCat sync failed:', rcError));
        } else if (isBypassUser) {
          console.log('🔓 Bypass user detected - skipping RevenueCat login');
        }
        
        // Get full profile and go directly to main app
        const { profile } = await AuthService.getUserProfile(authUser.id);
        if (profile) {
          setUser(profile);
          setUserContextKey((k) => k + 1); // Refresh UserContext to load profile data
          setCurrentScreen('main-app');
          return; // Skip all the complex logic below
        }
      }

      // REGULAR PATH: User is not premium, proceed with normal flow
      console.log('🔄 User is not premium, proceeding with normal authentication flow...');
      
      // CRITICAL: Log user into RevenueCat after successful authentication (only for non-bypass users)
      if (!isBypassUser && !USE_MOCK_SUBSCRIPTIONS) {
        try {
          console.log('🔐 Logging user into RevenueCat...');
          await SubscriptionService.initialize(); // Ensure RevenueCat is initialized
          const customerInfo = await SubscriptionService.logUserIntoRevenueCat(authUser.id);
          console.log('✅ User successfully logged into RevenueCat');
          console.log('📊 Customer info from RevenueCat:', customerInfo?.entitlements?.active ? 'Has active subscriptions' : 'No active subscriptions');
        } catch (rcError) {
          console.error('❌ Failed to log user into RevenueCat:', rcError);
          // Don't block auth flow, but log the error
        }
      } else if (isBypassUser) {
        console.log('🔓 Bypass user detected - skipping RevenueCat login to avoid purchase errors');
      }

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

        // Minimal delay for database trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 200));

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

        // Create join event for Tribe notifications (database trigger should also create it, but this ensures it)
        try {
          const { DatabaseService } = require('./src/services/database');
          const { data, error: joinError } = await DatabaseService.createJoinEvent(authUser.id);
          if (joinError) {
            console.log('⚠️ Could not create join event (may already exist):', joinError);
          } else {
            console.log('✅ Join event created for Tribe:', data ? 'created' : 'already exists');
          }
        } catch (joinError) {
          console.log('⚠️ Could not create join event:', joinError.message);
          // Non-critical error, continue
        }

        // Clear the stored onboarding data after successful save
        await AsyncStorage.removeItem('pendingOnboardingData');
        console.log('🧹 Cleared pending onboarding data from AsyncStorage');

        setUser(profile);
        setUserContextKey((k) => k + 1); // refresh provider so greeting shows correct name
        console.log('✅ Onboarding completed, checking subscription status');
        // Minimal delay for database sync
        await new Promise(resolve => setTimeout(resolve, 100));
        await checkSubscriptionAndNavigate(profile, false); // Check premium status, don't force paywall
      } else {
        console.log('🔍 No onboarding data found, checking existing profile...');
        // No onboarding data, check if user has existing profile
        // Minimal delay for database trigger
        await new Promise(resolve => setTimeout(resolve, 400));
        const { profile, error } = await AuthService.getUserProfile(authUser.id);
        console.log('👤 Profile result:', profile ? 'found' : 'not found', error ? `error: ${error}` : '');

        if (profile) {
          setUser(profile);
          setUserContextKey((k) => k + 1); // Refresh UserContext to load profile data
          // For existing users (who have a profile), always check subscription status first
          // Only force paywall if they're a brand new user with no profile at all
          console.log('✅ User has existing profile, checking subscription status');
          // Small delay to ensure database updates from RevenueCat have completed
          await new Promise(resolve => setTimeout(resolve, 500));
          await checkSubscriptionAndNavigate(profile, false); // Check premium status, don't force paywall
        } else {
          // Profile not found - this is a brand new signup
          // For a paid app, send them directly to paywall after account creation
          console.log('🆕 Brand new user with no profile, forcing paywall');
          setUser(authUser);
          await checkSubscriptionAndNavigate(authUser, true); // Force paywall for new users
        }
      }
    } catch (error) {
      console.error('❌ Auth success handler failed:', error);
      
      // For premium users, don't show error screen - try to navigate to main app
      if (authUser && authUser.id) {
        console.log('🔄 Auth failed but user is authenticated, attempting direct navigation...');
        
        // Try to get user profile and check if they have premium status
        try {
          const { profile } = await AuthService.getUserProfile(authUser.id);
          if (profile) {
            setUser(profile);
            setUserContextKey((k) => k + 1); // Refresh UserContext to load profile data
            // Check if user has premium status in database
            const { data: userData } = await supabase
              .from('users')
              .select('premium_status')
              .eq('id', authUser.id)
              .maybeSingle();
            
            if (userData?.premium_status) {
              console.log('✅ User has premium status, navigating to main app');
              setCurrentScreen('main-app');
            } else {
              console.log('❌ User has no premium status, showing paywall');
              setCurrentScreen('paywall');
            }
          } else {
            console.log('❌ No profile found, showing paywall');
            setCurrentScreen('paywall');
          }
        } catch (fallbackError) {
          console.error('❌ Fallback navigation also failed:', fallbackError);
          setError('Authentication successful but failed to save data.');
        }
      } else {
        setError('Authentication successful but failed to save data.');
      }
    } finally {
      setIsHandlingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      // CRITICAL: Log out from RevenueCat first
      if (!USE_MOCK_SUBSCRIPTIONS) {
        try {
          console.log('🔐 Logging user out of RevenueCat...');
          await SubscriptionService.logUserOutOfRevenueCat();
          console.log('✅ User successfully logged out of RevenueCat');
        } catch (rcError) {
          console.error('❌ Failed to log user out of RevenueCat:', rcError);
          // Don't block logout flow, but log the error
        }
      }

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

  const clearError = () => {
    setError(null);
    // If user is authenticated, try to navigate to appropriate screen
    if (user && user.id) {
      // Check if user has premium status and navigate accordingly
      checkSubscriptionAndNavigate(user, false);
    } else {
      // If no user, go back to onboarding
      navigateTo('onboarding');
    }
  };

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
            onAuthRequired={(data, mode, fromOnboarding) => navigateTo('auth', { onboardingData: data, authMode: mode, fromOnboarding: fromOnboarding })}
            initialData={onboardingData}
            onBack={() => navigateTo('onboarding')}
          />
        );

      case 'auth':
        return (
          <AuthScreen
            onSuccess={(user, onboardingData, isAppleSignIn) => handleAuthSuccess(user, onboardingData, isAppleSignIn)}
            onBack={() => {
              // If came from onboarding, go back to onboarding
              // Otherwise, if in signin mode, switch to signup mode
              if (fromOnboarding) {
                navigateTo('onboarding');
              } else if (authMode === 'signin') {
                setAuthMode('signup');
              } else {
                navigateTo('onboarding');
              }
            }}
            onboardingData={onboardingData}
            initialMode={authMode}
            fromOnboarding={fromOnboarding}
            onModeChange={(newMode) => setAuthMode(newMode)}
          />
        );

      case 'paywall':
        return (
          <PaywallScreen
            onSuccess={async () => {
              console.log('✅ Payment successful, navigating to main app');
              // Refresh user context to get latest subscription status
              setUserContextKey((k) => k + 1);
              navigateTo('main-app');
            }}
            onBack={() => navigateTo('onboarding')}
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
