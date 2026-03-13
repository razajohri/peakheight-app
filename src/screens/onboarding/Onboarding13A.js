// Onboarding13A.js (Goal Reminder - Current vs Target Height)
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import HapticFeedback from '../../utils/hapticFeedback';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS 
} from '../../utils/onboardingConstants';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Onboarding13A = ({ navigation }) => {
  // Animation values
  const graphAnim = useRef(new Animated.Value(0)).current;
  const lineDrawAnim = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Animate title
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate graph after title - smooth like Onboarding13 5 points
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(graphAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false, // Path opacity needs false
        }),
        Animated.timing(lineDrawAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
      ]).start();
    }, 300);
  }, []);

  const lineStrokeLength = 420;
  const dashOffset = lineDrawAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [lineStrokeLength, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={16} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
        </Animated.View>

        <View style={styles.graphContainer}>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>
                How tall will you actually grow?
              </Text>
            </View>
            <View style={styles.svgContainer}>
              <Svg width="100%" height="200" viewBox="-10 0 320 200" preserveAspectRatio="xMidYMid meet">
              <Defs>
                <SvgLinearGradient id="badHabitsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#FF2D55" />
                  <Stop offset="100%" stopColor="#FF8A00" />
                </SvgLinearGradient>
                <SvgLinearGradient id="goodHabitsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#00FFC6" />
                  <Stop offset="100%" stopColor="#00A0FF" />
                </SvgLinearGradient>
              </Defs>
              {/* Y-axis labels */}
              <SvgText x="-35" y="30" fill="#9CA3AF" fontSize="12" fontFamily="Inter-Regular">6'2"</SvgText>
              <SvgText x="-35" y="60" fill="#9CA3AF" fontSize="12" fontFamily="Inter-Regular">6'0"</SvgText>
              <SvgText x="-35" y="95" fill="#9CA3AF" fontSize="12" fontFamily="Inter-Regular">5'10"</SvgText>
              <SvgText x="-35" y="130" fill="#9CA3AF" fontSize="12" fontFamily="Inter-Regular">5'8"</SvgText>
              <SvgText x="-35" y="165" fill="#9CA3AF" fontSize="12" fontFamily="Inter-Regular">5'6"</SvgText>
              
              {/* Axes */}
              <Path d="M0 170 L300 170" stroke="#1f1f1f" strokeWidth="2" />
              <Path d="M0 25 L0 170" stroke="#1f1f1f" strokeWidth="2" />
              <Path d="M0 115 L300 115" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="6 6" />
              <Path d="M0 75 L300 75" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="6 6" />

              {/* Bad habits glow */}
              <AnimatedPath
                d="M0 160 Q100 125 180 122 T300 132"
                stroke="url(#badHabitsGradient)"
                strokeWidth="8"
                strokeOpacity={0.25}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={lineStrokeLength}
                strokeDashoffset={dashOffset}
                opacity={graphAnim}
              />

              {/* Bad habits line */}
              <AnimatedPath
                d="M0 160 Q100 125 180 122 T300 132"
                stroke="url(#badHabitsGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={lineStrokeLength}
                strokeDashoffset={dashOffset}
                opacity={graphAnim}
              />

              {/* PeakHeight glow */}
              <AnimatedPath
                d="M0 160 Q100 80 180 45 T300 30"
                stroke="url(#goodHabitsGradient)"
                strokeWidth="9"
                strokeOpacity={0.3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={lineStrokeLength}
                strokeDashoffset={dashOffset}
                opacity={graphAnim}
              />

              {/* PeakHeight fill area */}
              <AnimatedPath
                d="M0 160 Q100 80 180 45 T300 30 L300 132 Q180 122 100 125 L0 160 Z"
                fill="url(#goodHabitsGradient)"
                opacity={graphAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.18],
                })}
                blurRadius={10}
              />

              {/* PeakHeight habits line */}
              <AnimatedPath
                d="M0 160 Q100 80 180 45 T300 30"
                stroke="url(#goodHabitsGradient)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={lineStrokeLength}
                strokeDashoffset={dashOffset}
                opacity={graphAnim}
              />

              {/* Height gain indicator */}
              <AnimatedPath
                d="M280 30 L280 132"
                stroke="#00FFC6"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity={graphAnim}
              />
              <AnimatedPath
                d="M275 30 L285 30 M275 132 L285 132"
                stroke="#00FFC6"
                strokeWidth="2"
                opacity={graphAnim}
              />
              <SvgText x="290" y="85" fill="#00FFC6" fontSize="14" fontFamily="Inter-Bold" opacity={graphAnim}>
                +4"
              </SvgText>
              <SvgText x="290" y="100" fill="#9CA3AF" fontSize="11" fontFamily="Inter-Regular" opacity={graphAnim}>
                potential gain
              </SvgText>

              {/* Dots */}
              <AnimatedPath
                d="M0 160 a4 4 0 1 0 0.1 0"
                stroke="#00FFC6"
                strokeWidth="8"
                strokeLinecap="round"
                opacity={graphAnim}
              />
              <AnimatedPath
                d="M300 30 a4 4 0 1 0 0.1 0"
                stroke="#00FFC6"
                strokeWidth="10"
                strokeLinecap="round"
                opacity={graphAnim}
              />
              <AnimatedPath
                d="M0 160 a4 4 0 1 0 0.1 0"
                stroke="#FF2D55"
                strokeWidth="8"
                strokeLinecap="round"
                opacity={graphAnim}
              />
              <AnimatedPath
                d="M300 132 a4 4 0 1 0 0.1 0"
                stroke="#FF2D55"
                strokeWidth="8"
                strokeLinecap="round"
                opacity={graphAnim}
              />
              </Svg>
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF2D55' }]} />
                <Text style={styles.legendLabel}>Without optimization</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#00FFC6' }]} />
                <Text style={styles.legendLabel}>With AI prediction</Text>
              </View>
            </View>
          </View>
        </View>

        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: graphAnim,
            },
          ]}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>87%</Text>
              <Text style={styles.statLabel}>Accuracy Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.4"</Text>
              <Text style={styles.statLabel}>Avg Growth</Text>
            </View>
          </View>
          <Text style={styles.statsText}>
            Our AI predicts your maximum height potential based on genetics and lifestyle patterns.
          </Text>
        </Animated.View>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => navigation.navigate('Onboarding14')}
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
    paddingTop: 8,
  },
  titleContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    textAlign: 'center',
  },
  subtitle: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    textAlign: 'center',
    marginTop: 8,
  },
  graphContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chartCard: {
    width: '100%',
    backgroundColor: '#050505',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#00FFC6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'visible',
  },
  svgContainer: {
    width: '100%',
    overflow: 'visible',
    paddingHorizontal: 10,
  },
  chartHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#FFFFFF',
    letterSpacing: -0.8,
    textAlign: 'center',
    lineHeight: 42,
    textShadowColor: 'rgba(0, 255, 198, 0.85)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  chartSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#FFFFFF',
  },
  statsContainer: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#00FFC6',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  statsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding13A;

