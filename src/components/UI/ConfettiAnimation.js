import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const ConfettiPiece = ({ delay, color, size, startX, duration = 3000 }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(height + 100, { duration });
      translateX.value = withTiming(
        startX + (Math.random() - 0.5) * 200,
        { duration }
      );
      rotate.value = withTiming(360 * 3, { duration });
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [delay, duration, startX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.confettiPiece, animatedStyle]}>
      <View
        style={[
          styles.confettiShape,
          {
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 4,
          },
        ]}
      />
    </Animated.View>
  );
};

export default function ConfettiAnimation({ visible, onComplete }) {
  const containerOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      containerOpacity.value = withTiming(1, { duration: 300 });
      
      // Hide confetti after animation completes
      const timer = setTimeout(() => {
        containerOpacity.value = withTiming(0, { duration: 500 }, () => {
          runOnJS(onComplete)();
        });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  if (!visible) return null;

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
  const confettiPieces = [];

  // Generate confetti pieces
  for (let i = 0; i < 50; i++) {
    confettiPieces.push(
      <ConfettiPiece
        key={i}
        delay={i * 50}
        color={colors[i % colors.length]}
        size={Math.random() * 8 + 4}
        startX={Math.random() * width}
        duration={Math.random() * 2000 + 2000}
      />
    );
  }

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
      {confettiPieces}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  confettiPiece: {
    position: 'absolute',
  },
  confettiShape: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});