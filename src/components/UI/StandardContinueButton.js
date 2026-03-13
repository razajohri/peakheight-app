import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const StandardContinueButton = ({ 
  onPress, 
  text = 'Continue', 
  disabled = false,
  style = {},
  textStyle = {}
}) => {
  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Fallback if haptics fails
    }
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F3F4F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.buttonGradient}
      >
        <Text style={[styles.buttonText, textStyle]}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: '#000000',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});

export default StandardContinueButton;
