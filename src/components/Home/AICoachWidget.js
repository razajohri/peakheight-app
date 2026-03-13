import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';
import * as Haptics from 'expo-haptics';
import AICoachModal from '../AI/AICoachModal';

const AICoachWidget = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.coachWidget}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#000000', '#1a1a1a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.coachGradient}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F0F0F0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.coachIconContainer}
          >
            <Icon name="body" size={Platform.OS === 'ios' ? 28 : 24} color="#000000" />
          </LinearGradient>
          <View style={styles.coachTextContainer}>
            <Text style={styles.coachTitle}>Coach Jacob</Text>
            <Text style={styles.coachSubtitle}>Talk to your personal AI height coach</Text>
          </View>
          <View style={styles.chevronContainer}>
            <Icon name="chevron-forward" size={16} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* AI Coach Modal */}
      <AICoachModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  coachWidget: {
    marginTop: 0,
    marginBottom: 16,
    alignSelf: 'stretch',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  coachGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? 18 : 16,
    paddingVertical: Platform.OS === 'ios' ? 18 : 14,
  },
  coachIconContainer: {
    width: Platform.OS === 'ios' ? 50 : 43,
    height: Platform.OS === 'ios' ? 50 : 43,
    borderRadius: Platform.OS === 'ios' ? 25 : 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'ios' ? 14 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  coachTextContainer: {
    flex: 1,
  },
  coachTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Platform.OS === 'ios' ? 4 : 3,
    letterSpacing: -0.2,
  },
  coachSubtitle: {
    fontSize: Platform.OS === 'ios' ? 12 : 11,
    color: '#CCCCCC',
    fontWeight: '500',
    lineHeight: Platform.OS === 'ios' ? 16 : 15,
  },
  chevronContainer: {
    padding: 5,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AICoachWidget;
