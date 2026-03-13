import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Platform, ScrollView, PanResponder } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  runOnJS,
} from 'react-native-reanimated';
import Icon from '../UI/Icon';
import * as Haptics from 'expo-haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Define styles first
const modalStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: screenHeight * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D0D0D0',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  stepNumberContainer: {
    marginRight: 16,
  },
  stepNumberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 17,
    color: '#333333',
    lineHeight: 26,
    fontWeight: '500',
    paddingTop: 8,
  },
});

const AnimatedStepItem = ({ step, index }) => {
  return (
    <Animated.View
      style={modalStyles.stepItem}
      entering={FadeIn.delay(index * 80).duration(500).springify()}
    >
      <View style={modalStyles.stepNumberContainer}>
        <View style={modalStyles.stepNumberCircle}>
          <Text style={modalStyles.stepNumberText}>{index + 1}</Text>
        </View>
      </View>
      <Text style={modalStyles.stepText}>{step}</Text>
    </Animated.View>
  );
};

export default function ExerciseStepsModal({ visible, onClose, exercise }) {
  const translateY = useSharedValue(screenHeight);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const scrollViewRef = useRef(null);

  const animateClose = () => {
    translateY.value = withTiming(screenHeight, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(0, { duration: 250 });
    scale.value = withTiming(0.9, { duration: 250 });
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animateClose();
  };

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 200,
        mass: 0.8,
      });
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 300,
      });
    } else {
      translateY.value = screenHeight;
      opacity.value = 0;
      scale.value = 0.9;
    }
  }, [visible]);

  // PanResponder for swipe down gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to gestures that start in the header area or drag handle
        const { locationY } = evt.nativeEvent;
        // Check if scroll view is at top, or gesture is in header area
        const isInHeaderArea = locationY < 120;
        return isInHeaderArea;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to downward swipes
        const isDownwardSwipe = gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        return isDownwardSwipe;
      },
      onPanResponderGrant: (evt) => {
        // Store the current position when drag starts
        startY.current = 0; // Modal starts at translateY = 0 when visible
        isDragging.current = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isDragging.current) {
          const newY = Math.max(0, startY.current + gestureState.dy);
          translateY.value = newY;
          // Fade overlay as user drags down
          const dragProgress = Math.min(1, newY / screenHeight);
          opacity.value = 1 - dragProgress * 0.5;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        isDragging.current = false;
        const swipeThreshold = screenHeight * 0.2; // 20% of screen height
        
        if (gestureState.dy > swipeThreshold || gestureState.vy > 0.5) {
          // Swipe down enough or fast enough - close modal
          animateClose();
        } else {
          // Snap back to original position
          translateY.value = withSpring(0, {
            damping: 25,
            stiffness: 200,
          });
          opacity.value = withTiming(1, { duration: 200 });
        }
      },
    })
  ).current;

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (!exercise?.steps || exercise.steps.length === 0) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          modalStyles.overlay,
          overlayAnimatedStyle,
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      <Animated.View
        style={[
          modalStyles.modalContainer,
          modalAnimatedStyle,
        ]}
        {...panResponder.panHandlers}
      >
        {/* Drag Handle */}
        <View style={modalStyles.dragHandleContainer}>
          <View style={modalStyles.dragHandle} />
        </View>

        {/* Header */}
        <View style={modalStyles.modalHeader}>
          <View style={modalStyles.modalHeaderContent}>
            <View style={modalStyles.modalIconContainer}>
              <Icon name="list" size={28} color="#000000" />
            </View>
            <Text style={modalStyles.modalTitle}>How to do it</Text>
          </View>
          <TouchableOpacity
            style={modalStyles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Icon name="close" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Steps List */}
        <ScrollView 
          ref={scrollViewRef}
          style={modalStyles.modalContent}
          contentContainerStyle={modalStyles.modalContentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          bounces={true}
          onScrollBeginDrag={(e) => {
            // Prevent modal drag when scrolling content
            isDragging.current = false;
          }}
        >
          {exercise.steps.map((step, index) => (
            <AnimatedStepItem key={index} step={step} index={index} />
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
