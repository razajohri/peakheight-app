import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TribeHeader({ styles, onBack, onSettings }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Icon name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>TRIBE</Text>
      <TouchableOpacity style={styles.filterButton} onPress={onSettings}>
        <Icon name="settings-outline" size={24} color="#000000" />
      </TouchableOpacity>
    </View>
  );
}


