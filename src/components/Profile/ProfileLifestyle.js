import React from 'react';
import { View, Text } from 'react-native';
import Icon from '../UI/Icon';

export default function ProfileLifestyle({ styles, userProfile }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>LIFESTYLE</Text>
      <View style={styles.lifestyleCard}>
        <View style={styles.lifestyleItem}>
          <View style={styles.lifestyleIconContainer}><Icon name="moon" size={20} color="#8B5CF6" /></View>
          <View style={styles.lifestyleContent}>
            <Text style={styles.lifestyleLabel}>Sleep Hours</Text>
            <Text style={styles.lifestyleValue}>{userProfile?.sleep_hours || 'Not set'} hours/night</Text>
          </View>
        </View>
        <View style={styles.lifestyleItem}>
          <View style={styles.lifestyleIconContainer}><Icon name="fitness" size={20} color="#EF4444" /></View>
          <View style={styles.lifestyleContent}>
            <Text style={styles.lifestyleLabel}>Workout Frequency</Text>
            <Text style={styles.lifestyleValue}>{userProfile?.workout_frequency || 'Not set'}</Text>
          </View>
        </View>
        <View style={styles.lifestyleItem}>
          <View style={styles.lifestyleIconContainer}><Icon name="footsteps" size={20} color="#06B6D4" /></View>
          <View style={styles.lifestyleContent}>
            <Text style={styles.lifestyleLabel}>Foot Size</Text>
            <Text style={styles.lifestyleValue}>{userProfile?.foot_size || 'Not set'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
