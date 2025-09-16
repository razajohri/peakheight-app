import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { SoundService } from '../services/soundService';

// Components
import ProgressBlob from '../components/Home/ProgressBlob';
import HeightMetrics from '../components/Home/HeightMetrics';
import GrowthFactors from '../components/Home/GrowthFactors';
import StreakModal from '../components/Home/StreakModal';
import AICoachWidget from '../components/Home/AICoachWidget';

// Context
import { useUser } from '../contexts/UserContext';
import { DailyPlanService } from '../services/dailyPlanService';

const HomeScreen = ({ onNavigateToProgress, onNavigateToProfile }) => {
  const screenHeight = Dimensions.get('window').height;
  const [isStreakModalVisible, setStreakModalVisible] = useState(false);

  // Get user data from context
  const { userProfile, loading, getGreeting, getCurrentHeight, getTargetHeight, userProgress } = useUser();
  const [streak, setStreak] = useState(userProgress?.current_streak || 0);

  // Keep streak synced with DB and context
  useEffect(() => {
    if (typeof userProgress?.current_streak === 'number') {
      setStreak(userProgress.current_streak);
    }
  }, [userProgress?.current_streak]);

  useEffect(() => {
    const refresh = async () => {
      try {
        if (!userProfile?.id) return;
        const latest = await DailyPlanService.getUserProgress(userProfile.id);
        if (latest && typeof latest.current_streak === 'number') {
          setStreak(latest.current_streak);
        }
      } catch {}
    };
    refresh();
  }, [userProfile?.id]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Greeting Section */}
      <View style={styles.greetingSection}>
          <View style={styles.greetingLeft}>
            <Text style={styles.greetingText} numberOfLines={1}>
              {loading ? 'Loading...' : getGreeting()}
            </Text>
          </View>
          <View style={styles.greetingRight}>
            <TouchableOpacity
              style={styles.streakContainer}
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await SoundService.playStreakSound();
                setStreakModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.streakGradient}>
                <Icon name="flame" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.streakText}>{streak}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onNavigateToProfile();
              }}
            >
              <Icon name="settings-outline" size={24} color="#000000" />
            </TouchableOpacity>
        </View>
      </View>

        {/* Progress Blob */}
        <ProgressBlob onNavigateToProgress={onNavigateToProgress} userProgress={userProgress} />

        {/* Height Metrics */}
        <HeightMetrics />

        {/* Growth Factors */}
        <GrowthFactors />


        {/* AI Coach Widget */}
        <AICoachWidget />

        {/* Bottom padding - optimized for iPhone */}
        <View style={{ height: screenHeight > 800 ? 120 : screenHeight > 650 ? 80 : 40 }} />
      </ScrollView>

      {/* Streak Modal */}
      <StreakModal
        visible={isStreakModalVisible}
        onClose={() => setStreakModalVisible(false)}
        userProgress={userProgress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: '100%',
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  greetingLeft: {
    flex: 1,
  },
  greetingText: {
    color: '#000000',
    fontSize: 22,
    fontWeight: '600',
  },
  greetingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  streakGradient: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  streakText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 4,
  },
});

export default HomeScreen;
