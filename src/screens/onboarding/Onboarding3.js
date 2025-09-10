// Onboarding3.js (Page 3 - How old are you? Choose date of birth)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const Onboarding3 = ({ navigation }) => {
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '20%' }]} />
        </View>
        <Text style={styles.progressText}>3/15</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>How old are you?</Text>
        <Text style={styles.subtitle}>Choose your date of birth</Text>

        {Platform.OS === 'android' && (
          <TouchableOpacity
            style={styles.dateButton}
            onPress={showDatepicker}
          >
            <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
          </TouchableOpacity>
        )}

        {showPicker && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
              maximumDate={new Date()}
              minimumDate={new Date(1920, 0, 1)}
              textColor="#FFFFFF"
              style={styles.datePicker}
            />
          </View>
        )}

        {date.getFullYear() > new Date().getFullYear() - 18 && (
          <Text style={styles.consentText}>
            Parent/guardian consent required for users under 18
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding4')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D', // Deep navy base
    paddingTop: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#2A2F3E', // Darker gray
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#3B5FE3', // Cobalt accent
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5, // Tighter letter-spacing for headlines
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 32,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#D9D9D9', // Platinum gray
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  dateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#FFFFFF',
  },
  pickerContainer: {
    backgroundColor: Platform.OS === 'ios' ? '#1A1F2D' : 'transparent',
    borderRadius: 8,
    marginTop: 16,
  },
  datePicker: {
    width: '100%',
    height: 120,
  },
  consentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#3B5FE3', // Cobalt accent
    marginTop: 16,
  },
  buttonContainer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#3B5FE3', // Cobalt accent
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default Onboarding3;
