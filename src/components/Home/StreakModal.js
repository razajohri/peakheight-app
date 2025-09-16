import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ConfettiAnimation from '../UI/ConfettiAnimation';

const StreakModal = ({ visible, onClose, userProgress }) => {
  if (!visible) return null;

  // Generate real weekly data
  const generateWeeklyData = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Get the last 7 days starting from today
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayIndex = date.getDay();
      const dayName = days[dayIndex];

      // For now, we'll show completed days based on the current streak
      // In a real app, you'd check actual task completion for each day
      const isCompleted = i === 0; // Only today is completed for now

      weekData.push({
        day: dayName,
        isCompleted: isCompleted,
        date: date
      });
    }

    return weekData;
  };

  const weeklyData = generateWeeklyData();

  return (
    <View style={styles.modalOverlay}>
      {/* Confetti Animation */}
      <ConfettiAnimation
        visible={visible}
        onComplete={() => {}}
        colors={['#FF9500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']}
      />

      <View style={styles.modalCard}>
        {/* Big streak number with flame */}
        <View style={styles.heroSection}>
          <View style={styles.numberContainer}>
            <Icon name="flame" size={60} color="#FF9500" style={styles.flameIcon} />
            <Text style={styles.bigNumber}>{userProgress?.current_streak || 0}</Text>
          </View>
          <Text style={styles.dayText}>day streak!</Text>
        </View>

        {/* Weekly progress card */}
        <View style={styles.weekCard}>
          {/* Days of week */}
          <View style={styles.weekDaysContainer}>
            {weeklyData.map((dayData, idx) => (
              <View key={`${dayData.day}-${idx}`} style={styles.dayContainer}>
                <Text style={styles.dayLabel}>{dayData.day}</Text>
                <View style={[
                  styles.dayIcon,
                  dayData.isCompleted ? styles.dayIconBlue : styles.dayIconGray
                ]}>
                  {dayData.isCompleted && (
                    <Icon name="checkmark" size={12} color="#FFFFFF" />
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Message */}
          <Text style={styles.message}>
            Great job! You've completed <Text style={styles.percentText}>{userProgress?.current_day || 1}</Text> days of your 120-day growth plan.
          </Text>
        </View>

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalCard: {
    width: '85%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  numberContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameIcon: {
    position: 'absolute',
    top: -10,
    zIndex: 1,
  },
  bigNumber: {
    color: '#FF9500',
    fontSize: 48,
    fontWeight: '900',
    marginTop: 10,
  },
  dayText: {
    color: '#FF9500',
    fontSize: 18,
    fontWeight: '800',
    marginTop: -5,
  },
  weekCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayLabel: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  dayIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayIconOrange: {
    backgroundColor: '#FF9500',
  },
  dayIconBlue: {
    backgroundColor: '#007AFF',
  },
  dayIconGray: {
    backgroundColor: '#E5E5E5',
  },
  message: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  percentText: {
    color: '#FF9500',
    fontWeight: '600',
  },
  closeButton: {
    alignSelf: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StreakModal;
