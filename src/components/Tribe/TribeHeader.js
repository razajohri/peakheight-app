import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';

export default function TribeHeader({ styles, onBack, onStreak, onShield }) {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.header, localStyles.headerGradient]}
    >
      <View style={localStyles.leftContainer}>
        <TouchableOpacity 
          style={[styles.backButton, localStyles.premiumButton]} 
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
      <View style={localStyles.titleContainer} pointerEvents="none">
        <Text style={[styles.headerTitle, localStyles.premiumTitle]}>TRIBE</Text>
        <View style={localStyles.subtitleContainer}>
          <Text style={localStyles.subtitle}>Connect • Share • Grow</Text>
        </View>
      </View>
      <View style={localStyles.rightContainer}>
        <View style={localStyles.iconsContainer}>
        <TouchableOpacity style={[localStyles.shieldButton, localStyles.premiumButton]} onPress={onShield}>
          <Icon name="water" size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, localStyles.premiumButton]} onPress={onStreak}>
          <Icon name="flame" size={24} color="#FF9500" />
        </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const localStyles = StyleSheet.create({
  headerGradient: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: -12,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#000000',
  },
  subtitleContainer: {
    marginTop: 0,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#666666',
    letterSpacing: 0.5,
  },
  premiumButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shieldButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
});


