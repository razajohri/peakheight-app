import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// Import main app screens
import HomeScreen from './HomeScreen';
import ExercisesScreen from './ExercisesScreen';
import ProgressScreen from './ProgressScreen';
import ProfileScreen from './ProfileScreen';
import DailyRoutineScreen from './DailyRoutineScreen';
import FoodScanner from '../components/Nutrition/FoodScanner';

export default function MainApp({ onLogout }) {
  const [currentTab, setCurrentTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState(null);
  const insets = useSafeAreaInsets();

  const renderCurrentScreen = () => {
    // Handle overlay screens first
    if (currentScreen === 'FoodScanner') {
      return (
        <FoodScanner
          navigation={{
            navigate: (screen) => setCurrentScreen(screen),
            goBack: () => setCurrentScreen(null)
          }}
          onClose={() => setCurrentScreen(null)}
        />
      );
    }

    // Handle main tab screens
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToProgress={() => setCurrentTab('progress')}
            onNavigateToProfile={() => setCurrentTab('profile')}
          />
        );
      case 'exercises':
        return (
          <ExercisesScreen
            navigation={{
              navigate: (screen) => setCurrentScreen(screen),
              goBack: () => setCurrentScreen(null)
            }}
            onNavigateToProfile={() => setCurrentTab('profile')}
          />
        );
      case 'progress':
        return <ProgressScreen />;
      case 'daily':
        return <DailyRoutineScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return (
          <HomeScreen
            onNavigateToProgress={() => setCurrentTab('progress')}
            onNavigateToProfile={() => setCurrentTab('profile')}
          />
        );
    }
  };

  const tabs = [
    { id: 'home', label: 'Me', icon: 'home' },
    { id: 'exercises', label: 'Hub', icon: 'barbell' },
    { id: 'progress', label: 'Progress', icon: 'stats-chart' },
    { id: 'daily', label: 'Today', icon: 'calendar' },
    { id: 'profile', label: 'Tribe', icon: 'people' },
  ];

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        {renderCurrentScreen()}
      </View>

      {/* Bottom Tab Navigation - Hide when showing overlay screens */}
      {!currentScreen && (
        <View style={[styles.bottomTabs, { paddingBottom: insets.bottom }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => setCurrentTab(tab.id)}
            >
              <Icon
                name={tab.icon}
                size={24}
                color={currentTab === tab.id ? '#000000' : '#666666'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  currentTab === tab.id && styles.tabLabelActive
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  bottomTabs: {
    flexDirection: 'row',
    minHeight: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  tabLabel: {
    color: '#666666',
    fontSize: 12,
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#000000',
  },
});
