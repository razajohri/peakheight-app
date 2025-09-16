import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import AICoachModal from '../AI/AICoachModal';

const AICoachWidget = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/* AI Coach Widget Button */}
      <TouchableOpacity
        style={styles.coachWidget}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
        activeOpacity={0.8}
      >
        <View style={styles.coachIconContainer}>
          <Icon name="chatbubble-ellipses" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.coachTextContainer}>
          <Text style={styles.coachTitle}>AI Coach</Text>
          <Text style={styles.coachSubtitle}>Chat with your coach</Text>
        </View>
        <Icon name="chevron-forward" size={16} color="#666666" />
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignSelf: 'stretch'
  },
  coachIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coachTextContainer: {
    flex: 1,
  },
  coachTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  coachSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
});

export default AICoachWidget;
