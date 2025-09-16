import React from 'react';
import { View, StyleSheet } from 'react-native';
import PaywallModal from '../components/UI/PaywallModal';
import { useSubscription } from '../hooks/useSubscription';

const PaywallScreen = ({ onSuccess, onBack }) => {
  const { purchaseSubscription } = useSubscription();

  const handleSubscribe = async (plan) => {
    try {
      const result = await purchaseSubscription(plan.id);
      if (result.success) {
        // Navigate to main app or show success message
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        } else {
          console.log('onSuccess not available, subscription successful');
        }
      } else {
        // Handle error
        console.error('Subscription failed:', result.error);
      }
    } catch (error) {
      console.error('Error during subscription:', error);
    }
  };

  const handleClose = () => {
    // You might want to show an exit confirmation or just close
    try {
      if (onBack && typeof onBack === 'function') {
        onBack();
      } else {
        console.log('onBack not available, closing modal');
      }
    } catch (error) {
      console.error('Error closing paywall:', error);
    }
  };

  return (
    <View style={styles.container}>
      <PaywallModal
        visible={true}
        onClose={handleClose}
        onSubscribe={handleSubscribe}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default PaywallScreen;
