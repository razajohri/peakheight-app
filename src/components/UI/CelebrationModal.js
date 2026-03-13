import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import Icon from '../UI/Icon';
import ConfettiAnimation from './ConfettiAnimation';

const { width, height } = Dimensions.get('window');

const CelebrationModal = ({
  visible,
  onClose,
  title = "🎉 Great Job!",
  message = "You're one step closer to your goal!",
  showConfetti = true,
  autoClose = true,
  autoCloseDelay = 3000
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const confettiVisible = useSharedValue(false);

  useEffect(() => {
    if (visible) {
      // Show modal with faster spring animation
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 300,
      });
      opacity.value = withTiming(1, { duration: 150 });

      // Show confetti immediately (no delay)
      if (showConfetti) {
        confettiVisible.value = withTiming(1, { duration: 100 });
      }

      // Auto close if enabled
      if (autoClose) {
        setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
      }
    } else {
      scale.value = withTiming(0, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
      confettiVisible.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const handleClose = () => {
    scale.value = withTiming(0, { duration: 150 });
    opacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(onClose)();
    });
  };

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Confetti Animation */}
      {showConfetti && (
        <ConfettiAnimation
          visible={confettiVisible.value === 1}
          onComplete={() => {}}
        />
      )}

      {/* Overlay */}
      <Animated.View style={[styles.overlay, overlayStyle]} />

      {/* Modal Content */}
      <Animated.View style={[styles.modal, modalStyle]}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Icon name="checkmark-circle" size={60} color="#000000" />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Awesome!</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 40,
    maxWidth: width - 80,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CelebrationModal;

