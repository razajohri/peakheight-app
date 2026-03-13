import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import Icon from '../UI/Icon';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function SubExercisesView({ styles, selectedExercise, getExerciseImageUrl, openSubExercise }) {
  const insets = useSafeAreaInsets();
  
  if (!selectedExercise) return null;

  const formatDuration = (seconds) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    return `${seconds}s`;
  };

  return (
    <ScrollView 
      contentContainerStyle={[
        localStyles.scrollContent,
        { paddingBottom: Math.max(insets.bottom, 100) }
      ]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={localStyles.container}>
        {/* Header Section */}
        <View style={localStyles.headerSection}>
          <Text style={localStyles.mainTitle}>{selectedExercise.name}</Text>
          <Text style={localStyles.subtitle}>
            Choose from {selectedExercise.subExercises.length} exercise variations
          </Text>
        </View>

        {/* Sub-Exercises List */}
        <View style={localStyles.exercisesList}>
          {selectedExercise.subExercises.map((subExercise, index) => {
            const handlePress = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              openSubExercise(subExercise);
            };

            return (
              <AnimatedTouchable
                key={subExercise.id}
                entering={FadeInDown.delay(index * 100).duration(400).springify()}
                style={localStyles.cardContainer}
                onPress={handlePress}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#000000', '#333333']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={localStyles.card}
                >
                  {/* Number Badge */}
                  <View style={localStyles.numberBadge}>
                    <Text style={localStyles.numberText}>{index + 1}</Text>
                  </View>

                  {/* Content */}
                  <View style={localStyles.cardContent}>
                    <Text style={localStyles.exerciseName}>{subExercise.name}</Text>
                    {subExercise.description && (
                      <Text style={localStyles.exerciseDescription} numberOfLines={2}>
                        {subExercise.description}
                      </Text>
                    )}
                    
                    {/* Duration Badge */}
                    <View style={localStyles.durationContainer}>
                      <Icon name="time-outline" size={14} color="#CCCCCC" />
                      <Text style={localStyles.durationText}>
                        {formatDuration(subExercise.duration || 30)}
                      </Text>
                    </View>
                  </View>

                  {/* Arrow */}
                  <View style={localStyles.arrowContainer}>
                    <Icon name="chevron-forward" size={22} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              </AnimatedTouchable>
            );
          })}
        </View>

        {/* Benefits Section */}
        {selectedExercise.benefits && selectedExercise.benefits.length > 0 && (
          <Animated.View 
            entering={FadeInDown.delay(selectedExercise.subExercises.length * 100).duration(400)}
            style={localStyles.benefitsSection}
          >
            <Text style={localStyles.benefitsTitle}>Benefits</Text>
            <View style={localStyles.benefitsList}>
              {(selectedExercise.benefits || []).slice(0, 3).map((benefit, i) => (
                <View key={i} style={localStyles.benefitItem}>
                  <View style={localStyles.benefitDot} />
                  <Text style={localStyles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerSection: {
    marginBottom: 32,
    paddingTop: 8,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666666',
    lineHeight: 22,
  },
  exercisesList: {
    gap: 16,
    marginBottom: 32,
  },
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    minHeight: 100,
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  numberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  exerciseDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 10,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    gap: 6,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitsSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
    marginTop: 8,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#666666',
    lineHeight: 22,
  },
});

