import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const LoadingState = () => (
  <View style={styles.emptyStateContainer}>
    {[1, 2, 3].map(i => (
      <View key={i} style={styles.skeletonCard}>
        <View style={styles.skeletonHeader}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonLines}>
            <View style={styles.skeletonShortLine} />
            <View style={styles.skeletonTinyLine} />
          </View>
        </View>
        <View style={styles.skeletonBody}>
          <View style={styles.skeletonLongLine} />
          <View style={styles.skeletonLongLine} />
          <View style={styles.skeletonMediumLine} />
        </View>
      </View>
    ))}
  </View>
);

export const ErrorState = ({ error, onRetry }) => (
  <View style={styles.errorContainer}>
    <Icon name="alert-circle-outline" size={48} color="#FF3B30" />
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

export const EmptyState = ({ onCreatePost }) => (
  <View style={styles.emptyStateContainer}>
    <Text style={styles.emptyStateTitle}>No posts yet</Text>
    <Text style={styles.emptyStateSubtitle}>
      Be the first to share your progress, tips, or questions.
    </Text>
    <TouchableOpacity style={styles.emptyStateButton} onPress={onCreatePost}>
      <Text style={styles.emptyStateButtonText}>
        Create your first post
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#3B5FE3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
