import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function CollapsedComposer({ styles, onOpen }) {
  return (
    <TouchableOpacity style={styles.collapsedComposer} onPress={onOpen}>
      <Text style={styles.collapsedComposerText}>What's on your height journey?</Text>
    </TouchableOpacity>
  );
}


