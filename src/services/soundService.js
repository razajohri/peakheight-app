import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export class SoundService {
  static soundObject = null;

  // Initialize the sound service
  static async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error initializing sound service:', error);
    }
  }

  // Play congratulatory sound for streak
  static async playStreakSound() {
    try {
      // Create a simple congratulatory sound using system sounds
      // For now, we'll use a success sound pattern
      await this.playSuccessSound();
    } catch (error) {
      console.error('Error playing streak sound:', error);
    }
  }

  // Play completion sound for daily tasks
  static async playCompletionSound() {
    try {
      // Play a more elaborate completion sound
      await this.playSuccessSound();
      // Add a slight delay and play again for emphasis
      setTimeout(async () => {
        await this.playSuccessSound();
      }, 300);
    } catch (error) {
      console.error('Error playing completion sound:', error);
    }
  }

  // Play notification sound
  static async playNotificationSound() {
    try {
      // Play a notification sound
      await this.playSuccessSound();
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }

  // Play a success sound (using system sound)
  static async playSuccessSound() {
    try {
      // Use haptic feedback as a sound alternative for now
      // In a real app, you would load actual sound files
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error playing success sound:', error);
    }
  }

  // Play a custom sound from a file (for future use)
  static async playCustomSound(soundFile) {
    try {
      if (this.soundObject) {
        await this.soundObject.unloadAsync();
      }

      this.soundObject = new Audio.Sound();
      await this.soundObject.loadAsync(soundFile);
      await this.soundObject.playAsync();
    } catch (error) {
      console.error('Error playing custom sound:', error);
    }
  }

  // Clean up sound resources
  static async cleanup() {
    try {
      if (this.soundObject) {
        await this.soundObject.unloadAsync();
        this.soundObject = null;
      }
    } catch (error) {
      console.error('Error cleaning up sound service:', error);
    }
  }
}
