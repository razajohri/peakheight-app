import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';

export default function ProfileProgress({ styles, userProfile, formatHeight, calculateHeightProgress }) {
  return (
    <View style={styles.progressCard}>
      <LinearGradient colors={['#F8F9FA', '#FFFFFF']} style={styles.progressGradient}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Height Progress</Text>
          <Text style={styles.progressSubtitle}>Towards your goal</Text>
        </View>

        <View style={styles.heightDisplay}>
          <View style={styles.heightItem}>
            <Text style={styles.heightLabel}>Current</Text>
            <Text style={styles.heightValue}>{formatHeight(userProfile?.current_height)}</Text>
          </View>
          <View style={styles.heightArrow}>
            <Icon name="arrow-forward" size={20} color="#000000" />
          </View>
          <View style={styles.heightItem}>
            <Text style={styles.heightLabel}>Target</Text>
            <Text style={styles.heightValue}>{formatHeight(userProfile?.target_height)}</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#3B5FE3', '#1E3A8A']}
              style={[styles.progressFill, { width: `${calculateHeightProgress()}%` }]}
            />
          </View>
          <Text style={styles.progressPercentage}>{Math.round(calculateHeightProgress())}%</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
