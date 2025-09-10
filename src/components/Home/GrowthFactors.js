import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const GrowthFactors = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const factors = [
    {
      name: 'Sleep Quality',
      value: 85,
      icon: 'moon',
      color: '#4CD964',
      trend: 'up'
    },
    {
      name: 'Nutrition',
      value: 65,
      icon: 'nutrition',
      color: '#3B5FE3',
      trend: null
    },
    {
      name: 'Exercise',
      value: 78,
      icon: 'fitness',
      color: '#4CD964',
      trend: 'up'
    },
    {
      name: 'Posture',
      value: 58,
      icon: 'body',
      color: '#FF3B30',
      trend: 'down'
    }
  ];

  const renderFactorItem = (factor) => (
    <View key={factor.name} style={styles.factorItem}>
      <View style={styles.factorIconContainer}>
        <Icon name={factor.icon} size={16} color="#000000" />
      </View>
      <View style={styles.factorContent}>
        <View style={styles.factorLabelRow}>
          <Text style={styles.factorLabel}>{factor.name}</Text>
          <View style={styles.factorValueContainer}>
            {factor.trend && (
              <Icon
                name={factor.trend === 'up' ? 'arrow-up' : 'arrow-down'}
                size={12}
                color={factor.trend === 'up' ? '#4CD964' : '#FF3B30'}
              />
            )}
            <Text style={[
              styles.factorValue,
              factor.trend === 'down' && { color: '#FF3B30' }
            ]}>
              {factor.value}%
            </Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[
            styles.progressBar,
            {
              width: `${factor.value}%`,
              backgroundColor: factor.color
            }
          ]} />
        </View>
      </View>
    </View>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.factorsSection}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MAIN GROWTH FACTORS</Text>
          <Text style={styles.chevronIcon}>›</Text>
        </View>

        {factors.map(renderFactorItem)}
      </TouchableOpacity>

      {/* Growth Factors Modal */}
      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Growth Factors Analysis</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <Icon name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* Sleep Quality */}
            <View style={styles.factorDetail}>
              <View style={styles.factorHeader}>
                <View style={styles.factorIconContainer}>
                  <Icon name="moon" size={24} color="#4CD964" />
                </View>
                <View style={styles.factorInfo}>
                  <Text style={styles.factorName}>Sleep Quality</Text>
                  <Text style={styles.factorScore}>85%</Text>
                </View>
              </View>
              <View style={styles.factorProgress}>
                <View style={[styles.factorProgressBar, { width: '85%', backgroundColor: '#4CD964' }]} />
              </View>
              <Text style={styles.factorTip}>
                7-9 hours of quality sleep is mandatory for growth hormone production.
              </Text>
            </View>

            {/* Nutrition */}
            <View style={styles.factorDetail}>
              <View style={styles.factorHeader}>
                <View style={styles.factorIconContainer}>
                  <Icon name="nutrition" size={24} color="#3B5FE3" />
                </View>
                <View style={styles.factorInfo}>
                  <Text style={styles.factorName}>Nutrition</Text>
                  <Text style={styles.factorScore}>65%</Text>
                </View>
              </View>
              <View style={styles.factorProgress}>
                <View style={[styles.factorProgressBar, { width: '65%', backgroundColor: '#3B5FE3' }]} />
              </View>
              <Text style={styles.factorTip}>
                Balanced protein, calcium, and vitamin D are essential for bone growth.
              </Text>
            </View>

            {/* Exercise */}
            <View style={styles.factorDetail}>
              <View style={styles.factorHeader}>
                <View style={styles.factorIconContainer}>
                  <Icon name="fitness" size={24} color="#4CD964" />
                </View>
                <View style={styles.factorInfo}>
                  <Text style={styles.factorName}>Exercise</Text>
                  <Text style={styles.factorScore}>78%</Text>
                </View>
              </View>
              <View style={styles.factorProgress}>
                <View style={[styles.factorProgressBar, { width: '78%', backgroundColor: '#4CD964' }]} />
              </View>
              <Text style={styles.factorTip}>
                Regular stretching and strength training stimulate bone growth.
              </Text>
            </View>

            {/* Posture */}
            <View style={styles.factorDetail}>
              <View style={styles.factorHeader}>
                <View style={styles.factorIconContainer}>
                  <Icon name="body" size={24} color="#FF3B30" />
                </View>
                <View style={styles.factorInfo}>
                  <Text style={styles.factorName}>Posture</Text>
                  <Text style={[styles.factorScore, { color: '#FF3B30' }]}>58%</Text>
                </View>
              </View>
              <View style={styles.factorProgress}>
                <View style={[styles.factorProgressBar, { width: '58%', backgroundColor: '#FF3B30' }]} />
              </View>
              <Text style={styles.factorTip}>
                Proper posture can add 1-2 inches to your apparent height.
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  factorsSection: {
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  chevronIcon: {
    color: '#AAAAAA',
    fontSize: 20,
    fontWeight: 'bold',
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  factorIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  factorContent: {
    flex: 1,
  },
  factorLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  factorLabel: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  factorValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factorValue: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '92%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    maxHeight: '82%',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  factorDetail: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  factorInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  factorName: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  factorScore: {
    color: '#4CD964',
    fontSize: 18,
    fontWeight: '700',
  },
  factorProgress: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginBottom: 10,
  },
  factorProgressBar: {
    height: 6,
    borderRadius: 3,
  },
  factorTip: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default GrowthFactors;
