// Onboarding15.js (Page 15 - Analyze my answers)
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS 
} from '../../utils/onboardingConstants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const completionPoints = [
  'Current height',
  'Genetic potential',
  'Sleep patterns',
  'Exercise consistency',
  'Lifestyle habits',
  'Personal goals',
];

const confettiColors = ['#FF5A5F', '#4CD964', '#FFD166', '#7F5AF0', '#00C2FF'];

const Onboarding15 = ({ navigation }) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const progressBarAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  
  // Create animated values for confetti pieces (30 pieces for better effect)
  const confettiPieces = useRef(
    Array.from({ length: 30 }, (_, i) => {
      const randomX = Math.random() * 100; // Random starting X position (0-100%)
      const randomDelay = Math.random() * 500; // Random delay (0-500ms)
      const randomDuration = 2000 + Math.random() * 1500; // Random duration (2000-3500ms)
      const randomRotation = Math.random() * 720; // Random rotation (0-720 degrees)
      
      return {
        translateY: new Animated.Value(-100), // Start above screen
        translateX: new Animated.Value(0),
        rotate: new Animated.Value(0),
        opacity: new Animated.Value(1),
        x: randomX,
        delay: randomDelay,
        duration: randomDuration,
        rotation: randomRotation,
      };
    })
  ).current;
  
  const steps = [
    'Calculating growth potential...',
    'Analyzing your profile...',
    'Creating custom plan...',
    'Setting up tracking...',
  ];

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressBarAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start();

    // Update progress and steps
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = Math.min(prevProgress + 0.012, 1);
        const stepIndex = Math.floor(newProgress * steps.length);
        if (stepIndex < steps.length) {
          setCurrentStep(steps[stepIndex]);
        }
        
        if (newProgress >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setAnalyzing(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }).start();
          }, 500);
          return 1;
        }
        return newProgress;
      });
    }, 60); // Update every 60ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  // Subtle wavy gradient background inspired by web WavyBackground
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: true,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 12000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bgAnim]);

  // Animate confetti when analysis completes
  useEffect(() => {
    if (!analyzing) {
      // Create falling confetti animations
      const animations = confettiPieces.map((piece) => {
        // Random horizontal drift
        const driftAmount = (Math.random() - 0.5) * 100; // -50 to 50
        
        return Animated.sequence([
          Animated.delay(piece.delay),
          Animated.parallel([
            // Fall from top to bottom
            Animated.timing(piece.translateY, {
              toValue: SCREEN_HEIGHT + 100,
              duration: piece.duration,
              useNativeDriver: true,
            }),
            // Horizontal drift
            Animated.timing(piece.translateX, {
              toValue: driftAmount,
              duration: piece.duration,
              useNativeDriver: true,
            }),
            // Rotation
            Animated.timing(piece.rotate, {
              toValue: piece.rotation,
              duration: piece.duration,
              useNativeDriver: true,
            }),
            // Fade out near bottom
            Animated.sequence([
              Animated.delay(piece.duration * 0.7),
              Animated.timing(piece.opacity, {
                toValue: 0,
                duration: piece.duration * 0.3,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]);
      });

      // Start all animations
      Animated.parallel(animations).start();
    }
  }, [analyzing]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Wavy animated gradient background (mobile-friendly version of web WavyBackground) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.wavyBackground,
          {
            transform: [
              {
                translateX: bgAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-40, 40],
                }),
              },
            ],
          },
        ]}
        >
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#4f46e5', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <FloatingStars />
      <View style={styles.contentContainer}>
        {analyzing ? (
          <View style={styles.analyzeContainer}>
            {/* Large Percentage */}
            <Text style={styles.percentageText}>
              {Math.round(progress * 100)}%
            </Text>

            {/* Title Text */}
            <Text style={styles.setupText}>
              We're setting everything{'\n'}up for you
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: progressBarAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#4ECDC4', '#95E1D3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
              </View>
            </View>

            {/* Current Step Text */}
            <Text style={styles.currentStepText}>
              {currentStep || steps[0]}
            </Text>

            {/* Recommendation Card */}
            <View style={styles.recommendationCard}>
              <Text style={styles.cardTitle}>Daily recommendation for</Text>
              <View style={styles.recommendationList}>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>Daily exercises</Text>
                  {progress > 0.2 && (
                    <View style={styles.checkmarkCircle}>
                      <FontAwesome name="check" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>Nutrition tracking</Text>
                  {progress > 0.4 && (
                    <View style={styles.checkmarkCircle}>
                      <FontAwesome name="check" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>Sleep optimization</Text>
                  {progress > 0.6 && (
                    <View style={styles.checkmarkCircle}>
                      <FontAwesome name="check" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>Posture correction</Text>
                  {progress > 0.8 && (
                    <View style={styles.checkmarkCircle}>
                      <FontAwesome name="check" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>Progress tracking</Text>
                  {progress > 0.95 && (
                    <View style={styles.checkmarkCircle}>
                      <FontAwesome name="check" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        ) : (
          <Animated.View
            style={[
              styles.completeContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.completionBadge}>
              <View style={styles.completionBadgeInner}>
                <Ionicons name="checkmark" size={36} color="#0D1F12" />
              </View>
            </View>

            <Text style={styles.completeTitle}>
              Analysis Complete!
            </Text>


            <View style={styles.completionCard}>
              {completionPoints.map((point) => (
                <View key={point} style={styles.pointItem}>
                <View style={styles.greenCheckmark}>
                    <FontAwesome name="check" size={14} color="#0D1F12" />
                </View>
                  <Text style={styles.pointText}>{point}</Text>
                </View>
              ))}
              </View>
          </Animated.View>
        )}
        
        {/* Confetti container outside to cover full screen */}
        {!analyzing && (
          <View style={styles.confettiContainer} pointerEvents="none">
            {confettiPieces.map((piece, index) => {
              const color = confettiColors[index % confettiColors.length];
              const isSquare = index % 3 === 0; // Mix of squares and circles
              
              return (
                <Animated.View
                  key={index}
                  style={[
                    isSquare ? styles.confettiSquare : styles.confettiCircle,
                    {
                      backgroundColor: color,
                      left: `${piece.x}%`,
                      opacity: piece.opacity,
                      transform: [
                        { translateY: piece.translateY },
                        { translateX: piece.translateX },
                        {
                          rotate: piece.rotate.interpolate({
                            inputRange: [0, 720],
                            outputRange: ['0deg', '720deg'],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title={analyzing ? 'Continue' : 'See my report'}
          onPress={() => navigation.navigate('Onboarding17')}
          disabled={analyzing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ONBOARDING_COLORS.BACKGROUND,
  },
  wavyBackground: {
    position: 'absolute',
    top: 0,
    left: -50,
    right: -50,
    bottom: 0,
    opacity: 0.3,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    paddingTop: 40,
  },
  analyzeContainer: {
    flex: 1,
  },
  percentageText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -2,
    fontFamily: 'Inter-Bold',
  },
  setupText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
    fontFamily: 'Inter-SemiBold',
  },
  progressBarContainer: {
    marginBottom: 24,
    paddingHorizontal: 0,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  currentStepText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Inter-Regular',
  },
  recommendationCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginTop: 'auto',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  recommendationList: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendationText: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
  },
  checkmarkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeContainer: {
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    marginBottom: 30,
  },
  completionBadge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(76, 217, 100, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  completionBadgeInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CD964',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CD964',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  handHeartContainer: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: -80,
    position: 'relative',
  },
  circleBackground: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  handHeartIcon: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
  },
  logoImage: {
    width: 140,
    height: 140,
    tintColor: '#000000',
  },
  completeTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -1.2,
    fontFamily: 'Inter-Black',
    lineHeight: 44,
    marginBottom: 20,
    marginTop: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    includeFontPadding: false,
  },
  completeSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: -16,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  pointsList: {
    marginTop: 8,
    alignSelf: 'stretch',
    paddingHorizontal: 8,
  },
  completionCard: {
    width: '100%',
    backgroundColor: '#050505',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 20,
    paddingHorizontal: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  greenCheckmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7CFFAF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#7CFFAF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  pointText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  featuresList: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CD964',
    marginRight: 12,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#E5E7EB',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  confettiCircle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  confettiSquare: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 1,
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#0B0B0B',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#00FFC6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  buttonDisabled: {
    backgroundColor: '#1f1f1f',
    borderColor: '#0a0a0a',
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});

export default Onboarding15;
