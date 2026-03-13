// Onboarding1.js (Page 1 - Maximize your full height potential)
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar, Platform, Dimensions, PanResponder } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Icon from '../../components/UI/Icon';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS 
} from '../../utils/onboardingConstants';

const HERO_IMAGE = require('../../../assets/imnotnew.webp');

// Stars Animation Component
const StarsBackground = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const numStars = 30;
  
  const stars = useRef(
    Array.from({ length: numStars }, (_, i) => {
      const randomX = Math.random() * screenWidth;
      const randomY = Math.random() * screenHeight;
      const randomDelay = Math.random() * 2000;
      const randomDuration = 2000 + Math.random() * 2000;
      return {
        opacity: new Animated.Value(0.3),
        x: randomX,
        y: randomY,
        delay: randomDelay,
        duration: randomDuration,
        size: 1 + Math.random() * 2,
      };
    })
  ).current;

  useEffect(() => {
    const animations = stars.map((star) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(star.delay),
          Animated.timing(star.opacity, {
            toValue: 1,
            duration: star.duration,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 0.2,
            duration: star.duration,
            useNativeDriver: true,
          }),
        ])
      );
    });

    animations.forEach((anim) => anim.start());

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, []);

  return (
    <View style={styles.starsContainer} pointerEvents="none">
      {stars.map((star, index) => (
        <Animated.View
          key={index}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const SwipeButton = ({ onSwipeComplete, buttonTranslateY }) => {
  const swipeX = React.useRef(new Animated.Value(0)).current;
  const [trackLayout, setTrackLayout] = React.useState({ width: 0 });
  const hasCompleted = React.useRef(false);
  const thumbScale = React.useRef(new Animated.Value(1)).current;
  const currentSwipeValue = React.useRef(0);
  const startX = React.useRef(0);

  React.useEffect(() => {
    const listenerId = swipeX.addListener(({ value }) => {
      currentSwipeValue.current = value;
    });
    return () => {
      swipeX.removeListener(listenerId);
    };
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (hasCompleted.current) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        startX.current = currentSwipeValue.current;
        Animated.spring(thumbScale, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        if (hasCompleted.current) return;
        
        const { width } = trackLayout;
        const actualWidth = width > 0 ? width : Dimensions.get('window').width - 32;
        const thumbSize = 48;
        const padding = 6;
        const maxSwipe = actualWidth - thumbSize - padding * 2;
        
        const newValue = Math.max(0, Math.min(maxSwipe, startX.current + gestureState.dx));
        swipeX.setValue(newValue);
        
        // Check if swipe is complete during movement (easier completion)
        if (maxSwipe > 0) {
          const swipeProgress = newValue / maxSwipe;
          if (swipeProgress >= 0.70) {
            // Complete swipe immediately
            hasCompleted.current = true;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Animated.parallel([
              Animated.timing(swipeX, {
                toValue: maxSwipe,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.spring(thumbScale, {
                toValue: 1.15,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setTimeout(() => {
                onSwipeComplete();
              }, 100);
            });
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (hasCompleted.current) return;
        
        const { width } = trackLayout;
        const actualWidth = width > 0 ? width : Dimensions.get('window').width - 32;
        if (actualWidth === 0) {
          swipeX.setValue(0);
          startX.current = 0;
          return;
        }
        
        Animated.spring(thumbScale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        
        const thumbSize = 48;
        const padding = 6;
        const maxSwipe = actualWidth - thumbSize - padding * 2;
        const currentValue = currentSwipeValue.current;
        const swipeProgress = maxSwipe > 0 ? currentValue / maxSwipe : 0;
        
        if (swipeProgress >= 0.70) {
          // Complete swipe
          hasCompleted.current = true;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Animated.parallel([
            Animated.timing(swipeX, {
              toValue: maxSwipe,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(thumbScale, {
              toValue: 1.15,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setTimeout(() => {
              onSwipeComplete();
            }, 100);
          });
        } else {
          // Snap back
          Animated.parallel([
            Animated.spring(swipeX, {
              toValue: 0,
              tension: 80,
              friction: 10,
              useNativeDriver: true,
            }),
            Animated.spring(thumbScale, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start();
        }
        startX.current = 0;
      },
    })
  ).current;

  const onTrackLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setTrackLayout({ width });
    }
  };

  const thumbSize = 48;
  const padding = 6;
  const maxSwipe = trackLayout.width > 0 ? trackLayout.width - thumbSize - padding * 2 : 300;

  const thumbTranslateX = swipeX.interpolate({
    inputRange: [0, Math.max(1, maxSwipe)],
    outputRange: [0, Math.max(0, maxSwipe)],
    extrapolate: 'clamp',
  });

  const textOpacity = swipeX.interpolate({
    inputRange: [0, Math.max(1, maxSwipe * 0.4)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const progressScaleX = swipeX.interpolate({
    inputRange: [0, Math.max(1, maxSwipe)],
    outputRange: [0.001, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[styles.swipeButtonContainer, { transform: [{ translateY: buttonTranslateY }] }]}
    >
      <View 
        style={styles.swipeButtonTrack} 
        onLayout={onTrackLayout}
        collapsable={false}
        {...panResponder.panHandlers}
      >
        {/* Progress fill with premium gradient */}
        {trackLayout.width > 0 && (
          <Animated.View 
            style={[
              styles.swipeProgressFill,
              { 
                transform: [{ scaleX: progressScaleX }]
              }
            ]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        )}
        
        {/* Text */}
        <Animated.View 
          style={[
            styles.swipeButtonTextContainer,
            { opacity: textOpacity }
          ]}
          pointerEvents="none"
        >
          <View style={styles.swipeButtonTextBackground}>
            <Text style={styles.swipeButtonText}>Get Started Now!</Text>
          </View>
        </Animated.View>
        
        {/* Thumb */}
        <Animated.View 
          style={[
            styles.swipeButtonThumb,
            { 
              transform: [
                { translateX: thumbTranslateX },
                { scale: thumbScale }
              ]
            }
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={['#FFFFFF', '#F0F0F0', '#E8E8E8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.thumbGradient}
          >
            <View style={styles.thumbInnerGlow} />
            <Icon name="arrow-forward" size={24} color="#000000" />
          </LinearGradient>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const Onboarding1 = ({ navigation }) => {
  // Safe area insets for iOS bottom coverage
  const insets = useSafeAreaInsets();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Animation values
  const headlineTranslateY = useRef(new Animated.Value(-60)).current; // Start from above
  const headlineOpacity = useRef(new Animated.Value(0)).current;
  const brandWordmarkOpacity = useRef(new Animated.Value(0)).current;
  const brandWordmarkTranslateY = useRef(new Animated.Value(-30)).current;
  const featureListOpacity = useRef(new Animated.Value(0)).current;
  const featureListTranslateYAnim = useRef(new Animated.Value(20)).current;
  const imageTranslateY = useRef(new Animated.Value(100)).current; // Start from below
  const imageOpacity = useRef(new Animated.Value(1)).current; // Start visible immediately
  const imageScale = useRef(new Animated.Value(0.8)).current; // Start smaller
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(40)).current;
  const loginOpacity = useRef(new Animated.Value(0)).current;
  const loginTranslateY = useRef(new Animated.Value(20)).current;
  const screenFadeOut = useRef(new Animated.Value(1)).current;
  const heroSubtitle = 'Maximize your height potential naturally with the right daily habits and AI tools';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const heroImageWidth = Math.max(300, Math.min(screenWidth * 1.12, 540));
  // Using a taller aspect ratio for the new image
  const heroImageHeight = Math.max(450, Math.min(heroImageWidth * 1.5, screenHeight * 0.82));
  const heroImageContainerHeight = heroImageHeight + 140;
  
  // Unified adjustments for both platforms
  const featureListTop = screenHeight * 0.55;
  // TranslateY to position feature list from top of container
  // Position it near the end of the image (around 90% down)
  const featureListPositionY = Math.min(heroImageHeight * 0.93, heroImageContainerHeight - 60);
  const buttonTranslateOffset = -33;
  const overlayPaddingTop = -30;
  const heroSectionPaddingTop = -10;

  // Preload image as early as possible
  useEffect(() => {
    // For local images, expo-image handles caching automatically
    // But we can warm up the cache by rendering it off-screen first
    // The cachePolicy="memory-disk" will ensure it's cached for next time
  }, []);

  useEffect(() => {
    // All animations start together with same timing
    Animated.parallel([
      // Brand wordmark
      Animated.spring(brandWordmarkTranslateY, {
        toValue: 0,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(brandWordmarkOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Feature list
      Animated.timing(featureListTranslateYAnim, {
        toValue: 0,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(featureListOpacity, {
        toValue: 1,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
      // Image
      Animated.spring(imageTranslateY, {
        toValue: 0,
        tension: 70,
        friction: 6,
        useNativeDriver: true,
      }),
      // Image opacity - already at 1, no animation needed for instant display
      Animated.spring(imageScale, {
        toValue: 1,
        tension: 70,
        friction: 6,
        useNativeDriver: true,
      }),
      // Buttons
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      // Login link
      Animated.timing(loginOpacity, {
        toValue: 1,
        duration: 600,
        delay: 250,
        useNativeDriver: true,
      }),
      Animated.timing(loginTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSwipeComplete = () => {
    // Smooth fade-out animation before navigation
    Animated.timing(screenFadeOut, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // Navigate after animation completes
      navigation.navigate('Onboarding2');
    });
  };

  return (
    <LinearGradient
      colors={['#050507', '#000000', '#020202']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.5, 1]}
        style={styles.background}
      >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <StarsBackground />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <Animated.View style={[styles.overlay, { opacity: screenFadeOut }]}>
          <View style={styles.heroSection}>
            <View style={styles.headerRow}>
              <View style={styles.brandWordmarkContainer}>
                <Animated.Text 
                  style={[
                    styles.brandWordmark,
                    {
                      opacity: brandWordmarkOpacity,
                      transform: [{ translateY: brandWordmarkTranslateY }],
                    }
                  ]}
                >
                  PEAKHEIGHT
                </Animated.Text>
                <Animated.Text 
            style={[
                    styles.featureList,
              {
                      opacity: featureListOpacity,
                      transform: [{ translateY: featureListTranslateYAnim }],
              }
            ]}
          >
                  Exercises • Food Scanner • Recipes • Community • Personalized AI Coach
                </Animated.Text>
              </View>
                </View>

            <View style={[styles.heroImageWrapper, { height: heroImageContainerHeight, marginTop: -25 }]}>
                <Animated.View
                  style={{
                    transform: [
                      { translateY: imageTranslateY },
                      { scale: imageScale }
                    ],
                    opacity: imageOpacity,
                  }}
                >
                  <Image
                    source={HERO_IMAGE}
                    style={[styles.heroImage, { 
                      width: heroImageWidth || 400, 
                      height: heroImageHeight || 600,
                    }]}
                    contentFit="contain"
                    transition={0}
                    cachePolicy="memory-disk"
                    priority="high"
                    recyclingKey="onboarding-hero"
                    allowDownscaling={false}
                    autoplay={false}
                    onLoadStart={() => {
                      // Image loading started - show immediately
                    }}
                    onLoad={() => {
                      setImageLoaded(true);
                    }}
                    onError={(error) => {
                      console.log('Image load error:', error);
                    }}
                  />
                </Animated.View>
                </View>
          </View>

            <Animated.View
              style={[
                styles.bottomCard,
                {
                  opacity: buttonOpacity,
                paddingBottom: Platform.OS === 'ios' ? 30 + insets.bottom : 20 + insets.bottom,
                marginTop: -heroImageHeight + 120,
                transform: [{ translateY: 0 }],
                zIndex: 1000,
              }
            ]}
          >
            <SwipeButton
              onSwipeComplete={handleSwipeComplete}
              buttonTranslateY={Animated.add(buttonTranslateY, buttonTranslateOffset)}
            />
            <Animated.View
              style={{
                opacity: loginOpacity,
                marginTop: 0,
                transform: [
                  { translateY: Animated.add(loginTranslateY, -15) }
                ],
              }}
            >
                  <TouchableOpacity
                    style={styles.loginLink}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      navigation.navigate('AuthLogin');
                    }}
                  >
                    <Text style={styles.loginLinkText}>Already have an account?</Text>
                  </TouchableOpacity>
                </Animated.View>
          
          </Animated.View>
            </Animated.View>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: ONBOARDING_COLORS.BACKGROUND,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: -30,
    paddingBottom: 8,
  },
  heroSection: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: -30,
    paddingBottom: 4,
    overflow: 'visible',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    zIndex: 100,
  },
  headerLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  brandWordmarkContainer: {
    position: 'relative',
    marginTop: -10,
    marginBottom: 0,
    transform: [{ translateY: 85 }],
    zIndex: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  brandWordmarkStroke: {
    position: 'absolute',
    fontFamily: 'Playfair Display-Bold',
    fontSize: 56,
    color: '#000000',
    letterSpacing: 7,
    fontWeight: '900',
    top: 5,
    left: 5,
    zIndex: 101,
  },
  brandWordmark: {
    position: 'relative',
    fontFamily: 'Inter-Black',
    fontSize: 48,
    color: '#FFFFFF',
    letterSpacing: -1.5,
    fontWeight: '900',
    zIndex: 102,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
  },
  closeKnob: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: -2,
  },
  heroEyebrow: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 40,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 46,
    marginTop: 48,
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 40,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.95)',
    maxWidth: 340,
    marginBottom: -20,
    letterSpacing: 0.3,
    fontWeight: '600',
  },
  heroImageWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 25,
    marginBottom: -8,
    overflow: 'visible',
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  heroImage: {
    borderRadius: 24,
    overflow: 'visible',
    backgroundColor: 'transparent',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
    minWidth: 300,
    minHeight: 450,
  },
  featureList: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    letterSpacing: 0.7,
    marginTop: 2,
    zIndex: 100,
    lineHeight: 14,
  },
  heroFootnote: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroFootnoteText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.5,
  },
  bottomCard: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 38,
  },
  cardSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 22,
  },
  swipeButtonContainer: {
    width: '100%',
    marginBottom: 0,
    zIndex: 1000,
  },
  swipeButtonTrack: {
    borderRadius: 30,
    backgroundColor: '#0A0A0A',
    height: 64,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.7,
    shadowRadius: 32,
    elevation: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 1000,
  },
  swipeProgressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    overflow: 'hidden',
    zIndex: 0,
  },
  swipeButtonThumb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 6,
    zIndex: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  thumbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  thumbInnerGlow: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    top: '20%',
    left: '20%',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  swipeButtonTextContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  swipeButtonTextBackground: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  swipeButtonText: {
    fontWeight: '600',
    fontSize: 17,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.1,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  loginLink: {
    paddingVertical: 4,
  },
  loginLinkText: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    textDecorationLine: 'underline',
    letterSpacing: 0.4,
    textDecorationColor: 'rgba(255, 255, 255, 0.4)',
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  guaranteeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  guaranteeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 0.5,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default Onboarding1;

