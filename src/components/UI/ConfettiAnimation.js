import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const ConfettiPiece = ({ delay, color, size, startX, startY }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const animate = () => {
      translateY.value = withDelay(
        delay,
        withTiming(height + 100, {
          duration: 3000,
          easing: Easing.out(Easing.quad),
        })
      );

      translateX.value = withDelay(
        delay,
        withTiming(startX + (Math.random() - 0.5) * 200, {
          duration: 3000,
          easing: Easing.out(Easing.quad),
        })
      );

      rotate.value = withDelay(
        delay,
        withTiming(360 * 3, {
          duration: 3000,
          easing: Easing.linear,
        })
      );

      opacity.value = withDelay(
        delay + 2500,
        withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.quad),
        })
      );
    };

    animate();
  }, [delay, startX, startY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          backgroundColor: color,
          width: size,
          height: size,
          left: startX,
          top: startY,
        },
        animatedStyle,
      ]}
    />
  );
};

const ConfettiAnimation = ({ visible, onComplete, colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'] }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });

      // Hide after animation completes
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500 }, () => {
          runOnJS(onComplete)();
        });
      }, 3500);
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const confettiPieces = [];
  const pieceCount = 50;

  for (let i = 0; i < pieceCount; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 4; // 4-12px
    const startX = Math.random() * width;
    const startY = -50;
    const delay = Math.random() * 1000; // Stagger the animation

    confettiPieces.push(
      <ConfettiPiece
        key={i}
        delay={delay}
        color={color}
        size={size}
        startX={startX}
        startY={startY}
      />
    );
  }

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
      {confettiPieces}
    </Animated.View>
  );
};

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
    borderRadius: 2,
  },
});

export default ConfettiAnimation;
