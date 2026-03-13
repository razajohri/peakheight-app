// Onboarding13.js (Page 13 - Pain)
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import HapticFeedback from '../../utils/hapticFeedback';
import { Ionicons } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS 
} from '../../utils/onboardingConstants';

const Onboarding13 = ({ navigation }) => {
  // Only fact item animations (no page entrance animations)

  // Animation values for each fact item
  const factAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Glow animation for red icons
  const glowAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Animate each fact item with a staggered delay
    const animateFacts = () => {
      factAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          delay: index * 200, // 200ms delay between each item
          useNativeDriver: true,
        }).start();
      });
    };

    // Start fact animations immediately on mount
    animateFacts();

    // Pulsing red glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false, // shadowRadius doesn't support native driver
        }),
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );
    glowAnimation.start();

    return () => glowAnimation.stop();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={15} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>The reality of being short</Text>
        </View>

        <Animated.View 
          style={[
            styles.factItem,
            {
              opacity: factAnimations[0],
              transform: [
                {
                  translateX: factAnimations[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-300, 0], // From left
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View 
            style={[
              styles.factIcon,
              {
                shadowOpacity: glowAnim,
                shadowRadius: glowAnim.interpolate({
                  inputRange: [0.7, 1],
                  outputRange: [12, 18],
                }),
              },
            ]}
          >
            <Text style={styles.factIconText}>!</Text>
          </Animated.View>
          <Text style={styles.factText}>90% Women prefer tall man.</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.factItem,
            {
              opacity: factAnimations[1],
              transform: [
                {
                  translateX: factAnimations[1].interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0], // From right
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View 
            style={[
              styles.factIcon,
              {
                shadowOpacity: glowAnim,
                shadowRadius: glowAnim.interpolate({
                  inputRange: [0.7, 1],
                  outputRange: [12, 18],
                }),
              },
            ]}
          >
            <Text style={styles.factIconText}>!</Text>
          </Animated.View>
          <Text style={styles.factText}>Overlooked for leadership roles.</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.factItem,
            {
              opacity: factAnimations[2],
              transform: [
                {
                  translateX: factAnimations[2].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-300, 0], // From left
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View 
            style={[
              styles.factIcon,
              {
                shadowOpacity: glowAnim,
                shadowRadius: glowAnim.interpolate({
                  inputRange: [0.7, 1],
                  outputRange: [12, 18],
                }),
              },
            ]}
          >
            <Text style={styles.factIconText}>!</Text>
          </Animated.View>
          <Text style={styles.factText}>Rejected before conversation starts.</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.factItem,
            {
              opacity: factAnimations[3],
              transform: [
                {
                  translateX: factAnimations[3].interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0], // From right
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View 
            style={[
              styles.factIcon,
              {
                shadowOpacity: glowAnim,
                shadowRadius: glowAnim.interpolate({
                  inputRange: [0.7, 1],
                  outputRange: [12, 18],
                }),
              },
            ]}
          >
            <Text style={styles.factIconText}>!</Text>
          </Animated.View>
          <Text style={styles.factText}>Mocked by friends casually.</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.factItem,
            {
              opacity: factAnimations[4],
              transform: [
                {
                  translateX: factAnimations[4].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-300, 0], // From left
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View 
            style={[
              styles.factIcon,
              {
                shadowOpacity: glowAnim,
                shadowRadius: glowAnim.interpolate({
                  inputRange: [0.7, 1],
                  outputRange: [12, 18],
                }),
              },
            ]}
          >
            <Text style={styles.factIconText}>!</Text>
          </Animated.View>
          <Text style={styles.factText}>Paid less for same work.</Text>
        </Animated.View>

        <View style={styles.founderMessage}>
          <Text style={styles.founderText}>
            "We built this app because we faced the same issues growing up."
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => navigation.navigate('Onboarding13A')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 4,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#1f1f1f',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  factIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8B0015',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#FF003C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  factIconText: {
    fontWeight: '800',
    fontSize: 14,
    color: '#FFFFFF',
  },
  factText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#E5E7EB',
    lineHeight: 22,
    flex: 1,
  },
  founderMessage: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  founderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  founderSignature: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  founderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  founderName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#9CA3AF',
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding13;
