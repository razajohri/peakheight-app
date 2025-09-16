import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import AICoachIcon from '../components/AI/AICoachIcon';

// Import main app screens
import HomeScreen from './HomeScreen';
import ExercisesScreen from './ExercisesScreen';
import TribeScreen from './TribeScreen';
import PersonalProfileScreen from './PersonalProfileScreen';
import DailyRoutineScreen from './DailyRoutineScreen';
import FoodScanner from '../components/Nutrition/FoodScanner';

export default function MainApp({ onLogout }) {
  const [currentTab, setCurrentTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState(null);
  const insets = useSafeAreaInsets();

  const navigateToProfile = () => {
    setCurrentScreen('profile');
  };

  const handleTabPress = (tabId) => {
    // Add haptic feedback when switching tabs
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentTab(tabId);
  };

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

    if (currentScreen === 'profile') {
      return (
        <PersonalProfileScreen
          navigation={{ goBack: () => setCurrentScreen(null) }}
          onLogout={onLogout}
        />
      );
    }

    // Handle main tab screens
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToProfile={navigateToProfile}
            onNavigateToProgress={() => setCurrentTab('daily')}
          />
        );
      case 'exercises':
        return (
          <ExercisesScreen
            navigation={{
              navigate: (screen) => {
                if (screen === 'home') {
                  setCurrentTab('home');
                } else {
                  setCurrentScreen(screen);
                }
              },
              goBack: () => setCurrentTab('home')
            }}
            onNavigateToProfile={navigateToProfile}
          />
        );
      case 'daily':
        return <DailyRoutineScreen onNavigateToProfile={navigateToProfile} />;
      case 'tribe':
        return <TribeScreen navigation={{ goBack: () => setCurrentTab('home') }} onNavigateToProfile={navigateToProfile} />;
      default:
        return (
          <HomeScreen
            onNavigateToProfile={navigateToProfile}
            onNavigateToProgress={() => setCurrentTab('daily')}
          />
        );
    }
  };

  const tabs = [
    { id: 'home', label: 'Me', icon: 'home' },
    { id: 'exercises', label: 'Hub', icon: 'barbell' },
    { id: 'daily', label: 'Today', icon: 'calendar' },
    { id: 'tribe', label: 'Tribe', icon: 'people' },
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
              onPress={() => handleTabPress(tab.id)}
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

          {/* AI Coach Icon - Hide on home page */}
          {currentTab !== 'home' && (
            <View style={styles.aiCoachContainer}>
              <AICoachIcon
                size={28}
                color="#000000"
                style={styles.aiCoachIcon}
              />
            </View>
          )}
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
    position: 'relative',
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
  aiCoachContainer: {
    position: 'absolute',
    top: -65,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  aiCoachIcon: {
    padding: 0,
  },
});
