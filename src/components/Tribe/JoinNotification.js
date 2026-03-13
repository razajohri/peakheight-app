import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JoinNotification = ({ userName }) => {
  return (
    <View style={styles.container}>
      <View style={styles.notificationBar}>
        <Text style={styles.notificationText}>
          <Text style={styles.userName}>{userName}</Text>
          {' '}just joined peak-height
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  notificationBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    maxWidth: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  userName: {
    fontWeight: '600',
    color: '#555555',
  },
});

export default JoinNotification;

