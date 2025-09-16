import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileHeader({ styles, insets, isPremium, userProfile, onBack, onSettings, HapticFeedback }) {
  return (
    <LinearGradient
      colors={['#000000', '#333333']}
      style={[styles.gradientHeader, { paddingTop: insets.top + 20 }]}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => { HapticFeedback?.light?.(); onBack && onBack(); }}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PROFILE</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.profileHero}>
        <View style={styles.avatarContainer}>
          <LinearGradient colors={['#FFFFFF', '#F0F0F0']} style={styles.avatarGradient}>
            <Icon name="person" size={40} color="#000000" />
          </LinearGradient>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Icon name="diamond" size={16} color="#FFD700" />
            </View>
          )}
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.userName}>
            {userProfile?.first_name && userProfile?.last_name ? `${userProfile.first_name} ${userProfile.last_name}` : 'Height Seeker'}
          </Text>
          <Text style={styles.userEmail}>{userProfile?.email || 'No email'}</Text>
          <View style={styles.membershipBadge}>
            <LinearGradient colors={isPremium ? ['#FFD700', '#FFA500'] : ['#666666', '#888888']} style={styles.badgeGradient}>
              <Icon name={isPremium ? 'diamond' : 'person-outline'} size={14} color="#FFFFFF" />
              <Text style={styles.badgeText}>{isPremium ? 'PREMIUM MEMBER' : ' MEMBER'}</Text>
            </LinearGradient>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
