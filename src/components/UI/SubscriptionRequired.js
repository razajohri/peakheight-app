import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import PaywallModal from './PaywallModal';
import { useSubscription } from '../../hooks/useSubscription';

const SubscriptionRequired = ({ children, feature = 'this feature' }) => {
  const [showPaywall, setShowPaywall] = useState(false);
  const { isSubscribed, purchaseSubscription } = useSubscription();

  // If user is subscribed, show the content
  if (isSubscribed) {
    return children;
  }

  // If not subscribed, show subscription required message
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>

        <Text style={styles.title}>Premium Required</Text>
        <Text style={styles.message}>
          You need a subscription to access {feature}
        </Text>

        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={() => setShowPaywall(true)}
        >
          <Text style={styles.subscribeButtonText}>Choose Your Plan</Text>
        </TouchableOpacity>
      </View>

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSubscribe={async (plan) => {
          const result = await purchaseSubscription(plan.id);
          if (result.success) {
            setShowPaywall(false);
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  lockIcon: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  subscribeButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default SubscriptionRequired;
