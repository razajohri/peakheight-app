// Onboarding7.js (Page 7 - Hope)
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import HapticFeedback from '../../utils/hapticFeedback';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import { Ionicons } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS,
  ONBOARDING_BORDER_RADIUS 
} from '../../utils/onboardingConstants';

const INHERITED_VIDEO = require('../../../assets/inherited.mp4');
const AnimatedVideo = Animated.createAnimatedComponent(Video);

const Onboarding7 = ({ navigation }) => {
  const fullText = "The right daily routine can unlock hidden growth potential.";
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 10); // Adjust speed here (lower = faster)

      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText]);

  // Blinking cursor animation
  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    blinkAnimation.start();
    return () => blinkAnimation.stop();
  }, [cursorOpacity]);

  return (
    <SafeAreaView style={styles.container}>
      <ProgressHeader 
        currentStep={8} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleLine} numberOfLines={1}>Height isn't just inherited,</Text>
          <View style={styles.highlightedBackground}>
            <Text style={styles.titleLineHighlight}>it's earned.</Text>
          </View>
        </View>

        <View style={styles.imageContainer} collapsable={false}>
          <View style={styles.imageFrame}>
            <AnimatedVideo
              ref={videoRef}
              source={INHERITED_VIDEO}
              style={styles.image}
              resizeMode="contain"
              shouldPlay={true}
              isLooping={true}
              isMuted={true}
              useNativeControls={false}
              ignoreSilentSwitch="ignore"
              progressUpdateIntervalMillis={1000}
              onLoad={() => {
                // Ensure video plays immediately when loaded
                videoRef.current?.playAsync().catch(() => {});
              }}
            />
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <View style={styles.accentLine} />
          <View style={styles.descriptionRow}>
            {displayedText.includes('hidden growth potential') ? (
              <Text style={styles.description}>
                {displayedText.substring(0, displayedText.indexOf('hidden growth potential'))}
                <Text style={styles.highlightedText}>hidden growth potential</Text>
                {displayedText.substring(displayedText.indexOf('hidden growth potential') + 'hidden growth potential'.length)}
                {currentIndex < fullText.length && (
                  <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>|</Animated.Text>
                )}
              </Text>
            ) : (
              <Text style={styles.description}>
                {displayedText}
                {currentIndex < fullText.length && (
                  <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>|</Animated.Text>
                )}
              </Text>
            )}
          </View>
        </View>

      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => navigation.navigate('Onboarding7A')}
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  titleBlock: {
    marginBottom: 20,
  },
  titleLine: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  highlightedBackground: {
    backgroundColor: 'rgba(156, 163, 175, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.2)',
  },
  titleLineHighlight: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: -13,
    marginBottom: 26,
    backgroundColor: 'transparent',
  },
  imageFrame: {
    width: 480,
    height: 390,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGlow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  illustration: {
    width: 300,
    height: 220,
  },
  descriptionContainer: {
    position: 'relative',
    paddingLeft: 16,
    marginTop: -4,
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    top: 4,
    bottom: 4,
    width: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    opacity: 0.8,
  },
  image: {
    width: 490,
    height: 403,
    borderRadius: 26,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: '#D1D5DB',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  highlightedText: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: '#D1D5DB',
    lineHeight: 26,
    letterSpacing: 0.2,
    backgroundColor: 'rgba(156, 163, 175, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.2)',
    overflow: 'hidden',
  },
  cursor: {
    color: '#D1D5DB',
    opacity: 1,
  },
  descriptionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding7;
