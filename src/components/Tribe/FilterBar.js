import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function FilterBar({ styles, filter, onChange }) {
  const items = ['Latest', 'Most Popular', 'Oldest'];
  
  return (
    <View style={styles.filterBar}>
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.filterChip, filter === item && styles.filterChipActive]}
          onPress={() => onChange(item)}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterChipText, filter === item && styles.filterChipTextActive]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

