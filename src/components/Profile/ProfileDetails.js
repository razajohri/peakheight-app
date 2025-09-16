import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileDetails({ styles, userProfile, formatDate, formatWeight }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}><Icon name="calendar" size={20} color="#3B5FE3" /></View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{formatDate(userProfile?.date_of_birth)}</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}><Icon name="person" size={20} color="#10B981" /></View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{userProfile?.gender || 'Not set'}</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}><Icon name="scale" size={20} color="#F59E0B" /></View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Current Weight</Text>
            <Text style={styles.infoValue}>{formatWeight(userProfile?.current_weight)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
