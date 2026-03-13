import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';

export default function ProfileStats({ styles, getDaysOnJourney, userProgress }) {
  const daysRemaining = userProgress ? Math.max(0, 120 - userProgress.current_day) : 119;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <LinearGradient colors={['#3B5FE3', '#1E3A8A']} style={styles.statGradient}>
            <Icon name="trending-up" size={24} color="#FFFFFF" />
            <Text style={styles.statNumber}>{getDaysOnJourney()}</Text>
            <Text style={styles.statLabel}>Days on Journey</Text>
          </LinearGradient>
        </View>

        <View style={styles.statCard}>
          <LinearGradient colors={['#10B981', '#047857']} style={styles.statGradient}>
            <Icon name="barbell" size={24} color="#FFFFFF" />
            <Text style={styles.statNumber}>{userProgress?.current_day || 1}</Text>
            <Text style={styles.statLabel}>Days Completed</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.statGradient}>
            <Icon name="time" size={24} color="#FFFFFF" />
            <Text style={styles.statNumber}>{daysRemaining}</Text>
            <Text style={styles.statLabel}>Days Remaining</Text>
          </LinearGradient>
        </View>

        <View style={styles.statCard}>
          <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.statGradient}>
            <Icon name="flame" size={24} color="#FFFFFF" />
            <Text style={styles.statNumber}>{userProgress?.current_streak || 0}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}
