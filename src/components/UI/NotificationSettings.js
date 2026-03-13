import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from '../UI/Icon';
import NotificationService from '../../services/notificationService';
import { useUser } from '../../contexts/UserContext';

const NotificationSettings = () => {
  const { userProfile } = useUser();
  const [preferences, setPreferences] = useState({
    morning_reminders: true,
    afternoon_reminders: true,
    evening_reminders: true,
    streak_notifications: true,
    achievement_notifications: true,
    morning_time: '08:00',
    afternoon_time: '14:00',
    evening_time: '20:00',
    timezone: 'UTC',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotificationPreferences();
  }, [userProfile]);

  const loadNotificationPreferences = async () => {
    try {
      if (userProfile) {
        const prefs = await NotificationService.getUserNotificationPreferences(userProfile.id);
        if (prefs) {
          setPreferences(prefs);
        }
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key, value) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);

      if (userProfile) {
        await NotificationService.updateUserNotificationPreferences(
          userProfile.id,
          newPreferences
        );
      }
    } catch (error) {
      console.error('Error updating notification preference:', error);
      // Revert the change on error
      setPreferences(preferences);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const toggleSwitch = (key) => {
    updatePreference(key, !preferences[key]);
  };

  const getTimeDisplay = (time) => {
    return time || '08:00';
  };

  const showTimePicker = (timeKey, title) => {
    // For now, just show an alert. In a real app, you'd use a proper time picker
    Alert.alert(
      title,
      `Current time: ${getTimeDisplay(preferences[timeKey])}\n\nTime picker would open here in a full implementation.`,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading notification settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notification Settings</Text>
        <Text style={styles.subtitle}>
          Customize when and how you receive growth reminders
        </Text>
      </View>

      {/* Daily Reminders Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Reminders</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="sunny" size={24} color="#FFA500" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Morning Reminders</Text>
              <Text style={styles.settingDescription}>
                Motivation and task reminders
              </Text>
            </View>
          </View>
          <Switch
            value={preferences.morning_reminders}
            onValueChange={() => toggleSwitch('morning_reminders')}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={preferences.morning_reminders ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        {preferences.morning_reminders && (
          <TouchableOpacity
            style={styles.timeSetting}
            onPress={() => showTimePicker('morning_time', 'Morning Reminder Time')}
          >
            <Text style={styles.timeLabel}>Time: {getTimeDisplay(preferences.morning_time)}</Text>
            <Icon name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        )}

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="partly-sunny" size={24} color="#FFD700" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Afternoon Reminders</Text>
              <Text style={styles.settingDescription}>
                Nutrition and exercise reminders
              </Text>
            </View>
          </View>
          <Switch
            value={preferences.afternoon_reminders}
            onValueChange={() => toggleSwitch('afternoon_reminders')}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={preferences.afternoon_reminders ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        {preferences.afternoon_reminders && (
          <TouchableOpacity
            style={styles.timeSetting}
            onPress={() => showTimePicker('afternoon_time', 'Afternoon Reminder Time')}
          >
            <Text style={styles.timeLabel}>Time: {getTimeDisplay(preferences.afternoon_time)}</Text>
            <Icon name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        )}

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="moon" size={24} color="#6A5ACD" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Evening Reminders</Text>
              <Text style={styles.settingDescription}>
                Sleep and progress tracking reminders
              </Text>
            </View>
          </View>
          <Switch
            value={preferences.evening_reminders}
            onValueChange={() => toggleSwitch('evening_reminders')}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={preferences.evening_reminders ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        {preferences.evening_reminders && (
          <TouchableOpacity
            style={styles.timeSetting}
            onPress={() => showTimePicker('evening_time', 'Evening Reminder Time')}
          >
            <Text style={styles.timeLabel}>Time: {getTimeDisplay(preferences.evening_time)}</Text>
            <Icon name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Special Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Notifications</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="flame" size={24} color="#FF4500" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Streak Alerts</Text>
              <Text style={styles.settingDescription}>
                Get notified when your streak is at risk
              </Text>
            </View>
          </View>
          <Switch
            value={preferences.streak_notifications}
            onValueChange={() => toggleSwitch('streak_notifications')}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={preferences.streak_notifications ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="trophy" size={24} color="#FFD700" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Achievement Notifications</Text>
              <Text style={styles.settingDescription}>
                Celebrate your milestones and achievements
              </Text>
            </View>
          </View>
          <Switch
            value={preferences.achievement_notifications}
            onValueChange={() => toggleSwitch('achievement_notifications')}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={preferences.achievement_notifications ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Notification Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preview</Text>
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>💤 Sleep & Recovery</Text>
          <Text style={styles.previewMessage}>
            "Growth happens when you sleep, aim for 8+ hours tonight."
          </Text>
        </View>
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>🥗 Nutrition</Text>
          <Text style={styles.previewMessage}>
            "Protein fuels your growth, have you hit your target today?"
          </Text>
        </View>
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>🏋 Exercise & Posture</Text>
          <Text style={styles.previewMessage}>
            "Stretch time: a 5-minute posture session can keep your spine aligned."
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Notifications help you stay consistent with your growth journey.
          You can change these settings anytime.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  timeSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666666',
  },
  previewContainer: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  previewMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationSettings;

