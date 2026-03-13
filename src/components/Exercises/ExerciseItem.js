import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from '../UI/Icon';
import * as Haptics from 'expo-haptics';

import CachedImage from '../UI/CachedImage';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ExerciseItem({ styles, item, onPress, getExerciseImageUrl, index = 0 }) {
  const getDisplayDuration = () => {
    const raw = item.duration ?? item.durationMin ?? item.defaultDuration ?? 0;
    if (typeof raw === 'string') return raw;
    const seconds = Number(raw);
    if (!Number.isFinite(seconds) || seconds <= 0) return '—';
    if (seconds >= 60) {
      const mins = Math.round(seconds / 60);
      return `${mins}m`;
    }
    return `${Math.max(1, Math.round(seconds))}s`;
  };

  const displayDuration = getDisplayDuration();
  const difficulty = item.difficulty || item.level || 'Beginner';
  const impactLevel = (item.impact || 'medium impact').toLowerCase();

  const getDifficultyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return '#10B981';
      case 'intermediate': 
      case 'inter': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getImpactColor = (level) => {
    const cleanLevel = level.toLowerCase().replace(' impact', '');
    switch (cleanLevel) {
      case 'high': return '#FF4444';
      case 'medium': return '#FF8C00';
      case 'low': return '#00AA00';
      default: return '#FF8C00';
    }
  };

  const hasSubExercises = item.subExercises && item.subExercises.length > 0;
  const subExerciseCount = hasSubExercises ? item.subExercises.length : 0;

  return (
    <AnimatedTouchable
      entering={FadeInDown.delay(index * 50).duration(400).springify()}
      style={localStyles.cardContainer}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(item);
      }}
      activeOpacity={0.7}
    >
      <View style={localStyles.card}>
        {/* Image Section */}
        <View style={localStyles.imageContainer}>
          <CachedImage 
            source={getExerciseImageUrl(item)} 
            style={localStyles.image} 
            resizeMode="cover" 
            priority="high" 
          />
          {/* Difficulty Badge Overlay */}
          <View style={[localStyles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) }]}>
            <Text style={localStyles.difficultyBadgeText}>{difficulty.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={localStyles.content}>
          <View style={localStyles.headerRow}>
            <Text style={localStyles.title} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
            <View style={localStyles.arrowContainer}>
              <Icon name="chevron-forward" size={18} color="#666666" />
            </View>
          </View>

          {/* Metadata Row */}
          <View style={localStyles.metaRow}>
            {/* Duration Badge */}
            <View style={localStyles.durationBadge}>
              <Icon name="time-outline" size={11} color="#666666" />
              <Text style={localStyles.durationText}>{displayDuration}</Text>
            </View>

            {/* Impact Badge */}
            <View style={[localStyles.impactBadge, { backgroundColor: `${getImpactColor(impactLevel)}15` }]}>
              <View style={[localStyles.impactDot, { backgroundColor: getImpactColor(impactLevel) }]} />
              <Text style={[localStyles.impactText, { color: getImpactColor(impactLevel) }]}>
                {impactLevel.replace(' impact', '').toUpperCase()}
              </Text>
            </View>

            {/* Highest Impact Star Badge */}
            {item.isHighestImpact && (
              <View style={localStyles.starBadge}>
                <Icon name="star" size={12} color="#FFD700" />
                <Text style={localStyles.starText}>HIGHEST</Text>
              </View>
            )}

            {/* Sub-Exercises Indicator */}
            {hasSubExercises && (
              <View style={localStyles.subExercisesBadge}>
                <Icon name="list" size={11} color="#666666" />
                <Text style={localStyles.subExercisesText}>{subExerciseCount}</Text>
              </View>
            )}
          </View>
        </View>
        </View>
    </AnimatedTouchable>
  );
}

const localStyles = StyleSheet.create({
  cardContainer: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  card: {
    flexDirection: 'row',
    minHeight: 90,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 10,
    position: 'relative',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  difficultyBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 12,
    paddingLeft: 8,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.2,
    lineHeight: 20,
    marginRight: 8,
  },
  arrowContainer: {
    padding: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
  },
  impactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  impactDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  impactText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subExercisesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  subExercisesText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  starText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B8860B',
    letterSpacing: 0.5,
  },
});

