import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from '../UI/Icon';
import { getGridColumns, getCardWidth } from '../../utils/responsiveUtils';

export default function CategoryGrid({ styles, onOpenCategory }) {
  const gridColumns = 3; // Force 3 columns for Browse by Area
  
  const categories = [
    { id: 'posture', name: 'Posture', icon: 'body', color: '#3B5FE3', description: 'Improve alignment' },
    { id: 'masai-jump', name: 'Masai Jump', icon: 'flash', color: '#F59E0B', description: 'Dynamic moves' },
    { id: 'upper-body', name: 'Upper Body', icon: 'shield', color: '#10B981', description: 'Strength training' },
    { id: 'feet-ankles', name: 'Feet & Ankles', icon: 'footsteps', color: '#8B5CF6', description: 'Foundation work' },
    { id: 'chest', name: 'Chest', icon: 'heart', color: '#EF4444', description: 'Chest expansion' },
    { id: 'lower-body', name: 'Lower Body', icon: 'walk', color: '#06B6D4', description: 'Leg strength' },
    { id: 'neck', name: 'Neck', icon: 'person', color: '#84CC16', description: 'Neck mobility' },
    { id: 'shoulders', name: 'Shoulders', icon: 'accessibility-outline', color: '#F97316', description: 'Shoulder health' },
    { id: 'hamstrings', name: 'Hamstrings', icon: 'swap-vertical', color: '#EC4899', description: 'Flexibility' }
  ];

  return (
    <View style={[styles.gridContainer, localStyles.container]}>
      <View style={localStyles.header}>
        <Text style={[styles.gridTitle, localStyles.title]}>BROWSE BY AREA</Text>
      </View>
      <View style={[styles.grid, localStyles.grid, { justifyContent: 'space-between' }]}>
        {categories.map(cat => (
          <TouchableOpacity 
            key={cat.id} 
            style={[styles.gridCard, localStyles.categoryCard, localStyles.fixedCardWidth]} 
            onPress={() => onOpenCategory(cat.id)}
            activeOpacity={0.8}
          >
            <View style={[localStyles.iconContainer, { backgroundColor: `${cat.color}15` }]}>
              <Icon name={cat.icon} size={28} color={cat.color} />
            </View>
            <View style={localStyles.textContainer}>
              <Text style={[localStyles.categoryName]} numberOfLines={1} ellipsizeMode="tail">
                {cat.name || 'No Name'}
              </Text>
              <Text style={[localStyles.categoryDescription]} numberOfLines={1} ellipsizeMode="tail">
                {cat.description || 'No Description'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    marginTop: -42,
    marginBottom: 16,
  },
  header: {
    marginBottom: -2
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  grid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
  },
  fixedCardWidth: {
    width: '31%', // Ensures 3 cards fit with space-between
  },
});

