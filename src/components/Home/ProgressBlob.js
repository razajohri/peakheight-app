import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, Easing, interpolate } from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressBlob = ({ onNavigateToProgress }) => {
  // Animation values
  const animation = useSharedValue(0);
  const particleAnimation1 = useSharedValue(0);
  const particleAnimation2 = useSharedValue(0);
  const particleAnimation3 = useSharedValue(0);

  useEffect(() => {
    // Main blob animation
    animation.value = 0;
    animation.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Particle animations with different timings for natural movement
    particleAnimation1.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    particleAnimation2.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    particleAnimation3.value = withRepeat(
      withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Animated blob path
  const animatedBlobProps = useAnimatedProps(() => {
    const progress = animation.value;
    // Base path for the blob
    const basePath = "M60,100 C60,80 80,60 100,60 C120,60 140,80 140,100 C140,120 120,140 100,140 C80,140 60,120 60,100 Z";

    // Morphed path based on animation progress
    const morphedPath = ` M${60 + Math.sin(progress * Math.PI * 2) * 10},${100 + Math.cos(progress * Math.PI * 2) * 5} C${60 + Math.sin(progress * Math.PI) * 5},${80 + Math.cos(progress * Math.PI) * 8} ${80 + Math.sin(progress * Math.PI * 1.5) * 8},${60 + Math.cos(progress * Math.PI * 1.5) * 5} ${100 + Math.sin(progress * Math.PI * 0.5) * 5},${60 + Math.cos(progress * Math.PI * 0.5) * 10} C${120 + Math.sin(progress * Math.PI * 2) * 8},${60 + Math.cos(progress * Math.PI * 2) * 5} ${140 + Math.sin(progress * Math.PI * 1.5) * 5},${80 + Math.cos(progress * Math.PI * 1.5) * 8} ${140 + Math.sin(progress * Math.PI) * 10},${100 + Math.cos(progress * Math.PI) * 5} C${140 + Math.sin(progress * Math.PI * 0.5) * 5},${120 + Math.cos(progress * Math.PI * 0.5) * 8} ${120 + Math.sin(progress * Math.PI * 2) * 8},${140 + Math.cos(progress * Math.PI * 2) * 5} ${100 + Math.sin(progress * Math.PI * 1.5) * 5},${140 + Math.cos(progress * Math.PI * 1.5) * 10} C${80 + Math.sin(progress * Math.PI * 0.5) * 8},${140 + Math.cos(progress * Math.PI * 0.5) * 5} ${60 + Math.sin(progress * Math.PI * 2) * 5},${120 + Math.cos(progress * Math.PI * 2) * 8} ${60 + Math.sin(progress * Math.PI * 1.5) * 10},${100 + Math.cos(progress * Math.PI * 1.5) * 5} Z `;

    return { d: progress < 0.01 ? basePath : morphedPath };
  });

  // Animated particles
  const animatedParticle1Props = useAnimatedProps(() => {
    const cx = interpolate(particleAnimation1.value, [0, 1], [90, 110]);
    const cy = interpolate(particleAnimation1.value, [0, 1], [80, 120]);
    return { cx, cy };
  });

  const animatedParticle2Props = useAnimatedProps(() => {
    const cx = interpolate(particleAnimation2.value, [0, 1], [120, 80]);
    const cy = interpolate(particleAnimation2.value, [0, 1], [90, 110]);
    return { cx, cy };
  });

  const animatedParticle3Props = useAnimatedProps(() => {
    const cx = interpolate(particleAnimation3.value, [0, 1], [100, 130]);
    const cy = interpolate(particleAnimation3.value, [0, 1], [130, 90]);
    return { cx, cy };
  });

  return (
    <TouchableOpacity
      style={styles.progressSection}
      onPress={onNavigateToProgress}
      activeOpacity={0.8}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PROGRESS</Text>
        <Text style={styles.chevronIcon}>›</Text>
      </View>

      <View style={styles.blobContainer}>
        <View style={styles.progressCard}>
          <Svg height="140" width="140" viewBox="0 0 200 200">
            <Defs>
              <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor="#000000" stopOpacity="1" />
                <Stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
              </RadialGradient>
            </Defs>
            {/* Main animated blob */}
            <AnimatedPath animatedProps={animatedBlobProps} fill="url(#grad)" opacity={0.8} />
            {/* Animated particles */}
            <AnimatedCircle animatedProps={animatedParticle1Props} r="3" fill="#FFFFFF" opacity={0.8} />
            <AnimatedCircle animatedProps={animatedParticle2Props} r="2" fill="#FFFFFF" opacity={0.6} />
            <AnimatedCircle animatedProps={animatedParticle3Props} r="2.5" fill="#FFFFFF" opacity={0.7} />
            {/* Percentage text */}
            <G>
              <Text x="100" y="105" textAnchor="middle" fill="#FFFFFF" fontWeight="bold" fontSize="22">
                72%
              </Text>
            </G>
          </Svg>
          <Text style={styles.progressTitle}>PROGRESS</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  progressSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  chevronIcon: {
    color: '#AAAAAA',
    fontSize: 20,
    fontWeight: 'bold',
  },
  blobContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTitle: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    letterSpacing: 0.5,
  },
});

export default ProgressBlob;
