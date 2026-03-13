// Onboarding11.js (Page 11 - Losing Height Potential Every Night?)
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS 
} from '../../utils/onboardingConstants';

const SLEEP_IMAGE = require('../../../assets/sleep potential.webp');
const SLEEPING_PAGE_IMAGE = require('../../../assets/sleeping page.webp');

const Onboarding11 = ({ navigation, data, updateData }) => {
  // Animation values
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.92)).current;

  // Animate on mount
  useEffect(() => {
    // Start title and image animations in parallel with minimal delay
    Animated.parallel([
      // Title animation
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Image animation (slight delay)
      Animated.parallel([
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 350,
          delay: 50,
          useNativeDriver: true,
        }),
        Animated.spring(imageScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          delay: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={13} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.titleSection,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <Text style={styles.title} numberOfLines={3} adjustsFontSizeToFit={true}>
            Losing Height Potential Every Night?
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.imageSection,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        >
          <View style={styles.imagesRow}>
            <View style={styles.imageContainer}>
              <Image
                source={SLEEP_IMAGE}
                style={styles.image}
                contentFit="contain"
                transition={200}
              />
            </View>
            <View style={styles.rightImageContainer}>
              <Image
                source={SLEEPING_PAGE_IMAGE}
                style={styles.rightImage}
                contentFit="contain"
                transition={200}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.infoSection,
            {
              opacity: imageOpacity,
            },
          ]}
        >
          <Text style={styles.infoText}>
            Sleeping 8+ hours a day boosts growth hormone production by up to 75%, directly impacting height potential and testosterone level.
          </Text>
        </Animated.View>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => navigation.navigate('Onboarding12')}
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
    paddingTop: ONBOARDING_SPACING.XS,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleSection: {
    width: '100%',
    marginTop: ONBOARDING_SPACING.XS,
    marginBottom: ONBOARDING_SPACING.LG,
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 28,
    textAlign: 'center',
  },
  imageSection: {
    width: '100%',
    height: 380,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    paddingLeft: ONBOARDING_SPACING.SM,
  },
  imagesRow: {
    flexDirection: 'row',
    width: '100%',
    height: 380,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: ONBOARDING_SPACING.MD,
  },
  imageContainer: {
    width: '100%',
    maxWidth: 220,
    height: 380,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  rightImageContainer: {
    flex: 1,
    height: 300,
  },
  rightImage: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    width: '100%',
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    marginTop: ONBOARDING_SPACING.LG,
    alignItems: 'center',
    marginBottom: ONBOARDING_SPACING.LG,
  },
  infoText: {
    ...ONBOARDING_TYPOGRAPHY.BODY,
    fontSize: 14,
    textAlign: 'center',
    color: ONBOARDING_COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    paddingBottom: 40,
    paddingTop: ONBOARDING_SPACING.LG,
  },
});

export default Onboarding11;

