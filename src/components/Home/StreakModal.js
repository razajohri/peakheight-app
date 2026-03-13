import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Icon from '../UI/Icon';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const StreakModal = ({ visible, onClose, userProgress, freezeStatus, onUseFreeze }) => {
  const currentStreak = userProgress?.current_streak || 0;
  const bestStreak = userProgress?.longest_streak || currentStreak;
  const canUseFreeze = freezeStatus?.available && currentStreak === 0 && freezeStatus?.previousStreak > 0;

  // Generate weekly calendar data
  const generateWeeklyData = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const today = new Date();
    const weekData = [];
    
    // Get the last 7 days starting from today
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayIndex = date.getDay();
      const dayName = days[dayIndex];
      const dayNumber = date.getDate();
      const month = date.getMonth() + 1;
      
      // Determine if this day is completed based on streak
      // If we're showing today and streak > 0, or if it's a past day within streak range
      const isToday = i === 0;
      const isCompleted = currentStreak > 0 && (isToday || i < currentStreak);
      
      weekData.push({
        day: dayName,
        date: dayNumber,
        month: month,
        isCompleted: isCompleted,
        isToday: isToday,
        fullDate: date
      });
    }
    
    return weekData;
  };

  const weeklyData = generateWeeklyData();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={80}
            style={StyleSheet.absoluteFill}
            tint="dark"
          >
            <TouchableOpacity 
              style={styles.backdrop}
              activeOpacity={1}
              onPress={onClose}
            />
          </BlurView>
        ) : (
          <TouchableOpacity 
            style={styles.backdropAndroid}
            activeOpacity={1}
            onPress={onClose}
          />
        )}
        <View style={styles.modalContainer}>
          {/* Streak Boxes */}
          <View style={styles.streakBoxesContainer}>
            {/* Current Streak Box */}
            <View style={styles.streakBox}>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakLabel}>CURRENT STREAK</Text>
            </View>

            {/* Best Streak Box */}
            <View style={styles.streakBox}>
              <Text style={styles.streakNumber}>{bestStreak}</Text>
              <Text style={styles.streakLabel}>BEST STREAK</Text>
            </View>
          </View>

          {/* Weekly Calendar */}
          <View style={styles.weeklyCalendar}>
            <View style={styles.weekDaysContainer}>
              {weeklyData.map((dayData, idx) => (
                <View key={idx} style={styles.dayItem}>
                  <Text style={styles.dayName}>{dayData.day}</Text>
                  <View style={[
                    styles.dayCircle,
                    dayData.isCompleted && styles.dayCircleCompleted,
                    dayData.isToday && !dayData.isCompleted && styles.dayCircleToday
                  ]}>
                    {dayData.isCompleted ? (
                      <Icon name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text style={[
                        styles.dayDate,
                        dayData.isToday && styles.dayDateToday
                      ]}>
                        {dayData.date}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.dayMonth}>{dayData.month}/{dayData.date}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Streak Freeze Button - Show when streak is broken and freeze is available */}
          {canUseFreeze && (
            <TouchableOpacity
              style={styles.freezeButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onUseFreeze();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.freezeButtonContent}>
                <Text style={styles.freezeButtonIcon}>❄️</Text>
                <View style={styles.freezeButtonTextContainer}>
                  <Text style={styles.freezeButtonTitle}>Use Streak Freeze</Text>
                  <Text style={styles.freezeButtonSubtitle}>Restore your {freezeStatus.previousStreak} day streak</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Icon name="close-circle" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  backdropAndroid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    position: 'relative',
    zIndex: 1000,
  },
  streakBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  streakBox: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 6,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FF9500',
    marginBottom: 12,
    letterSpacing: -1,
    // Pixelated/gaming style effect
    textShadowColor: 'rgba(255, 149, 0, 0.4)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    lineHeight: 70,
  },
  streakLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888888',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  weeklyCalendar: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayItem: {
    alignItems: 'center',
    flex: 1,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayCircleCompleted: {
    backgroundColor: '#FF9500',
  },
  dayCircleToday: {
    backgroundColor: '#FFE5CC',
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666666',
  },
  dayDateToday: {
    color: '#FF9500',
  },
  dayMonth: {
    fontSize: 9,
    fontWeight: '500',
    color: '#999999',
  },
  freezeButton: {
    width: '100%',
    backgroundColor: '#4FC3F7',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 12,
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  freezeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freezeButtonIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  freezeButtonTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  freezeButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  freezeButtonSubtitle: {
    fontSize: 12,
    color: '#E3F2FD',
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default StreakModal;
