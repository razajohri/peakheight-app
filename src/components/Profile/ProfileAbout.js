import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileAbout({ styles }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ABOUT</Text>
      <View style={styles.aboutCard}>
        <View className="version" style={styles.versionItem}>
          <View style={styles.versionIconContainer}><Icon name="information-circle" size={20} color="#3B5FE3" /></View>
          <View style={styles.versionContent}>
            <Text style={styles.versionLabel}>App Version</Text>
            <Text style={styles.versionValue}>1.0.0</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.aboutItem}>
          <View style={styles.aboutIconContainer}><Icon name="document-text" size={20} color="#666666" /></View>
          <Text style={styles.aboutLabel}>Terms of Service</Text>
          <Icon name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.aboutItem}>
          <View style={styles.aboutIconContainer}><Icon name="shield-checkmark" size={20} color="#666666" /></View>
          <Text style={styles.aboutLabel}>Privacy Policy</Text>
          <Icon name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
