import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const StreakFreezeModal = ({ visible, onClose, previousStreak, onRestore }) => {
  const handleRestore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRestore();
  };

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
          {/* Freeze Icon */}
          <View style={styles.freezeIconWrapper}>
            <View style={styles.freezeIconCircle}>
              <Text style={styles.freezeIconEmoji}>❄️</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Start Fresh?</Text>

          {/* Description */}
          <Text style={styles.description}>
            Your streak has been reset. Use your streak freeze to start again from Day 1 and rebuild your momentum.
          </Text>

          {/* Streak Preview */}
          <View style={styles.streakPreview}>
            <View style={styles.streakPreviewItem}>
              <Text style={styles.streakPreviewLabel}>Current</Text>
              <Text style={styles.streakPreviewValue}>0 days</Text>
            </View>
            <View style={styles.arrowContainer}>
              <LinearGradient
                colors={['#4FC3F7', '#29B6F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.arrowGradient}
              >
                <Icon name="arrow-forward" size={18} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <View style={styles.streakPreviewItem}>
              <Text style={styles.streakPreviewLabel}>After Freeze</Text>
              <View style={styles.dayOneContainer}>
                <Text style={styles.dayOneText}>Day 1</Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4FC3F7', '#29B6F6', '#0288D1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.restoreButtonGradient}
              >
                <Text style={styles.restoreButtonIcon}>❄️</Text>
                <Text style={styles.restoreButtonText}>Start from Day 1</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Info Text */}
          <Text style={styles.infoText}>
            This will reset your streak to Day 1. You'll start fresh and build your streak again.
          </Text>
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
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: 'rgba(79, 195, 247, 0.1)',
  },
  freezeIconWrapper: {
    marginBottom: 16,
  },
  freezeIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4FC3F7',
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
    paddingHorizontal: 4,
  },
  streakPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
    width: '100%',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(79, 195, 247, 0.1)',
  },
  streakPreviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakPreviewLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 8,
    fontWeight: '500',
  },
  streakPreviewValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#666666',
  },
  streakPreviewValueRestored: {
    color: '#4FC3F7',
  },
  arrowContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  arrowGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayOneContainer: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4FC3F7',
  },
  dayOneText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0288D1',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  restoreButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  restoreButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  restoreButtonIcon: {
    fontSize: 20,
    marginRight: 0,
  },
  freezeIconEmoji: {
    fontSize: 40,
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default StreakFreezeModal;
