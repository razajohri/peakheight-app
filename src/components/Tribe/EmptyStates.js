import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';

export const LoadingState = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  return (
    <View style={styles.emptyStateContainer}>
      {[1, 2, 3].map(i => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonHeader}>
            <Animated.View style={[styles.skeletonAvatar, { opacity: shimmerAnim }]} />
            <View style={styles.skeletonLines}>
              <Animated.View style={[styles.skeletonShortLine, { opacity: shimmerAnim }]} />
              <Animated.View style={[styles.skeletonTinyLine, { opacity: shimmerAnim }]} />
            </View>
          </View>
          <View style={styles.skeletonBody}>
            <Animated.View style={[styles.skeletonLongLine, { opacity: shimmerAnim }]} />
            <Animated.View style={[styles.skeletonLongLine, { opacity: shimmerAnim }]} />
            <Animated.View style={[styles.skeletonMediumLine, { opacity: shimmerAnim }]} />
          </View>
        </View>
      ))}
    </View>
  );
};

export const ErrorState = ({ error, onRetry }) => (
  <View style={styles.errorContainer}>
    <Icon name="alert-circle-outline" size={48} color="#FF3B30" />
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

export const EmptyState = ({ onCreatePost }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <Animated.View style={[styles.emptyStateContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.emptyStateIcon}>
        <Icon name="people-outline" size={64} color="#CCCCCC" />
      </View>
      <Text style={styles.emptyStateTitle}>Welcome to the Tribe! 🌱</Text>
      <Text style={styles.emptyStateSubtitle}>
        Be the first to share your height growth journey, tips, or ask questions. 
        Your story could inspire others!
      </Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={onCreatePost}>
        <LinearGradient
          colors={['#000000', '#333333']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <Icon name="add" size={20} color="#FFFFFF" />
          <Text style={styles.emptyStateButtonText}>Share Your First Post</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 60,
  },
  emptyStateIcon: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 50,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  emptyStateButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#3B5FE3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Skeleton loading styles
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    marginRight: 12,
  },
  skeletonLines: {
    flex: 1,
  },
  skeletonShortLine: {
    height: 16,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 4,
    width: '60%',
  },
  skeletonTinyLine: {
    height: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    width: '40%',
  },
  skeletonBody: {
    marginTop: 8,
  },
  skeletonLongLine: {
    height: 16,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  skeletonMediumLine: {
    height: 16,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    width: '70%',
  },
});
