import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';
import { NUTRITION_CATEGORIES } from '../../utils/exercisesData';

export default function HeaderBar({
  styles,
  navigation,
  view,
  setView,
  selectedCategory,
  selectedExercise,
  selectedSubExercise,
  setSelectedSubExercise,
  activeTopTab,
  setActiveTopTab,
  onNavigateToProfile,
  todayList,
  currentTodayIndex,
  setCurrentTodayIndex,
  onStreak,
  onShield,
}) {
  const getTitle = () => {
    if (view === 'hub') return 'HUB';
    if (view === 'list') return 'EXERCISES';
    if (view === 'weekly-progress') return 'MY PROGRESS';
    if (view === 'sub-exercises') return 'SUB-EXERCISES';
    if (view === 'detail' && activeTopTab === 'nutrition') {
      return NUTRITION_CATEGORIES.find(cat => cat.id === selectedCategory)?.name || 'NUTRITION';
    }
    if (view === 'detail') {
      // Detail header count logic
      if (currentTodayIndex != null && todayList && todayList.length > 0) {
        return `${currentTodayIndex + 1}/${todayList.length}`;
      }
      const subs = (selectedExercise && selectedExercise.subExercises) ? selectedExercise.subExercises : [];
      const sel = selectedSubExercise || null;
      if (subs.length > 0 && sel) {
        const idx = subs.findIndex(s => String(s.id) === String(sel.id));
        const pos = idx >= 0 ? idx + 1 : 1;
        return `${pos}/${subs.length}`;
      }
      return '1/1';
    }
    return 'DETAIL';
  };

  const getSubtitle = () => {
    if (view === 'hub') return '';
    if (view === 'list') return 'Browse • Learn • Practice';
    if (view === 'weekly-progress') return 'Track • Monitor • Achieve';
    if (view === 'sub-exercises') return 'Focus • Master • Excel';
    if (view === 'detail' && activeTopTab === 'nutrition') return 'Fuel • Nourish • Grow';
    if (view === 'detail') return 'Focus • Execute • Complete';
    return 'Navigate • Explore • Discover';
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.header, localStyles.headerGradient]}
    >
      <View style={localStyles.leftContainer}>
        <TouchableOpacity
          style={[styles.backButton, localStyles.premiumButton]}
          onPress={() => {
            if (view === 'hub') {
              if (navigation && navigation.navigate) {
                navigation.navigate('home');
              } else if (navigation && navigation.goBack) {
                navigation.goBack();
              }
            } else if (view === 'list' || view === 'weekly-progress') {
              setView('hub');
            } else if (view === 'detail') {
              if (activeTopTab === 'nutrition') {
                setView('hub');
              } else if (currentTodayIndex !== null && todayList && todayList.length > 0) {
                // If we came from Today's exercises, always go back to hub
                setView('hub');
              } else {
                // Check if we came from sub-exercises or directly from exercise list
                if (selectedSubExercise) {
                  // We're in a sub-exercise detail, go back to sub-exercises list
                  setSelectedSubExercise && setSelectedSubExercise(null);
                  setView('sub-exercises');
                } else {
                  // We're in a main exercise detail, go back to exercise list
                  setView('list');
                }
              }
            } else if (view === 'sub-exercises') {
              // Going back from sub-exercises to list, clear any Today mode
              setCurrentTodayIndex && setCurrentTodayIndex(null);
              setView('list');
            }
          }}
        >
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
      
      <View style={localStyles.titleContainer}>
        <Text style={[styles.headerTitle, localStyles.premiumTitle]}>
          {getTitle()}
        </Text>
        {getSubtitle() ? (
          <View style={localStyles.subtitleContainer}>
            <Text style={localStyles.subtitle}>
              {getSubtitle()}
            </Text>
          </View>
        ) : null}
      </View>
      
      <View style={localStyles.rightContainer}>
        <View style={localStyles.iconsContainer}>
        <TouchableOpacity
          style={[localStyles.shieldButton, localStyles.premiumButton]}
          onPress={() => {
            if (typeof onShield === 'function') {
              onShield();
            }
          }}
        >
          <Icon name="water" size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, localStyles.premiumButton]}
          onPress={() => {
            if (typeof onStreak === 'function') {
              onStreak();
            }
          }}
        >
          <Icon name="flame" size={24} color="#FF9500" />
        </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const localStyles = StyleSheet.create({
  headerGradient: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: -12,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#000000',
  },
  subtitleContainer: {
    marginTop: 0,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#666666',
    letterSpacing: 0.5,
  },
  premiumButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shieldButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
});

