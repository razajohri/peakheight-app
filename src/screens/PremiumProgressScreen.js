import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Icon from '../components/UI/Icon';
import * as Haptics from 'expo-haptics';
import { useUser } from '../contexts/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PremiumProgressScreen = ({ navigation, onClose }) => {
  const { userProgress, getCurrentHeight, getTargetHeight } = useUser();
  const insets = useSafeAreaInsets();

  const currentDay = userProgress?.current_day || 1;
  const progressPercentage = Math.round((currentDay / 120) * 100);

  // Get height data
  const currentHeight = getCurrentHeight();
  const targetHeight = getTargetHeight();
  
  // Animation values
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    // Pulsing animation
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
    };
  });

  // Calculate optimization potential (difference between target and current)
  const getOptimizationPotential = () => {
    if (!currentHeight || !targetHeight) return '0';
    const diff = targetHeight.cm - currentHeight.cm;
    return diff > 0 ? diff.toFixed(1) : '0';
  };

  const getPhaseInfo = () => {
    if (currentDay <= 30) {
      return { name: 'Growth Hormone' };
    } else if (currentDay <= 60) {
      return { name: 'Building' };
    } else if (currentDay <= 90) {
      return { name: 'Optimization' };
    } else {
      return { name: 'Maintenance' };
    }
  };

  const phaseInfo = getPhaseInfo();

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onClose) onClose();
    else if (navigation?.goBack) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* White Background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }]} />

      {/* Fixed Nav bar at top */}
      <View style={styles.fixedNavBarContainer}>
        <View
          style={[styles.navBar, { paddingTop: Platform.OS === 'ios' ? Math.max(insets.top - 40, 4) : Math.max(StatusBar.currentHeight || 0, insets.top || 0) }]}
        >
          <View style={styles.leftContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleClose} 
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Icon name="close" size={18} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer} pointerEvents="none">
            <Text style={styles.navTitle}>PROGRESS</Text>
          </View>
          <View style={styles.rightContainer} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Platform.OS === 'ios' 
              ? (Math.max(insets.top - 40, 4) + 50) 
              : (Math.max(StatusBar.currentHeight || 0, insets.top || 0) + 50),
            paddingBottom: Math.max(insets?.bottom || 0, 24),
          },
        ]}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Height Cards Row */}
        <View style={styles.heightCardsRow}>
          {/* Current Height Card */}
          <View style={styles.heightCard}>
            <Text style={styles.heightCardLabel}>Current height</Text>
            <Text style={styles.heightCardValue}>
              {currentHeight ? `${currentHeight.cm} cm` : 'Not set'}
            </Text>
          </View>

          {/* Predicted Height Card (shows target height) */}
          <View style={styles.heightCardPredicted}>
            <Text style={styles.heightCardLabelPredicted}>Predicted height</Text>
            <Text style={styles.heightCardValuePredicted}>
              {targetHeight ? `${targetHeight.cm} cm` : 'Not set'}
            </Text>
          </View>
        </View>

        {/* Optimize Line */}
        <View style={styles.optimizeContainer}>
          <Text style={styles.optimizeText}>
            Optimize up to <Text style={styles.optimizeNumber}>{getOptimizationPotential()} cm</Text>
          </Text>
          <Icon name="trending-up" size={20} color="#22C55E" />
          <TouchableOpacity style={styles.infoButton}>
            <Icon name="information-circle-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Animated Circle */}
        <View style={styles.circleContainer}>
          {/* Pulsing Circle */}
          <Animated.View style={[styles.mainCircle, pulseStyle]}>
            <Text style={styles.circlePercentage}>{progressPercentage}%</Text>
            <Text style={styles.circleLabel}>Complete</Text>
          </Animated.View>
        </View>

        {/* Stats */}
        <View style={styles.infoContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Days completed</Text>
              <Text style={styles.statValue}>{currentDay}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Days remaining</Text>
              <Text style={styles.statValue}>{120 - currentDay}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCardWide}>
              <Text style={styles.statLabel}>Current phase</Text>
              <Text style={[styles.phaseName, phaseInfo.name === 'Optimization' && styles.phaseNameGreen]}>{phaseInfo.name}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  fixedNavBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#FFFFFF',
  },
  navBar: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  navTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  
  // Height Cards
  heightCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  heightCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
  },
  heightCardLabel: {
    color: '#6B7280',
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 8,
  },
  heightCardValue: {
    color: '#000000',
    fontSize: 30,
    fontWeight: '700',
  },
  heightCardPredicted: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 16,
  },
  heightCardLabelPredicted: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 8,
  },
  heightCardValuePredicted: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },

  // Optimize Line
  optimizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  optimizeText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  optimizeNumber: {
    color: '#22C55E',
    fontWeight: '700',
  },
  infoButton: {
    padding: 4,
  },

  // Animated Circle
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  mainCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  circlePercentage: {
    fontSize: 52,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  circleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },

  // Stats
  infoContainer: {
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  statCardWide: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
  },
  phaseName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    marginTop: 4,
  },
  phaseNameGreen: {
    color: '#22C55E',
  },
});

export default PremiumProgressScreen;
