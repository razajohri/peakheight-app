import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileSubscription({ styles, isPremium, onCancel, HapticFeedback }) {
  if (!isPremium) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
      <View style={styles.subscriptionCard}>
        <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.subscriptionGradient}>
          <View style={styles.subscriptionHeader}>
            <Icon name="diamond" size={24} color="#FFFFFF" />
            <Text style={styles.subscriptionTitle}>Premium Active</Text>
          </View>
          <Text style={styles.subscriptionSubtitle}>Enjoying all premium features</Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => { HapticFeedback?.light?.(); onCancel && onCancel(); }}
          >
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}
