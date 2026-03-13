import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';

export default function DailyHeader({ styles, colors, currentDay, phase, onPressStreak, onPressShield }) {
  const progressPercentage = (currentDay / 120) * 100;
  
  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA', '#F1F3F4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.header, localStyles.premiumHeader]}
    >
      <View style={localStyles.headerContent}>
        <View style={localStyles.titleSection}>
          <Text style={localStyles.dayTitle}>
            Day {currentDay} <Text style={localStyles.dayTotalInline}>of 120</Text>
          </Text>
        </View>
        
        <View style={localStyles.phaseSection}>
          <View style={[localStyles.phaseBadge, { backgroundColor: `${colors.accent}15` }]}>
            <Icon name="trending-up" size={16} color={colors.accent} />
            <Text style={[localStyles.phaseText, { color: colors.accent }]}>{phase}</Text>
          </View>
        </View>
        
        <View style={localStyles.progressSection}>
          <View style={localStyles.progressHeader}>
            <Text style={localStyles.progressLabel}>Progress</Text>
            <Text style={localStyles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
          </View>
          <View style={localStyles.progressBarContainer}>
            <View style={localStyles.progressBar}>
              <View 
                style={[
                  localStyles.progressFill, 
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: colors.accent 
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
      
      <View style={localStyles.iconsContainer}>
        <TouchableOpacity style={localStyles.shieldButton} onPress={onPressShield}>
          <Icon name="water" size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.settingsButton} onPress={onPressStreak}>
          <Icon name="flame" size={24} color="#FF9500" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const localStyles = StyleSheet.create({
  premiumHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 18,
    paddingBottom: 20,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
  },
  titleSection: {
    marginBottom: 16,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  dayDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 12,
  },
  dayTotal: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: -0.3,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    letterSpacing: 0.3,
  },
  dayTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  dayTotalInline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: -0.3,
  },
  phaseSection: {
    marginBottom: 16,
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  phaseText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  progressSection: {
    marginBottom: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    letterSpacing: 0.3,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.3,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  iconsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 4 : 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shieldButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});

