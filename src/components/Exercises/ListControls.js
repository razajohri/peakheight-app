import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../UI/Icon';

export default function ListControls({ styles, search, setSearch, sort, setSort }) {
  return (
    <View style={localStyles.container}>
      {/* Search Bar */}
      <View style={localStyles.searchContainer}>
        <View style={localStyles.searchBar}>
          <Icon name="search" size={16} color="#999999" style={localStyles.searchIcon} />
        <TextInput
            placeholder="Search exercises..."
            placeholderTextColor="#999999"
            style={localStyles.searchInput}
          value={search ?? ''}
          onChangeText={setSearch}
          autoCapitalize="none"
          clearButtonMode="never"
        />
        {!!search && (
            <TouchableOpacity 
              onPress={() => setSearch('')}
              style={localStyles.clearButton}
            >
              <Icon name="close-circle" size={18} color="#999999" />
          </TouchableOpacity>
        )}
      </View>
      </View>

      {/* Filter Chips */}
      <View style={localStyles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={localStyles.filtersScroll}
        >
          {[
            { id: 'recommended', label: 'Recommended', icon: 'star' },
            { id: 'upper-body', label: 'Upper body', icon: 'accessibility-outline' },
            { id: 'chest', label: 'Chest', icon: 'heart' },
            { id: 'neck', label: 'Neck', icon: 'person' },
            { id: 'shoulders', label: 'Shoulders', icon: 'accessibility-outline' },
            { id: 'lower-body', label: 'Lower body', icon: 'walk' },
            { id: 'hamstrings', label: 'Hamstrings', icon: 'swap-vertical' },
          ].map(opt => {
            const isActive = sort === opt.id;
            return (
              <TouchableOpacity 
                key={opt.id} 
                onPress={() => setSort(opt.id)}
                activeOpacity={0.7}
              >
                <View style={isActive ? localStyles.filterChipActive : localStyles.filterChip}>
                  <Icon name={opt.icon} size={12} color={isActive ? '#FFFFFF' : '#666666'} />
                  <Text style={isActive ? localStyles.filterChipTextActive : localStyles.filterChipText}>
                    {opt.label}
                  </Text>
                </View>
            </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    padding: 0,
  },
  clearButton: {
    marginLeft: 6,
    padding: 2,
  },
  filtersContainer: {
    marginTop: 2,
  },
  filtersScroll: {
    paddingRight: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterChipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  filterChipTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

