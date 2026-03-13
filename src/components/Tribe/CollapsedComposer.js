import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Icon from '../UI/Icon';

export default function CollapsedComposer({ styles, onOpen }) {
  return (
    <TouchableOpacity style={styles.collapsedComposer} onPress={onOpen}>
      <View style={localStyles.row}>
        <Icon name="create-outline" size={15} color="#9CA3AF" />
        <Text style={[styles.collapsedComposerText, localStyles.text]}>
          What's on your mind?
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
  },
});


