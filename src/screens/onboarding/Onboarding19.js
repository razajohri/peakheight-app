// Onboarding19.js (Page 19 - Dashboard)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Onboarding19 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome, Alex</Text>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Current height</Text>
              <Text style={styles.statValue}>5'10"</Text>
              <Text style={styles.statSubtext}>178 cm</Text>
              <View style={styles.confidenceTag}>
                <Text style={styles.confidenceText}>Confidence: High</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Forecast range</Text>
              <Text style={styles.statValue}>5'11" - 6'1"</Text>
              <Text style={styles.statSubtext}>180 - 185 cm</Text>
              <TouchableOpacity>
                <Text style={styles.methodLink}>Method</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.streakContainer}>
            <View style={styles.streakIconContainer}>
              <Ionicons name="calendar" size={24} color="#3B5FE3" />
            </View>
            <View style={styles.streakTextContainer}>
              <Text style={styles.streakCount}>12 day streak</Text>
              <Text style={styles.streakSubtext}>Keep it up!</Text>
            </View>
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>Complete today's posture routine</Text>
            <Text style={styles.actionDescription}>
              10-minute routine to improve posture and stimulate growth
            </Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Start</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.coachCard}>
            <View style={styles.coachCardHeader}>
              <Text style={styles.coachCardTitle}>Coach insight</Text>
              <Ionicons name="information-circle-outline" size={20} color="#AAAAAA" />
            </View>
            <Text style={styles.coachCardContent}>
              Sleeping before 10PM increases growth hormone production by 34%
            </Text>
            <View style={styles.coachCardFooter}>
              <Text style={styles.coachCardTimestamp}>Updated Aug 30, 2025</Text>
              <Text style={styles.coachCardReviewer}>Reviewed by Dr. Sarah Chen, PhD</Text>
              <TouchableOpacity>
                <Text style={styles.methodLink}>Method</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.quickAddContainer}>
            <Text style={styles.quickAddTitle}>Quick add</Text>
            <View style={styles.quickAddButtonsRow}>
              <TouchableOpacity style={styles.quickAddButton}>
                <Ionicons name="resize" size={24} color="#FFFFFF" />
                <Text style={styles.quickAddButtonText}>Height</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAddButton}>
                <Ionicons name="moon" size={24} color="#FFFFFF" />
                <Text style={styles.quickAddButtonText}>Sleep</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAddButton}>
                <Ionicons name="restaurant" size={24} color="#FFFFFF" />
                <Text style={styles.quickAddButtonText}>Meal</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAddButton}>
                <Ionicons name="fitness" size={24} color="#FFFFFF" />
                <Text style={styles.quickAddButtonText}>Exercise</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="home" size={24} color="#3B5FE3" />
          <Text style={[styles.tabBarItemText, styles.tabBarItemTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="calendar" size={24} color="#AAAAAA" />
          <Text style={styles.tabBarItemText}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="analytics" size={24} color="#AAAAAA" />
          <Text style={styles.tabBarItemText}>Measure</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="book" size={24} color="#AAAAAA" />
          <Text style={styles.tabBarItemText}>Library</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="people" size={24} color="#AAAAAA" />
          <Text style={styles.tabBarItemText}>Community</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.coachButton}>
        <Text style={styles.coachButtonText}>Coach</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D', // Deep navy base
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100, // Extra padding at bottom for tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2F3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1A1F2D',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  statSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 8,
  },
  confidenceTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 95, 227, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  confidenceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#3B5FE3',
  },
  methodLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B5FE3',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1F2D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 95, 227, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakTextContainer: {
    flex: 1,
  },
  streakCount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  streakSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
  },
  actionCard: {
    backgroundColor: '#1A1F2D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  actionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  actionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#3B5FE3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  coachCard: {
    backgroundColor: '#1A1F2D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  coachCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  coachCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  coachCardContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 24,
  },
  coachCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#2A2F3E',
    paddingTop: 12,
  },
  coachCardTimestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 4,
  },
  coachCardReviewer: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 8,
  },
  quickAddContainer: {
    marginBottom: 24,
  },
  quickAddTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickAddButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAddButton: {
    width: '22%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 8,
  },
  tabBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1F2D',
    borderTopWidth: 1,
    borderTopColor: '#2A2F3E',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabBarItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
  },
  tabBarItemTextActive: {
    color: '#3B5FE3',
  },
  coachButton: {
    position: 'absolute',
    right: 24,
    bottom: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3B5FE3',
    borderRadius: 20,
  },
  coachButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default Onboarding19;
