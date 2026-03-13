// Onboarding17.js (Page 17 - Account Creation / Locked Home Preview)
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, PanResponder, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import Icon from '../../components/UI/Icon';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS,
  ONBOARDING_BORDER_RADIUS 
} from '../../utils/onboardingConstants';

const StatCard = ({ label, value, caption }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statCaption}>{caption}</Text>
  </View>
);

const LockCircleWithAnimation = ({ onLockPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onLockPress) onLockPress();
    
    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <Animated.View style={[styles.lockCircle, { transform: [{ scale: scaleAnim }] }]}>
        <Icon name="lock-closed" size={34} color="#FFFFFF" />
      </Animated.View>
    </TouchableOpacity>
  );
};

const FactorRow = ({ label, onLockPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleLockPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onLockPress) onLockPress();
    
    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.factorRow}>
      <View style={styles.factorLeft}>
        <View style={styles.factorDot} />
        <Text style={styles.factorText}>{label}</Text>
      </View>
      <TouchableOpacity onPress={handleLockPress} activeOpacity={1}>
        <Animated.View style={[styles.lockBadge, { transform: [{ scale: scaleAnim }] }]}>
          <Icon name="lock-closed" size={16} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const BottomNavMock = ({ onLockPress }) => {
  const scaleAnims = React.useRef({}).current;

  const getScaleAnim = (key) => {
    if (!scaleAnims[key]) {
      scaleAnims[key] = new Animated.Value(1);
    }
    return scaleAnims[key];
  };

  const handleLockPress = (key) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onLockPress) onLockPress();
    const scaleAnim = getScaleAnim(key);
    
    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.bottomNav}>
      {[
        { icon: 'home', label: 'Me', locked: false },
        { icon: 'apps', label: 'Hub', locked: true },
        { icon: 'today', label: 'Today', locked: true },
        { icon: 'people', label: 'Tribe', locked: true },
      ].map(item => (
        <View key={item.label} style={styles.navItem}>
          <TouchableOpacity 
            onPress={item.locked ? () => handleLockPress(item.label) : undefined}
            activeOpacity={1}
            disabled={!item.locked}
          >
            <Animated.View style={[
              styles.navIconContainer,
              item.locked && { transform: [{ scale: getScaleAnim(item.label) }] }
            ]}>
              <Icon name={item.icon} size={18} color="#000000" />
              {item.locked && (
                <View style={styles.navLock}>
                  <Icon name="lock-closed" size={10} color="#FFFFFF" />
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.navLabel}>{item.label}</Text>
        </View>
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
      onStartShouldSetPanResponder: () => !hasCompleted.current,
      onMoveShouldSetPanResponder: () => {
        // Always capture movement from the start
        return !hasCompleted.current;
      },
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
        
        if (swipeProgress >= 0.85) {
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
              tension: 100,
              friction: 8,
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
    outputRange: [0.001, 1], // Use 0.001 instead of 0 to avoid rendering issues
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[styles.buttonContainer, { transform: [{ translateY: buttonTranslateY }] }]}
    >
      <View 
        style={styles.swipeButtonTrack} 
        onLayout={onTrackLayout}
        collapsable={false}
        {...panResponder.panHandlers}
      >
        {/* Progress fill */}
        {trackLayout.width > 0 && (
          <Animated.View 
            style={[
              styles.swipeProgressFill,
              { 
                transform: [{ scaleX: progressScaleX }]
              }
            ]}
            pointerEvents="none"
          />
        )}
        
        {/* Text */}
        <Animated.View 
          style={[
            styles.swipeButtonTextContainer,
            { opacity: textOpacity }
          ]}
          pointerEvents="none"
        >
          <Text style={styles.buttonText}>Start my journey now!</Text>
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
            colors={['#FFFFFF', '#F5F5F5']}
            style={styles.thumbGradient}
          >
            <Icon name="arrow-forward" size={22} color="#000000" />
          </LinearGradient>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const Onboarding17 = ({ navigation, data, updateData, onAuthRequired }) => {
  const [showLockedMessage, setShowLockedMessage] = React.useState(false);
  const messageOpacity = React.useRef(new Animated.Value(0)).current;
  const messageScale = React.useRef(new Animated.Value(0.8)).current;
  const messageTranslateX = React.useRef(new Animated.Value(0)).current;
  const buttonTranslateY = React.useRef(new Animated.Value(0)).current;

  const handleLockPress = () => {
    setShowLockedMessage(true);
    
    // Reset animation values
    messageOpacity.setValue(0);
    messageScale.setValue(0.8);
    messageTranslateX.setValue(0);
    
    // Fade in and scale up message with buzz
    Animated.parallel([
      Animated.timing(messageOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(messageScale, {
        toValue: 1,
        tension: 150,
        friction: 6,
        useNativeDriver: true,
      }),
      // Buzzing shake animation
      Animated.sequence([
        Animated.timing(messageTranslateX, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(messageTranslateX, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(messageTranslateX, {
          toValue: -3,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(messageTranslateX, {
          toValue: 3,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(messageTranslateX, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Move button up to draw attention
    Animated.sequence([
      Animated.timing(buttonTranslateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(buttonTranslateY, {
        toValue: 0,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 2 seconds
    setTimeout(() => {
      Animated.timing(messageOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowLockedMessage(false);
      });
    }, 2000);
  };

  const handleCreateAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to auth with signup mode (new users should see signup first)
    navigation.navigate('Auth');
  };

  // Helper function to format height from cm to feet and inches
  const formatHeight = (heightInCm) => {
    if (!heightInCm || heightInCm === 0) return "—";

    const totalInches = heightInCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);

    return `${feet}'${inches}"`;
  };

  const currentHeight = formatHeight(data?.currentHeight);
  const targetHeight = formatHeight(data?.targetHeight);

  // Debug logging to see what data we're receiving
  console.log('Onboarding17 - Received data:', data);
  console.log('Onboarding17 - Current height (cm):', data?.currentHeight);
  console.log('Onboarding17 - Target height (cm):', data?.targetHeight);
  console.log('Onboarding17 - Formatted current height:', currentHeight);
  console.log('Onboarding17 - Formatted target height:', targetHeight);

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <View style={styles.headerArea}>
        <Text style={styles.screenTitle} numberOfLines={1} adjustsFontSizeToFit>
          🔓 Unlock your Custom Report
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.mainContent}>
          {/* Progress Card with Lock */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Growth complete</Text>
              <View style={styles.issueBadge}>
                <Text style={styles.issueBadgeText}>2 issues found</Text>
              </View>
            </View>
            <LockCircleWithAnimation onLockPress={handleLockPress} />
            <Text style={styles.progressFooter}>Day 1/120</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard label="CURRENT HEIGHT" value={currentHeight} caption="Since last month" />
            <StatCard label="TARGET HEIGHT" value={targetHeight} caption="Your goal" />
          </View>

          {/* Main Growth Factors */}
          <View style={styles.factorsCard}>
            <Text style={styles.factorsTitle}>MAIN GROWTH FACTORS</Text>
            {['Sleep Quality', 'Exercise', 'Nutrition', 'Stretching Routine'].map(name => (
              <FactorRow key={name} label={name} onLockPress={handleLockPress} />)
            )}
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        {/* Bottom Nav Mock - Before the button */}
        <View style={styles.bottomNavContainer}>
          <BottomNavMock onLockPress={handleLockPress} />
        </View>

        {/* Swipe Button at the very bottom */}
        <SwipeButton 
          onSwipeComplete={handleCreateAccount}
          buttonTranslateY={buttonTranslateY}
        />
      </View>

      {/* Locked Message Popup */}
      {showLockedMessage && (
        <Animated.View style={[
          styles.lockedMessageContainer, 
          { 
            opacity: messageOpacity,
            transform: [
              { scale: messageScale },
              { translateX: messageTranslateX }
            ]
          }
        ]}>
          <View style={styles.lockedMessage}>
            <Icon name="lock-closed" size={20} color="#FFFFFF" />
            <Text style={styles.lockedMessageText}>Locked</Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerArea: {
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    paddingTop: ONBOARDING_SPACING.LG,
    marginBottom: 10,
  },
  titleContainer: {
    alignItems: 'center',
  },
  screenTitle: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 26,
    color: '#1E293B',
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: ONBOARDING_SPACING.MD,
    paddingTop: 5,
  },
  mainContent: {
    flex: 1,
  },
  bottomSection: {
    paddingBottom: 0,
  },
  bottomNavContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: '#F8FAFC',
  },
  progressCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  issueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#8B0000',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  issueBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockCircle: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    backgroundColor: '#8B0000',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.4)',
  },
  progressFooter: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statCaption: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  factorsCard: {
    borderRadius: 20,
    padding: 10,
    paddingBottom: 20,
    marginBottom: 0,
    backgroundColor: '#F8FAFC',
  },
  factorsTitle: {
    color: '#1E293B',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: 'Inter-Bold',
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  lastFactorRow: {
    marginBottom: 24,
  },
  factorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
    marginRight: 12,
  },
  factorText: {
    color: '#1E293B',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
  },
  lockBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B0000',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
  },
  navIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  navLock: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8B0000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  navLabel: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.MD,
    paddingTop: ONBOARDING_SPACING.SM,
    paddingBottom: ONBOARDING_SPACING.LG,
  },
  swipeButtonTrack: {
    borderRadius: 28,
    backgroundColor: '#0A0A0A',
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  swipeProgressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 28,
  },
  swipeButtonThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 6,
    zIndex: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  thumbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeButtonTextContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 1,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  lockedMessageContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    pointerEvents: 'none',
  },
  lockedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lockedMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Onboarding17;

