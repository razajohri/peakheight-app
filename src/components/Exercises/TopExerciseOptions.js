import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../UI/Icon';

export default function TopExerciseOptions({ styles, onPressToday, onOpenCategory, HapticFeedback }) {
  return (
    <View style={styles.topOptionsContainer}>
      <Text style={styles.topOptionsTitle}>Exercise Options</Text>
      <View style={styles.topOptionsGrid}>
        {[
          { id: 'today', name: 'Today', icon: 'calendar', isSpecial: true },
          { id: 'stretches', name: 'Stretches', icon: 'body' },
          { id: 'exercises', name: 'Exercises', icon: 'fitness' },
          { id: 'high-hgh-impact', name: 'High HGH Impact', icon: 'flash' },
        ].map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.topOptionCard,
              option.isSpecial && styles.todayCard
            ]}
            onPress={() => {
              if (option.isSpecial) {
                onPressToday && onPressToday();
                HapticFeedback && HapticFeedback.medium && HapticFeedback.medium();
              } else {
                onOpenCategory && onOpenCategory(option.id);
              }
            }}
          >
            <View style={[
              styles.topOptionIconHolder,
              option.isSpecial && styles.todayIconHolder
            ]}>
              <Icon name={option.icon} size={20} color={option.isSpecial ? "#FFFFFF" : "#000000"} />
            </View>
            <Text style={[
              styles.topOptionText,
              option.isSpecial && styles.todayText
            ]} numberOfLines={2}>{option.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

