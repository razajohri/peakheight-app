import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Platform, UIManager, InteractionManager, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

// Enable LayoutAnimation on Android (only for old architecture)
// Note: This is a no-op in New Architecture, but kept for backward compatibility
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  // Suppress warning - this is intentional for old architecture support
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (!args[0]?.includes('setLayoutAnimationEnabledExperimental')) {
      originalWarn(...args);
    }
  };
  UIManager.setLayoutAnimationEnabledExperimental(true);
  console.warn = originalWarn;
}

// Import all onboarding pages
import Onboarding1 from './Onboarding1';
import Onboarding2 from './Onboarding2';
import Onboarding3 from './Onboarding3';
import Onboarding4 from './Onboarding4';
import Onboarding5 from './Onboarding5';
import Onboarding5B from './Onboarding5B';
import Onboarding6 from './Onboarding6';
import Onboarding7 from './Onboarding7';
import Onboarding7A from './Onboarding7A';
import Onboarding8 from './Onboarding8';
import Onboarding9 from './Onboarding9';
import Onboarding10 from './Onboarding10';
import Onboarding11 from './Onboarding11';
import Onboarding12 from './Onboarding12';
import Onboarding13 from './Onboarding13';
import Onboarding13A from './Onboarding13A';
import Onboarding14 from './Onboarding14';
import Onboarding15 from './Onboarding15';
import Onboarding17 from './Onboarding17';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CompleteOnboardingFlow({ onComplete, onAuthRequired, initialData }) {
  const [currentPage, setCurrentPage] = useState(1); // Start with Onboarding1
  const [data, setData] = useState(initialData || {});
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const isAnimating = useRef(false);
  const isInitialMount = useRef(true);

  // Reset animation when page changes (but not during animation)
  useEffect(() => {
    // Skip reset on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Only reset if not currently animating
    if (!isAnimating.current) {
      slideAnim.setValue(0);
      opacityAnim.setValue(1);
    }
  }, [currentPage]);

  const nextPage = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentPage < 19) {
      // Preload next page content using InteractionManager
      InteractionManager.runAfterInteractions(() => {
        // Use requestAnimationFrame for smooth start
        requestAnimationFrame(() => {
          // Smooth slide and fade animation with optimized easing
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: -SCREEN_WIDTH,
              duration: 180,
              easing: Easing.bezier(0.4, 0.0, 0.2, 1),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.2,
              duration: 120,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]).start(() => {
            setCurrentPage(currentPage + 1);
            slideAnim.setValue(SCREEN_WIDTH);
            opacityAnim.setValue(0.2);
            
            // Slide in and fade in the new page
            requestAnimationFrame(() => {
              Animated.parallel([
                Animated.timing(slideAnim, {
                  toValue: 0,
                  duration: 180,
                  easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                  useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                  toValue: 1,
                  duration: 120,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: true,
                }),
              ]).start(() => {
                isAnimating.current = false;
              });
            });
          });
        });
      });
    } else {
      handleComplete();
      isAnimating.current = false;
    }
  };

  const prevPage = () => {
    if (isAnimating.current || currentPage <= 1) return;
    isAnimating.current = true;
    
    // Use InteractionManager for smooth transitions
    InteractionManager.runAfterInteractions(() => {
      // Use requestAnimationFrame for smooth start
      requestAnimationFrame(() => {
        // Smooth slide and fade animation (reverse) with simple, smooth easing (like Onboarding13)
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: SCREEN_WIDTH,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.2,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setCurrentPage(currentPage - 1);
          slideAnim.setValue(-SCREEN_WIDTH);
          opacityAnim.setValue(0.2);
          
          // Slide in and fade in the new page
          requestAnimationFrame(() => {
            Animated.parallel([
              Animated.timing(slideAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              }),
            ]).start(() => {
              isAnimating.current = false;
            });
          });
        });
      });
    });
  };

  const updateData = (newData) => {
    console.log('📝 updateData called with:', newData);
    setData(prevData => {
      const updated = { ...prevData, ...newData };
      console.log('📝 Updated data:', updated);
      return updated;
    });
  };

  const handleComplete = async () => {
    try {
      // Save onboarding data and complete the flow
      await onComplete(data);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const navigateToPage = (pageNumber) => {
    if (isAnimating.current) return;
    if (pageNumber === currentPage) return;
    
    
    const direction = pageNumber > currentPage ? 1 : -1;
    isAnimating.current = true;
    
    // Use InteractionManager for smooth transitions
    InteractionManager.runAfterInteractions(() => {
      // Use requestAnimationFrame to ensure smooth start
      requestAnimationFrame(() => {
        // Smooth slide and fade animation with simple, smooth easing (like Onboarding13)
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -direction * SCREEN_WIDTH,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.2,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Change page immediately after fade out
          setCurrentPage(pageNumber);
          // Reset position for slide in
          slideAnim.setValue(direction * SCREEN_WIDTH);
          opacityAnim.setValue(0.2);
          
          // Slide in and fade in the new page
          requestAnimationFrame(() => {
            Animated.parallel([
              Animated.timing(slideAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              }),
            ]).start(() => {
              isAnimating.current = false;
            });
          });
        });
      });
    });
  };

  const renderCurrentPage = () => {
    const navigation = {
      navigate: async (screenName) => {
        if (screenName === 'Onboarding2') navigateToPage(2);
        else if (screenName === 'Onboarding3') navigateToPage(3);
        else if (screenName === 'Onboarding4') navigateToPage(4);
        else if (screenName === 'Onboarding5') navigateToPage(5);
        else if (screenName === 'Onboarding5B') navigateToPage(6);
        else if (screenName === 'Onboarding6') navigateToPage(7);
        else if (screenName === 'Onboarding7') navigateToPage(8);
        else if (screenName === 'Onboarding7A') navigateToPage(9);
        else if (screenName === 'Onboarding8') navigateToPage(10);
        else if (screenName === 'Onboarding9') navigateToPage(11);
        else if (screenName === 'Onboarding10') navigateToPage(12);
        else if (screenName === 'Onboarding11') navigateToPage(13);
        else if (screenName === 'Onboarding12') navigateToPage(14);
        else if (screenName === 'Onboarding13') navigateToPage(15);
        else if (screenName === 'Onboarding13A') navigateToPage(16);
        else if (screenName === 'Onboarding14') navigateToPage(17);
        else if (screenName === 'Onboarding15') navigateToPage(18);
        else if (screenName === 'Onboarding17') navigateToPage(19);
        else if (screenName === 'Dashboard') handleComplete();
        else if (screenName === 'Auth') {
          console.log('🔐 OnAuthRequired called with data:', data);
          console.log('🔐 Data keys:', Object.keys(data || {}));

          // Store onboarding data in AsyncStorage as backup before auth
          try {
            await AsyncStorage.setItem('pendingOnboardingData', JSON.stringify(data));
            console.log('💾 Stored onboarding data in AsyncStorage before auth');
          } catch (error) {
            console.error('Failed to store onboarding data in AsyncStorage:', error);
          }

          // New users should see signup page first (default mode is 'signup')
          onAuthRequired(data, 'signup', true);
        }
        else if (screenName === 'AuthLogin') {
          console.log('🔐 Navigate to Auth with signin mode');
          onAuthRequired(data, 'signin', true); // true = came from onboarding
        }
      },
      goBack: () => {
        if (currentPage > 1) {
          prevPage();
        }
      }
    };

    const commonProps = {
      navigation,
      data,
      updateData,
      onAuthRequired
    };

    switch (currentPage) {
      case 1:
        return <Onboarding1 {...commonProps} />;
      case 2:
        return <Onboarding2 {...commonProps} />;
      case 3:
        return <Onboarding3 {...commonProps} />;
      case 4:
        return <Onboarding4 {...commonProps} />;
      case 5:
        return <Onboarding5 {...commonProps} />;
      case 6:
        return <Onboarding5B {...commonProps} />;
      case 7:
        return <Onboarding6 {...commonProps} />;
      case 8:
        return <Onboarding7 {...commonProps} />;
      case 9:
        return <Onboarding7A {...commonProps} />;
      case 10:
        return <Onboarding8 {...commonProps} />;
      case 11:
        return <Onboarding9 {...commonProps} />;
      case 12:
        return <Onboarding10 {...commonProps} />;
      case 13:
        return <Onboarding11 {...commonProps} />;
      case 14:
        return <Onboarding12 {...commonProps} />;
      case 15:
        return <Onboarding13 {...commonProps} />;
      case 16:
        return <Onboarding13A {...commonProps} />;
      case 17:
        return <Onboarding14 {...commonProps} />;
      case 18:
        return <Onboarding15 {...commonProps} />;
      case 19:
        return <Onboarding17 {...commonProps} />;
      default:
        return <Onboarding1 {...commonProps} />;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.pageContainer,
          {
            opacity: opacityAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {renderCurrentPage()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  pageContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    // Optimize for animations
    transform: [{ translateZ: 0 }],
  },
});
