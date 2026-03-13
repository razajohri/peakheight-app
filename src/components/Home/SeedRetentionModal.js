import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';
import { SeedRetentionService } from '../../services/seedRetentionService';
import { useUser } from '../../contexts/UserContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const SeedRetentionModal = ({ visible, onClose }) => {
  const { userProfile } = useUser();
  const [seedRetentionStreak, setSeedRetentionStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const fetchSeedRetentionStatus = async () => {
      if (userProfile?.id) {
        const status = await SeedRetentionService.getSeedRetentionStatus(userProfile.id);
        setSeedRetentionStreak(status.currentStreak);
        setLongestStreak(status.longestStreak);
      }
    };
    if (visible) {
      fetchSeedRetentionStatus();
    }
  }, [userProfile?.id, visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={80}
            style={StyleSheet.absoluteFill}
            tint="dark"
          >
            <TouchableOpacity
              style={styles.backdrop}
              activeOpacity={1}
              onPress={onClose}
            />
          </BlurView>
        ) : (
          <TouchableOpacity
            style={styles.backdropAndroid}
            activeOpacity={1}
            onPress={onClose}
          />
        )}
        <View style={styles.modalContainer}>
          {/* Icon Header */}
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <Icon name="water" size={32} color="#FFFFFF" />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>Seed Retention Streak</Text>

          {/* Description */}
          <Text style={styles.description}>
            Maintaining seed retention supports testosterone levels and growth hormone production, which are crucial for height growth.
          </Text>

          {/* Streak Display */}
          <View style={styles.streakDisplay}>
            <View style={styles.streakItem}>
              <Text style={styles.streakLabel}>Current Streak</Text>
              <Text style={styles.streakValue}>{seedRetentionStreak}</Text>
              <Text style={styles.streakUnit}>days</Text>
            </View>
            {longestStreak > 0 && (
              <View style={styles.streakDivider} />
            )}
            {longestStreak > 0 && (
              <View style={styles.streakItem}>
                <Text style={styles.streakLabel}>Best Streak</Text>
                <Text style={[styles.streakValue, styles.streakValueBest]}>{longestStreak}</Text>
                <Text style={styles.streakUnit}>days</Text>
              </View>
            )}
          </View>

          {/* Info Section */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="information-circle" size={20} color="#8B5CF6" />
              <Text style={styles.infoText}>
                Complete the "No Fap" task daily to maintain your streak
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="flame" size={20} color="#8B5CF6" />
              <Text style={styles.infoText}>
                Seed retention boosts testosterone and growth hormone
              </Text>
            </View>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  backdropAndroid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  iconWrapper: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  streakDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 20,
  },
  streakLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 8,
    fontWeight: '500',
  },
  streakValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  streakValueBest: {
    color: '#7C3AED',
  },
  streakUnit: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
  },
  closeButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
});

export default SeedRetentionModal;
