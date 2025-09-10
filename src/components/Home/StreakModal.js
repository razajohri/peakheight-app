import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const StreakModal = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        {/* Big streak number with flame */}
        <View style={styles.heroSection}>
          <View style={styles.numberContainer}>
            <Icon name="flame" size={60} color="#FF9500" style={styles.flameIcon} />
            <Text style={styles.bigNumber}>21</Text>
          </View>
          <Text style={styles.dayText}>day streak!</Text>
        </View>

        {/* Weekly progress card */}
        <View style={styles.weekCard}>
          {/* Days of week */}
          <View style={styles.weekDaysContainer}>
            {['We','Th','Fr','Sa','Su','Mo','Tu'].map((day, idx) => (
              <View key={day} style={styles.dayContainer}>
                <Text style={styles.dayLabel}>{day}</Text>
                <View style={[
                  styles.dayIcon,
                  (idx === 1 || idx === 3) ? styles.dayIconBlue : styles.dayIconOrange
                ]}>
                  <Icon name="checkmark" size={12} color="#FFFFFF" />
                </View>
              </View>
            ))}
          </View>

          {/* Message */}
          <Text style={styles.message}>
            Early Bird! You extended your streak earlier than <Text style={styles.percentText}>89.1%</Text> of learners.
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
