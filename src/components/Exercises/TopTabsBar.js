import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../UI/Icon';

export default function TopTabsBar({ styles, activeTopTab, setActiveTopTab, HapticFeedback }) {
  const tabs = [
    { id: 'train', label: 'Train', icon: 'barbell' },
    { id: 'physical', label: 'My Exercises', icon: 'fitness' },
    { id: 'nutrition', label: 'Nutrition', icon: 'restaurant' }
  ];

  return (
    <View style={[styles.topTabs, localStyles.tabsContainer]}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => {
            HapticFeedback.selection();
            setActiveTopTab(tab.id);
          }}
          style={[
            localStyles.tabButton,
            activeTopTab === tab.id && localStyles.tabButtonActive
          ]}
        >
          <View style={localStyles.tabContent}>
            <Icon 
              name={tab.icon} 
              size={16} 
              color={activeTopTab === tab.id ? '#FFFFFF' : '#666666'} 
              style={localStyles.tabIcon}
            />
            <Text style={[
              localStyles.tabText,
              activeTopTab === tab.id && localStyles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const localStyles = StyleSheet.create({
  tabsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 6,
    marginHorizontal: 16,
    marginTop: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tabButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 1,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#000000',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabIcon: {
    marginRight: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    flexShrink: 0,
    color: '#000000',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});
