import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Components
import ProgressBlob from '../components/Home/ProgressBlob';
import HeightMetrics from '../components/Home/HeightMetrics';
import GrowthFactors from '../components/Home/GrowthFactors';
import GrowthStats from '../components/Home/GrowthStats';
import StreakModal from '../components/Home/StreakModal';
import AICoachWidget from '../components/Home/AICoachWidget';

const HomeScreen = ({ onNavigateToProgress, onNavigateToProfile }) => {
  const screenHeight = Dimensions.get('window').height;
  const [isStreakModalVisible, setStreakModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Greeting Section */}
      <View style={styles.greetingSection}>
          <View style={styles.greetingLeft}>
            <Text style={styles.greetingText} numberOfLines={1}>Good morning, Alex</Text>
          </View>
          <View style={styles.greetingRight}>
            <TouchableOpacity
              style={styles.streakContainer}
              onPress={() => setStreakModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.streakGradient}>
                <Icon name="flame" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.streakText}>21</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton} onPress={onNavigateToProfile}>
              <Icon name="settings-outline" size={24} color="#000000" />
            </TouchableOpacity>
        </View>
      </View>

        {/* Progress Blob */}
        <ProgressBlob onNavigateToProgress={onNavigateToProgress} />

        {/* Height Metrics */}
        <HeightMetrics />

        {/* Growth Factors */}
        <GrowthFactors />

        {/* AI Coach Widget */}
        <AICoachWidget />

        {/* Growth Stats */}
        <GrowthStats />

        {/* Bottom padding - optimized for iPhone */}
        <View style={{ height: screenHeight > 800 ? 120 : screenHeight > 650 ? 80 : 40 }} />
      </ScrollView>

      {/* Streak Modal */}
      <StreakModal
        visible={isStreakModalVisible}
        onClose={() => setStreakModalVisible(false)}
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
    fontSize: 24,
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
