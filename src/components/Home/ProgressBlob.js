import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  runOnJS
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressBlob = ({ onNavigateToProgress, userProgress }) => {
  // Animation values
  const animation = useSharedValue(0);
  const particleAnimation1 = useSharedValue(0);
  const particleAnimation2 = useSharedValue(0);
  const particleAnimation3 = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);
  const progressAnimation = useSharedValue(0);
  const glowAnimation = useSharedValue(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

    // Pulse animation for the main blob
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );

    // Progress animation
    const progressPercentage = getProgressPercentage();
    progressAnimation.value = withDelay(
      500,
      withTiming(progressPercentage, {
        duration: 2000,
        easing: Easing.out(Easing.ease)
      })
    );

    // Glow animation
    glowAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
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

  // Animated blob path with pulse and glow effects
  const animatedBlobProps = useAnimatedProps(() => {
    const progress = animation.value;
    const pulse = pulseAnimation.value;
    const glow = glowAnimation.value;

    // Base path for the blob (scaled up)
    const basePath = "M40,80 C40,60 60,40 80,40 C100,40 120,60 120,80 C120,100 100,120 80,120 C60,120 40,100 40,80 Z";

    // Morphed path based on animation progress (scaled up)
    const morphedPath = ` M${40 + Math.sin(progress * Math.PI * 2) * 8},${80 + Math.cos(progress * Math.PI * 2) * 4} C${40 + Math.sin(progress * Math.PI) * 4},${60 + Math.cos(progress * Math.PI) * 6} ${60 + Math.sin(progress * Math.PI * 1.5) * 6},${40 + Math.cos(progress * Math.PI * 1.5) * 4} ${80 + Math.sin(progress * Math.PI * 0.5) * 4},${40 + Math.cos(progress * Math.PI * 0.5) * 8} C${100 + Math.sin(progress * Math.PI * 2) * 6},${40 + Math.cos(progress * Math.PI * 2) * 4} ${120 + Math.sin(progress * Math.PI * 1.5) * 4},${60 + Math.cos(progress * Math.PI * 1.5) * 6} ${120 + Math.sin(progress * Math.PI) * 8},${80 + Math.cos(progress * Math.PI) * 4} C${120 + Math.sin(progress * Math.PI * 0.5) * 4},${100 + Math.cos(progress * Math.PI * 0.5) * 6} ${100 + Math.sin(progress * Math.PI * 2) * 6},${120 + Math.cos(progress * Math.PI * 2) * 4} ${80 + Math.sin(progress * Math.PI * 1.5) * 4},${120 + Math.cos(progress * Math.PI * 1.5) * 8} C${60 + Math.sin(progress * Math.PI * 0.5) * 6},${120 + Math.cos(progress * Math.PI * 0.5) * 4} ${40 + Math.sin(progress * Math.PI * 2) * 4},${100 + Math.cos(progress * Math.PI * 2) * 6} ${40 + Math.sin(progress * Math.PI * 1.5) * 8},${80 + Math.cos(progress * Math.PI * 1.5) * 4} Z `;

    // Calculate opacity with glow effect
    const baseOpacity = 0.8;
    const glowOpacity = baseOpacity + (glow * 0.3);
    const finalOpacity = Math.min(1, glowOpacity);

    return {
      d: progress < 0.01 ? basePath : morphedPath,
      opacity: finalOpacity
    };
  });

  // Animated particles (scaled up)
  const animatedParticle1Props = useAnimatedProps(() => {
    const cx = interpolate(particleAnimation1.value, [0, 1], [70, 90]);
    const cy = interpolate(particleAnimation1.value, [0, 1], [60, 100]);
    return { cx, cy };
  });

  const animatedParticle2Props = useAnimatedProps(() => {
    const cx = interpolate(particleAnimation2.value, [0, 1], [100, 60]);
    const cy = interpolate(particleAnimation2.value, [0, 1], [70, 90]);
    return { cx, cy };
  });

  const animatedParticle3Props = useAnimatedProps(() => {
    const cx = interpolate(particleAnimation3.value, [0, 1], [80, 110]);
    const cy = interpolate(particleAnimation3.value, [0, 1], [110, 70]);
    return { cx, cy };
  });

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!userProgress) return 0;
    const currentDay = userProgress.current_day || 1;
    const totalDays = 120;
    return Math.round((currentDay / totalDays) * 100);
  };

  // Trigger celebration animation when progress updates
  const triggerCelebration = () => {
    setIsAnimating(true);

    // Enhanced pulse animation
    pulseAnimation.value = withSequence(
      withTiming(1.5, { duration: 300, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) }),
      withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) })
    );

    // Enhanced glow animation
    glowAnimation.value = withSequence(
      withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) })
    );

    // Reset animation state after celebration
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  // Watch for progress changes to trigger celebration
  useEffect(() => {
    if (userProgress) {
      triggerCelebration();
    }
  }, [userProgress?.current_day]);

  const getCurrentPhase = () => {
    if (!userProgress) return 'Foundation';
    const currentDay = userProgress.current_day || 1;
    if (currentDay <= 30) return 'Foundation';
    if (currentDay <= 60) return 'Building';
    if (currentDay <= 90) return 'Optimization';
    return 'Maintenance';
  };


  return (
    <TouchableOpacity
      style={styles.progressSection}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onNavigateToProgress();
      }}
      activeOpacity={0.8}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PROGRESS</Text>
        <View style={styles.headerRight}>
          <Text style={styles.progressPercentageHeader}>
            {getProgressPercentage()}%
          </Text>
          <Text style={styles.chevronIcon}>›</Text>
        </View>
      </View>

      <View style={styles.blobContainer}>
        <View style={styles.progressCard}>
          <Svg height="140" width="100%" viewBox="0 0 160 160">
            <Defs>
              <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor="#000000" stopOpacity="1" />
                <Stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
              </RadialGradient>
            </Defs>
            {/* Main animated blob */}
            <AnimatedPath animatedProps={animatedBlobProps} fill="url(#grad)" />
            {/* Animated particles */}
            <AnimatedCircle animatedProps={animatedParticle1Props} r="3" fill="#FFFFFF" opacity={0.8} />
            <AnimatedCircle animatedProps={animatedParticle2Props} r="2" fill="#FFFFFF" opacity={0.6} />
            <AnimatedCircle animatedProps={animatedParticle3Props} r="2.5" fill="#FFFFFF" opacity={0.7} />
          </Svg>

          {/* Phase Text at Top */}
          <View style={styles.progressTextTop}>
            <Text style={styles.progressPhase}>
              {getCurrentPhase()}
            </Text>
          </View>

          {/* Day Text at Bottom */}
          <View style={styles.progressTextBottom}>
            <Text style={styles.progressDays}>
              Day {userProgress?.current_day || 1}/120
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  progressSection: {
    marginTop: 8,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressPercentageHeader: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  chevronIcon: {
    color: '#000000',
    fontSize: 16,
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
    alignSelf: 'stretch',
    position: 'relative'
  },
  progressTextTop: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10
  },
  progressTextBottom: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 1
  },
  progressPhase: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 1
  },
  progressDays: {
    fontSize: 13,
    color: '#999999',
    fontWeight: 'bold'
  }
});

export default ProgressBlob;
