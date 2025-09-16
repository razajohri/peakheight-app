import * as Haptics from 'expo-haptics';

class HapticFeedback {
  // Light haptic feedback for subtle interactions
  static light() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Medium haptic feedback for standard button presses
  static medium() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Heavy haptic feedback for important actions
  static heavy() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Success feedback for completed actions
  static success() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Warning feedback for alerts
  static warning() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Error feedback for errors
  static error() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Selection feedback for pickers, toggles
  static selection() {
    try {
      Haptics.selectionAsync();
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }
}

export default HapticFeedback;
