import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function DateSelector({ styles, colors, weekDates, selectedDate, setSelectedDate, formatDate, isDateSelected }) {
  return (
    <View style={styles.dateSelector}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          {weekDates.map((date) => (
            <TouchableOpacity
              key={`date-${date.toISOString()}`}
              style={[
                styles.dateButton,
                {
                  backgroundColor: isDateSelected(date) ? colors.accent : colors.surface,
                  borderColor: isDateSelected(date) ? colors.accent : colors.border,
                }
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[
                styles.dateText,
                {
                  color: isDateSelected(date) ? colors.surfaceElevated : colors.textPrimary,
                }
              ]}>
                {formatDate(date)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
