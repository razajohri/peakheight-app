import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import Icon from '../UI/Icon';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileHeader({ styles, insets, isPremium, userProfile, onBack, onSettings, HapticFeedback }) {
  const userName = userProfile?.first_name 
    ? userProfile.last_name 
      ? `${userProfile.first_name} ${userProfile.last_name}` 
      : userProfile.first_name
    : userProfile?.display_name || 'Height Seeker';
  const userEmail = userProfile?.email || 'No email';

  return (
    <>
      {/* Simple Header */}
      <View style={[styles.simpleHeader, { paddingTop: Platform.OS === 'ios' ? Math.max(insets.top - 40, 4) : insets.top }]}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => { HapticFeedback?.light?.(); onBack && onBack(); }}
        >
          <Icon name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => { HapticFeedback?.light?.(); onSettings && onSettings(); }}
        >
      
        </TouchableOpacity>
      </View>

      {/* Centered Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          {userProfile?.avatar_url ? (
            <Image
              source={{ uri: userProfile.avatar_url }}
              style={styles.profileAvatar}
            />
          ) : (
            <View style={styles.profileAvatarPlaceholder}>
              <Icon name="person" size={50} color="#000000" />
            </View>
          )}
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Icon name="diamond" size={16} color="#FFD700" />
            </View>
          )}
        </View>
        <Text style={styles.profileName}>{userName}</Text>
        <Text style={styles.profileEmail}>{userEmail}</Text>
      </View>
    </>
  );
}
