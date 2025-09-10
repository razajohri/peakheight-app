import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import SplashScreen from './src/screens/SplashScreen';

import CompleteOnboardingFlow from './src/screens/onboarding/CompleteOnboardingFlow';
import AuthScreen from './src/screens/AuthScreen';
import MainApp from './src/screens/MainApp';
import ErrorScreen from './src/screens/ErrorScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [onboardingData, setOnboardingData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // For demo purposes, we'll skip service initialization
      // In a real app, you would initialize Supabase and other services here

      // Simulate checking authentication state
      setTimeout(() => {
        setIsLoading(false);
        setCurrentScreen('main-app');
      }, 3000);

    } catch (error) {
      console.error('Failed to initialize app:', error);
      setError('Failed to initialize app. Please restart.');
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
      // In a real app, you would save to AsyncStorage and database here

      if (!user) {
        navigateTo('auth');
      } else {
        // Simulate saving data and navigate to main app
        navigateTo('main-app');
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setError('Failed to save your data. Please try again.');
    }
  };

  const handleAuthSuccess = async (authUser) => {
    try {
      setUser(authUser);

      // In a real app, you would save onboarding data to database here
      // For demo purposes, we'll just navigate to main app
      navigateTo('main-app');
    } catch (error) {
      console.error('Auth success handler failed:', error);
      setError('Authentication successful but failed to save data.');
    }
  };

  const handleLogout = async () => {
    try {
      // In a real app, you would sign out from authentication service
      setUser(null);
      setOnboardingData({});
      navigateTo('welcome');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  const clearError = () => setError(null);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <StatusBar backgroundColor="#1a1a1a" barStyle="light-content" />
        <SplashScreen />
      </SafeAreaProvider>
    );
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
      case 'splash':
        return <SplashScreen />;



      case 'onboarding':
        return (
          <CompleteOnboardingFlow
            onComplete={handleOnboardingComplete}
            onAuthRequired={() => navigateTo('auth')}
            initialData={onboardingData}
            onBack={() => navigateTo('welcome')}
          />
        );

      case 'auth':
        return (
          <AuthScreen
            onSuccess={handleAuthSuccess}
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
      <View style={styles.container}>
        <StatusBar backgroundColor="#1a1a1a" barStyle="light-content" />
        {renderCurrentScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});
