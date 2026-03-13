import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../UI/Icon';
import * as Haptics from 'expo-haptics';
import AICoachModal from './AICoachModal';

const AICoachIcon = ({
  size = 24,
  color = '#3B5FE3',
  style = {},
  showModal = true
}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (showModal) {
      setModalVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.iconContainer, style]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Icon name="chatbubble-ellipses" size={size} color={color} />
      </TouchableOpacity>

      {showModal && (
        <AICoachModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
});

export default AICoachIcon;
