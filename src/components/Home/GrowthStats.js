import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GrowthStats = () => {
  return (
    <View style={styles.statsContainer}>
      <View style={[styles.statCard, styles.statCardSpacing]}>
        <Text style={styles.statLabel}>Dream height odds</Text>
        <Text style={styles.statValue}>100%</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '100%' }]} />
        </View>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Growth complete</Text>
        <Text style={styles.statValue}>95.0%</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '95%' }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  statCardSpacing: {
    marginBottom: 12,
  },
  statLabel: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});

export default GrowthStats;
