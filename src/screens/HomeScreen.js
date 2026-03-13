import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, Animated, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/UI/Icon';
import * as Haptics from 'expo-haptics';
import { SoundService } from '../services/soundService';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import ProgressMeterCard from '../components/Home/ProgressMeterCard';
import HeightMetrics from '../components/Home/HeightMetrics';
import GrowthFactors from '../components/Home/GrowthFactors';
import StreakModal from '../components/Home/StreakModal';
import StreakFreezeModal from '../components/Home/StreakFreezeModal';
import AICoachWidget from '../components/Home/AICoachWidget';

// Services
import { StreakFreezeService } from '../services/streakFreezeService';

// Context
import { useUser } from '../contexts/UserContext';
import { DailyPlanService } from '../services/dailyPlanService';
import NotificationService from '../services/notificationService';
import { supabase } from '../config/supabase';

const HomeScreen = ({ onNavigateToProgress, onNavigateToProfile }) => {
  const screenHeight = Dimensions.get('window').height;
  const [isStreakModalVisible, setStreakModalVisible] = useState(false);
  const [isFreezeModalVisible, setFreezeModalVisible] = useState(false);
  const [freezeStatus, setFreezeStatus] = useState({ available: false, previousStreak: 0, currentStreak: 0 });
  const permissionRequestedRef = useRef(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  // Get user data from context
  const { userProfile, loading, getCurrentHeight, getTargetHeight, userProgress, fetchUserProfile } = useUser();
  const [streak, setStreak] = useState(userProgress?.current_streak || 0);

  // Request notification permission and ensure token is stored
  useEffect(() => {
    const ensureNotificationSetup = async () => {
      if (!userProfile?.id) return;

      try {
        // Check if user has push token stored in database
        const { data: userData } = await supabase
          .from('users')
          .select('push_notification_token')
          .eq('id', userProfile.id)
          .single();

        const hasTokenInDB = userData?.push_notification_token;

        // Check current permission status
        const { status } = await Notifications.getPermissionsAsync();
        
        if (status !== 'granted') {
          // Permission not granted - request it
          const hasRequested = await AsyncStorage.getItem('notification_permission_requested');
          
          if (!hasRequested && !permissionRequestedRef.current) {
            // Request permission
            const { status: newStatus } = await Notifications.requestPermissionsAsync({
              ios: {
                allowAlert: true,
                allowBadge: true,
                allowSound: true,
              },
            });
            
            // Mark as requested
            await AsyncStorage.setItem('notification_permission_requested', 'true');
            permissionRequestedRef.current = true;
            
            if (newStatus === 'granted') {
              // Initialize notification service to get and store token
              await NotificationService.initialize();
            }
          }
        } else {
          // Permission already granted
          // Mark as requested if not already
          const hasRequested = await AsyncStorage.getItem('notification_permission_requested');
          if (!hasRequested) {
            await AsyncStorage.setItem('notification_permission_requested', 'true');
            permissionRequestedRef.current = true;
          }

          // If permission is granted but token is not in database, get and store it
          if (!hasTokenInDB) {
            console.log('Permission granted but token not in DB, refreshing token...');
            try {
              const token = await NotificationService.refreshPushToken();
              if (token) {
                console.log('✅ Push token refreshed and stored');
              } else {
                console.warn('⚠️ Could not get push token (may need FCM setup for Android)');
                // Try full initialization as fallback
                await NotificationService.initialize();
              }
            } catch (tokenError) {
              console.warn('Failed to refresh push token:', tokenError);
              // Try full initialization as fallback
              await NotificationService.initialize();
            }
          } else {
            // Token exists, just ensure notification service is initialized
            if (!NotificationService.initialized) {
              await NotificationService.initialize();
            }
          }
        }
      } catch (error) {
        console.error('Error ensuring notification setup:', error);
      }
    };

    if (userProfile && !loading) {
      ensureNotificationSetup();
    }
  }, [userProfile, loading]);

  // Keep streak synced with DB and context
  useEffect(() => {
    if (typeof userProgress?.current_streak === 'number') {
      setStreak(userProgress.current_streak);
    }
  }, [userProgress?.current_streak]);

  // Check freeze status
  useEffect(() => {
    const checkFreezeStatus = async () => {
      if (userProfile?.id) {
        const status = await StreakFreezeService.getFreezeStatus(userProfile.id);
        setFreezeStatus(status);
      }
    };
    checkFreezeStatus();
  }, [userProfile?.id, userProgress?.current_streak, userProgress?.streak_freeze_available]);

  // Animate freeze icon pulse
  useEffect(() => {
    if (freezeStatus.available && freezeStatus.currentStreak === 0 && freezeStatus.previousStreak > 0) {
      // Pulse animation when freeze is available
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [freezeStatus.available, freezeStatus.currentStreak, freezeStatus.previousStreak]);

  // Animate streak icon glow (dark to light)
  useEffect(() => {
    const shouldGlow = streak > 0 && !(freezeStatus.available && freezeStatus.currentStreak === 0 && freezeStatus.previousStreak > 0);
    
    if (shouldGlow) {
      // Glow animation for streak icon - more pronounced
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1.0,
            duration: 1200,
            useNativeDriver: false, // shadowOpacity doesn't support native driver
          }),
          Animated.timing(glowAnim, {
            toValue: 0.4,
            duration: 1200,
            useNativeDriver: false,
          }),
        ])
      );
      glowAnimation.start();
      
      return () => {
        glowAnimation.stop();
      };
    } else {
      glowAnim.setValue(0.3);
    }
  }, [streak, freezeStatus.available, freezeStatus.currentStreak, freezeStatus.previousStreak]);

  // Handle freeze icon press
  const handleFreezePress = () => {
    if (freezeStatus.available && freezeStatus.currentStreak === 0 && freezeStatus.previousStreak > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setFreezeModalVisible(true);
    }
  };


  useEffect(() => {
    const refresh = async () => {
      try {
        if (!userProfile?.id) return;
        // First sync the current day to ensure database is up to date
        await DailyPlanService.syncCurrentDay(userProfile.id);
        // Then refresh the entire user profile to get updated progress data
        await fetchUserProfile(userProfile.id);
      } catch {}
    };
    refresh();
  }, [userProfile?.id]);

  // Check if freeze is active
  const isFreezeActive = freezeStatus.available && freezeStatus.currentStreak === 0 && freezeStatus.previousStreak > 0;

  return (
    <View style={[styles.container, isFreezeActive && styles.containerFrozen]}>
      <StatusBar barStyle="dark-content" backgroundColor={isFreezeActive ? "#E3F2FD" : "#FFFFFF"} />

      {/* Frozen Overlay Effect */}
      {isFreezeActive && (
        <View style={styles.frozenOverlay} pointerEvents="none">
          <LinearGradient
            colors={['rgba(79, 195, 247, 0.2)', 'rgba(33, 150, 243, 0.15)', 'rgba(13, 71, 161, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}

      <View style={[styles.scrollContent, isFreezeActive && styles.scrollContentFrozen]}>
      {/* Header Section */}
      <View style={styles.greetingSection}>
          <View style={styles.greetingLeft}>
            <View style={styles.brandIcon}>
              <Icon name="body-outline" size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.brandText} numberOfLines={1}>
              Peak Height
            </Text>
          </View>
          <View style={styles.greetingRight}>
              {/* Streak Icon - Moved from center to replace settings */}
              <View style={styles.streakContainerWrapper}>
                {/* Show Fire Icon when freeze is NOT available */}
                {!(freezeStatus.available && freezeStatus.currentStreak === 0 && freezeStatus.previousStreak > 0) ? (
                  <TouchableOpacity
                    style={styles.streakContainer}
                    onPress={async () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await SoundService.playStreakSound();
                      setStreakModalVisible(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Animated.View
                      style={[
                        styles.streakGradient,
                        {
                          shadowOpacity: glowAnim,
                          shadowRadius: glowAnim.interpolate({
                            inputRange: [0.4, 1.0],
                            outputRange: [6, 16],
                          }),
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={['#FF9500', '#FF6B00']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.streakGradientInner}
                      >
                        <Icon name="flame" size={18} color="#FFFFFF" />
                      </LinearGradient>
                    </Animated.View>
                    <Text style={styles.streakText}>{streak}</Text>
                  </TouchableOpacity>
                ) : (
                  /* Show Freeze Icon when freeze is available (replaces fire icon) */
                  <TouchableOpacity
                    style={styles.freezeContainer}
                    onPress={handleFreezePress}
                    activeOpacity={0.7}
                  >
                    <Animated.View style={[styles.freezeGradient, { transform: [{ scale: pulseAnim }] }]}>
                      <Text style={styles.freezeIconEmoji}>❄️</Text>
                    </Animated.View>
                    <Text style={styles.freezeText}>Freeze</Text>
                  </TouchableOpacity>
                )}
              </View>
          </View>
        </View>

        {/* Progress Meter Card */}
        <ProgressMeterCard onNavigateToProgress={onNavigateToProgress} userProgress={userProgress} />

        {/* AI Coach Widget - Android: show at top */}
        {Platform.OS === 'android' && <AICoachWidget />}

        {/* Height Metrics */}
        <HeightMetrics />

        {/* Growth Factors */}
        <GrowthFactors />


        {/* AI Coach Widget - iOS: show at bottom */}
        {Platform.OS === 'ios' && <AICoachWidget />}

        {/* Bottom padding - slightly reduced to bring content up */}
        <View style={{ height: screenHeight > 800 ? 90 : screenHeight > 650 ? 60 : 30 }} />
      </View>

      {/* Streak Modal */}
      <StreakModal
        visible={isStreakModalVisible}
        onClose={() => setStreakModalVisible(false)}
        userProgress={userProgress}
        freezeStatus={freezeStatus}
        onUseFreeze={() => {
          setStreakModalVisible(false);
          setFreezeModalVisible(true);
        }}
      />

      {/* Streak Freeze Modal */}
      <StreakFreezeModal
        visible={isFreezeModalVisible}
        onClose={() => setFreezeModalVisible(false)}
        previousStreak={freezeStatus.previousStreak}
        onRestore={async () => {
          if (userProfile?.id) {
            const result = await StreakFreezeService.useStreakFreeze(userProfile.id);
            if (result.success) {
              // Refresh user progress
              await fetchUserProfile(userProfile.id);
              setFreezeModalVisible(false);
              // Show success notification
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              // Show success alert
              Alert.alert(
                '❄️ Streak Restored!',
                `Your streak of ${result.restoredStreak} days has been restored! Keep up the amazing work! 🔥`
              );
            } else {
              Alert.alert('Error', result.error || 'Failed to restore streak. Please try again.');
            }
          }
        }}
      />

          </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerFrozen: {
    backgroundColor: '#F5FAFF',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: '100%',
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    // Move greeting section higher on iOS
    marginTop: Platform.OS === 'ios' ? -8 : 0,
    paddingTop: Platform.OS === 'ios' ? 2 : 5,
    paddingBottom: 6,
  },
  greetingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: '#000000',
    fontSize: 28,
    fontWeight: '700',
  },
  greetingRight: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.2)',
    marginRight: 0,
    marginLeft: 0,
  },
  streakGradient: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  streakGradientInner: {
    width: '100%',
    height: '100%',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
  },
  streakContainerWrapper: {
    position: 'relative',
    marginRight: 0,
    marginLeft: 2,
    marginTop: 6,
  },
  freezeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 195, 247, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(79, 195, 247, 0.3)',
    marginRight: 0,
    marginLeft: 0,
  },
  freezeGradient: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    backgroundColor: 'rgba(79, 195, 247, 0.2)',
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  freezeText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '700',
  },
  freezeIconEmoji: {
    fontSize: 14,
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  scrollContentFrozen: {
    opacity: 0.98,
  },
});

export default HomeScreen;
