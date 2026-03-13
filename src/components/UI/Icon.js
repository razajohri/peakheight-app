// Icon wrapper to use Expo's vector icons instead of react-native-vector-icons
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// This wrapper makes @expo/vector-icons work like react-native-vector-icons
const Icon = ({ name, size, color, style }) => {
  return <Ionicons name={name} size={size} color={color} style={style} />;
};

export default Icon;

