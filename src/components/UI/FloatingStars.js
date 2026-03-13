import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FloatingStars = ({ starCount = 15, clipToBounds = false }) => {
  const stars = useRef([]).current;

  // Initialize stars if not already done
  if (stars.length === 0) {
    for (let i = 0; i < starCount; i++) {
      stars.push({
        id: i,
        x: Math.random() * screenWidth,
        y: Math.random() * screenHeight,
        opacity: new Animated.Value(Math.random() * 0.8 + 0.2),
        size: Math.random() * 8 + 4, // 4-12px stars
        moveDistance: Math.random() * 30 + 20, // 20-50px movement
        duration: Math.random() * 3000 + 4000, // 4-7 seconds
      });
    }
  }

  useEffect(() => {
    const animations = stars.map((star) => {
      // Twinkling animation (opacity only - native driver compatible)
      const twinkleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3 + 0.1,
            duration: Math.random() * 2000 + 1500,
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.8 + 0.4,
            duration: Math.random() * 2000 + 1500,
            useNativeDriver: true,
            isInteraction: false,
          }),
        ]),
        { iterations: -1, resetBeforeIteration: false }
      );

      return { twinkleAnimation };
    });

    // Start all animations
    animations.forEach(({ twinkleAnimation }) => {
      twinkleAnimation.start();
    });

    // Cleanup
    return () => {
      animations.forEach(({ twinkleAnimation }) => {
        twinkleAnimation.stop();
      });
    };
  }, []);

  const StarShape = ({ size, opacity }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Polygon
        points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
        fill="white"
        opacity={opacity}
      />
    </Svg>
  );

  const containerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: clipToBounds ? 'hidden' : 'visible',
    borderRadius: clipToBounds ? 28 : 0,
  };

  return (
    <View
      style={containerStyle}
      pointerEvents="none"
      collapsable={false}
      removeClippedSubviews={clipToBounds}
    >
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={{
            position: 'absolute',
            left: star.x,
            top: star.y,
            opacity: star.opacity,
          }}
          pointerEvents="none"
          collapsable={false}
          removeClippedSubviews={false}
        >
          <StarShape size={star.size} opacity={1} />
        </Animated.View>
      ))}
    </View>
  );
};

export default FloatingStars;
