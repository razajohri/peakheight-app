import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import Icon from '../UI/Icon';
import { AuthService } from '../../services/auth';

const AppleSignInButton = ({ onSuccess, onError, style, textStyle }) => {
  const handleAppleSignIn = async () => {
    try {
      const { data, error } = await AuthService.signInWithApple();

      if (error) {
        onError?.(error);
      } else {
        onSuccess?.(data.user, data.session);
      }
    } catch (error) {
      onError?.(error.message || 'Apple Sign-In failed');
    }
  };

  // Don't show on Android
  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handleAppleSignIn}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Icon name="logo-apple" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={[styles.text, textStyle]}>Continue with Apple</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AppleSignInButton;

