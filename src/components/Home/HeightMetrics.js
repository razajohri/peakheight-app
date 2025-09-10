import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HeightMetrics = () => {
  return (
    <View style={styles.metricsRow}>
      {/* Current Height */}
      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>CURRENT HEIGHT</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricValue}>5'10"</Text>
          <View style={styles.trendContainer}>
            <Icon name="arrow-up" size={14} color="#4CD964" />
            <Text style={styles.trendPositive}>+0.5 in</Text>
          </View>
        </View>
        <Text style={styles.metricSubtext}>Since last month</Text>
      </View>

      {/* Predicted Height */}
      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>PREDICTED HEIGHT</Text>
        <Text style={styles.metricValue}>5'11" - 6'2"</Text>
        <Text style={styles.metricSubtext}>Based on your data</Text>
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
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricValue: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendPositive: {
    color: '#4CD964',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  metricSubtext: {
    color: '#666666',
    fontSize: 12,
  },
});

export default HeightMetrics;
