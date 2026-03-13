import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AppState, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/UI/Icon';
import * as Haptics from 'expo-haptics';
import AICoachIcon from '../components/AI/AICoachIcon';
import AICoachModal from '../components/AI/AICoachModal';
import { useNotifications } from '../hooks/useNotifications';
import { useUser } from '../contexts/UserContext';
import { DailyPlanService } from '../services/dailyPlanService';
import NotificationService from '../services/notificationService';

// Import main app screens
import HomeScreen from './HomeScreen';
import ExercisesScreen from './ExercisesScreen';
import TribeScreen from './TribeScreen';
import PersonalProfileScreen from './PersonalProfileScreen';
import DailyRoutineScreen from './DailyRoutineScreen';
import FoodScanner from '../components/Nutrition/FoodScanner';
import TermsOfServiceScreen from './TermsOfServiceScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import PremiumProgressScreen from './PremiumProgressScreen';

export default function MainApp({ onLogout }) {
  const [currentTab, setCurrentTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState(null);
  const [exercisesIntent, setExercisesIntent] = useState(null);
  const [isAICoachModalVisible, setAICoachModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { userProfile } = useUser();
  // Initialize push notifications (iOS/Android)
  useNotifications();

  // Handle legacy profile screen navigation - redirect to account tab
  useEffect(() => {
    if (currentScreen === 'profile') {
      setCurrentTab('account');
      setCurrentScreen(null);
    }
  }, [currentScreen]);

  // Check for incomplete tasks when app comes to foreground
  useEffect(() => {
    if (!userProfile?.id) return;

    const checkAndScheduleReminders = async () => {
      try {
        const progress = await DailyPlanService.getUserProgress(userProfile.id);
        if (!progress) return;

        const dayTasks = await DailyPlanService.getDailyTasks(userProfile.id, progress.current_day);
        
        if (dayTasks && !dayTasks.is_completed && dayTasks.tasks && dayTasks.tasks.length > 0) {
          await NotificationService.scheduleTaskReminders(
            userProfile.id,
            progress.current_day,
            dayTasks.tasks,
            dayTasks.completed_tasks || []
          );
        }
      } catch (error) {
        console.warn('Failed to check task reminders on app foreground:', error);
      }
    };

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground, check for incomplete tasks
        checkAndScheduleReminders();
      }
    });

    // Also check immediately when component mounts
    checkAndScheduleReminders();

    return () => subscription?.remove();
  }, [userProfile?.id]);

  const navigateToProfile = () => {
    setCurrentTab('account');
  };

  const navigateToHubToday = () => {
    setExercisesIntent('today-hub');
    setCurrentTab('exercises');
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
      // Profile screen is now handled by the account tab - redirect to account tab
      // Use useEffect to handle state updates to avoid setState in render
      return null;
    }

    if (currentScreen === 'TermsOfService') {
      return (
        <TermsOfServiceScreen
          navigation={{ goBack: () => setCurrentScreen(null) }}
        />
      );
    }

    if (currentScreen === 'PrivacyPolicy') {
      return (
        <PrivacyPolicyScreen
          navigation={{ goBack: () => setCurrentScreen(null) }}
        />
      );
    }

    if (currentScreen === 'PremiumProgress') {
      return (
        <PremiumProgressScreen
          navigation={{ goBack: () => setCurrentScreen(null) }}
          onClose={() => setCurrentScreen(null)}
        />
      );
    }

    // Handle main tab screens
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToProfile={navigateToProfile}
            onNavigateToProgress={() => setCurrentScreen('PremiumProgress')}
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
            intent={exercisesIntent}
            onConsumeIntent={() => setExercisesIntent(null)}
            onNavigateToProfile={navigateToProfile}
          />
        );
      case 'daily':
        return <DailyRoutineScreen onNavigateToProfile={navigateToProfile} onNavigateToHub={navigateToHubToday} />;
      case 'tribe':
        return <TribeScreen navigation={{ goBack: () => setCurrentTab('home') }} onNavigateToProfile={navigateToProfile} />;
      case 'account':
        return (
          <PersonalProfileScreen
            navigation={{
              goBack: () => setCurrentTab('home'),
              navigate: (screen) => setCurrentScreen(screen)
            }}
            onLogout={onLogout}
            onNavigateToProgress={() => {
              setCurrentTab('daily');
            }}
            onNavigateToTab={(tabId) => {
              setCurrentTab(tabId);
            }}
          />
        );
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
    { id: 'account', label: 'Account', icon: 'settings-outline' },
  ];

  return (
    <View style={styles.container}>
      {/* Main Content with Slide Animation */}
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {renderCurrentScreen()}
      </View>

      {/* Bottom Tab Navigation - Instagram Style - Hide on overlay screens */}
      {!currentScreen || currentScreen === 'TermsOfService' || currentScreen === 'PrivacyPolicy' ? (
        <View style={[styles.bottomTabsContainer, { paddingBottom: Math.max(insets.bottom, 0) }]}>
          <View style={styles.bottomTabs}>
            {tabs.map((tab, index) => {
              const isActive = currentTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.tabButton}
                  onPress={() => handleTabPress(tab.id)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={tab.icon}
                    size={28}
                    color={isActive ? "#000000" : "#8E8E93"}
                  />
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* AI Coach Icon - Hide on home and tribe pages */}
          {currentTab !== 'home' && currentTab !== 'tribe' && (
            <View style={styles.aiCoachContainer}>
              <TouchableOpacity
                style={styles.aiCoachButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAICoachModalVisible(true);
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#000000', '#333333']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.aiCoachGradient}
                >
                  <Icon name="chatbubble-ellipses" size={28} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : null}

      {/* AI Coach Modal */}
      <AICoachModal
        visible={isAICoachModalVisible}
        onClose={() => setAICoachModalVisible(false)}
      />
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
    paddingBottom: 60, // Account for navbar height with labels
  },
  bottomTabsContainer: {
    position: 'absolute',
    // Move navbar down on iOS by using negative bottom value
    bottom: Platform.OS === 'ios' ? -20 : 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
  },
  bottomTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 0,
    paddingVertical: 6,
    minHeight: 60,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#000000',
    fontWeight: '600',
  },
  aiCoachContainer: {
    position: 'absolute',
    top: -84,
    right: 16,
    zIndex: 1000,
  },
  aiCoachButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiCoachGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
