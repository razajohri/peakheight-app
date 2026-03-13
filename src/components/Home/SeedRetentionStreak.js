import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, DeviceEventEmitter } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';
import { SeedRetentionService } from '../../services/seedRetentionService';
import { useUser } from '../../contexts/UserContext';
import * as Haptics from 'expo-haptics';

const SeedRetentionStreak = () => {
  const { userProfile } = useUser();
  const [seedRetentionStreak, setSeedRetentionStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  const fetchSeedRetentionStatus = async () => {
    if (userProfile?.id) {
      const status = await SeedRetentionService.getSeedRetentionStatus(userProfile.id);
      setSeedRetentionStreak(status.currentStreak);
      setLongestStreak(status.longestStreak);
    }
  };

  useEffect(() => {
    fetchSeedRetentionStatus();
    
    // Listen for task completion events to update seed retention streak in real-time
    const sub = DeviceEventEmitter.addListener('dailyTasksUpdated', fetchSeedRetentionStatus);
    return () => {
      if (sub && sub.remove) sub.remove();
    };
  }, [userProfile?.id]);

  // Animate glow effect when streak is active
  useEffect(() => {
    if (seedRetentionStreak > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.8,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0.3);
    }
  }, [seedRetentionStreak]);

  // Only show for male users
  if (userProfile?.gender !== 'male') {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              shadowOpacity: glowAnim,
              shadowRadius: glowAnim.interpolate({
                inputRange: [0.3, 0.8],
                outputRange: [4, 12],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <Icon name="droplet-outline" size={16} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={styles.streakNumber}>{seedRetentionStreak}</Text>
          <Text style={styles.streakLabel}>Seed Retention</Text>
        </View>
        {longestStreak > seedRetentionStreak && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Best: {longestStreak}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#8B5CF6',
    marginBottom: 2,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  badge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8B5CF6',
  },
});

export default SeedRetentionStreak;
