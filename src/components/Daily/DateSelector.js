import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';

export default function DateSelector({ styles, colors, weekDates, selectedDate, setSelectedDate, formatDate, isDateSelected, allowDateSelection = true }) {
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getDayOfWeek = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  return (
    <View style={[styles.dateSelector, localStyles.premiumDateSelector]}>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={localStyles.dateScrollContainer}
      >
        {weekDates.map((date, index) => {
          const isSelected = isDateSelected(date);
          const isTodayDate = isToday(date);
          
          return (
            <TouchableOpacity
              key={`date-${date.toISOString()}`}
              style={[
                localStyles.premiumDateButton,
                {
                  backgroundColor: isSelected ? colors.accent : (isTodayDate ? '#F0F9FF' : '#FFFFFF'),
                  borderColor: isSelected ? colors.accent : (isTodayDate ? '#3B82F6' : '#E5E5E5'),
                  borderWidth: isSelected ? 2 : (isTodayDate ? 1.5 : 1),
                  opacity: allowDateSelection ? 1 : 0.6,
                }
              ]}
              onPress={() => allowDateSelection && setSelectedDate(date)}
              disabled={!allowDateSelection}
              activeOpacity={0.8}
            >
              {isSelected && (
                <LinearGradient
                  colors={[colors.accent, colors.accent]}
                  style={localStyles.selectedGradient}
                />
              )}
              
              <View style={localStyles.dateContent}>
                <Text style={[
                  localStyles.dayOfWeek,
                  { 
                    color: isSelected ? '#FFFFFF' : (isTodayDate ? '#3B82F6' : '#666666'),
                    fontWeight: isTodayDate ? '600' : '500'
                  }
                ]}>
                  {getDayOfWeek(date)}
                </Text>
                
                <Text style={[
                  localStyles.dateNumber,
                  { 
                    color: isSelected ? '#FFFFFF' : (isTodayDate ? '#3B82F6' : '#000000'),
                    fontWeight: isTodayDate ? '700' : '600'
                  }
                ]}>
                  {date.getDate()}
                </Text>
                
                {isTodayDate && !isSelected && (
                  <View style={localStyles.todayIndicator}>
                    <View style={localStyles.todayDot} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  premiumDateSelector: {
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.2,
  },
  dateHeaderRight: {
    // Empty for now
  },
  dateHeaderSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  dateScrollContainer: {
    paddingHorizontal: 2,
    gap: 8,
  },
  premiumDateButton: {
    width: 45,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  dateContent: {
    alignItems: 'center',
    gap: 4,
  },
  dayOfWeek: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  dateNumber: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  todayIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
  },
});
