import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width } = Dimensions.get('window');

const ProgressMeterCard = ({ onNavigateToProgress, userProgress }) => {
  const currentDay = userProgress?.current_day || 1;
  const progressPercentage = Math.round((currentDay / 120) * 100);

  // Animated gauge (semi-circular meter)
  const gaugeProgress = useSharedValue(0);

  useEffect(() => {
    gaugeProgress.value = withTiming(progressPercentage, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [progressPercentage]);

  const needleAnimatedStyle = useAnimatedStyle(() => {
    // Map 0–100% to -120deg to +120deg, but keep a small visual offset
    // so the needle is not glued to the extreme left at very low progress.
    const visualProgress = Math.max(gaugeProgress.value, 8); // min ~8%
    const angle = -120 + (visualProgress / 100) * 240;
    return {
      transform: [{ rotate: `${angle}deg` }],
    };
  });

  // Calculate arc path length (approximate: π * radius for half circle)
  // Actual arc length for 180° arc: π * 90 ≈ 282.74
  const arcLength = 282.74;
  
  const animatedPathProps = useAnimatedProps(() => {
    'worklet';
    const progress = Math.max(gaugeProgress.value, 0);
    const progressDecimal = progress / 100;
    
    // Use stroke-dasharray to show progress
    // dasharray: [drawn length, gap length]
    // We want to draw 'progress' percentage of the arc
    const drawnLength = arcLength * progressDecimal;
    const gapLength = arcLength;
    
    return {
      strokeDasharray: `${drawnLength} ${gapLength}`,
      strokeDashoffset: 0,
    };
  });

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
            {progressPercentage}%
          </Text>
          <Text style={styles.chevronIcon}>›</Text>
        </View>
      </View>

      <View style={styles.meterCardContainer}>
        <LinearGradient
          colors={['#F8FAFC', '#E2E8F0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.meterContainer}
        >
          {/* Gauge - centered in the card */}
          <View style={styles.gaugeWrapper}>
            <Svg width={Math.min(width - 80, 200)} height={120} viewBox="0 0 220 120">
              {/* Base arc */}
              <Path
                d="M20 110 A 90 90 0 0 1 200 110"
                stroke="#E5E7EB"
                strokeWidth={14}
                strokeLinecap="round"
                fill="none"
              />
              {/* Progress arc - fills as days pass */}
              <AnimatedPath
                d="M20 110 A 90 90 0 0 1 200 110"
                animatedProps={animatedPathProps}
                stroke="#000000"
                strokeWidth={14}
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
            {/* Needle */}
            <View style={styles.gaugeNeedleCenter}>
              <Animated.View style={[styles.gaugeNeedle, needleAnimatedStyle]}>
                <View style={styles.gaugeNeedleBar} />
              </Animated.View>
              <View style={styles.gaugeNeedleDot} />
            </View>
          </View>

          {/* Header text at top */}
          <View style={styles.meterHeader}>
            <Text style={styles.progressPhase}>Overall progress</Text>
          </View>

          {/* Footer text at bottom */}
          <View style={styles.meterFooter}>
            <Text style={styles.progressDays}>Day {currentDay}/120</Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  progressSection: {
    marginTop: 0,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: Platform.OS === 'android' ? 6 : 0,
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
  meterCardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  meterContainer: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    alignSelf: 'stretch',
    position: 'relative',
    overflow: 'hidden',
    height: 185,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeWrapper: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 0,
    marginBottom: 8,
  },
  gaugeNeedleCenter: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeNeedle: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
  },
  gaugeNeedleBar: {
    width: 2,
    height: 42,
    backgroundColor: '#000000',
    borderRadius: 999,
  },
  gaugeNeedleDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
  },
  meterHeader: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  progressPhase: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  meterFooter: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  progressDays: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
  },
});

export default ProgressMeterCard;
