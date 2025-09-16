import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../contexts/UserContext';

const HeightMetrics = () => {
  const { userProfile, loading, getCurrentHeight, getTargetHeight } = useUser();

  const currentHeight = getCurrentHeight();
  const targetHeight = getTargetHeight();

  if (loading) {
    return (
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>CURRENT HEIGHT</Text>
          <Text style={styles.metricValue}>Loading...</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>TARGET HEIGHT</Text>
          <Text style={styles.metricValue}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.metricsRow}>
      {/* Current Height */}
      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>CURRENT HEIGHT</Text>
        <Text style={styles.metricValue}>
          {currentHeight ? currentHeight.display : 'Not set'}
        </Text>
        <Text style={styles.metricSubtext}>
          {currentHeight ? 'Since last month' : 'Complete onboarding to set'}
        </Text>
      </View>

      {/* Target Height */}
      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>TARGET HEIGHT</Text>
        <Text style={styles.metricValue}>
          {targetHeight ? targetHeight.display : 'Not set'}
        </Text>
        <Text style={styles.metricSubtext}>
          {targetHeight ? 'Your goal' : 'Complete onboarding to set'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  metricLabel: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  metricValue: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricSubtext: {
    color: '#666666',
    fontSize: 12,
  },
});

export default HeightMetrics;
