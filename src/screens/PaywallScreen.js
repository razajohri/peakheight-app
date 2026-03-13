import React from 'react';
import { View, StyleSheet } from 'react-native';
import PaywallModal from '../components/UI/PaywallModal';
import { useSubscription } from '../hooks/useSubscription';

const PaywallScreen = ({ onSuccess, onBack }) => {
  const { purchaseSubscription } = useSubscription();

  const handleSubscribe = async (plan) => {
    try {
      console.log('💳 Starting subscription purchase for plan:', plan);
      console.log('💳 Plan object:', JSON.stringify(plan, null, 2));

      // Extract plan type from plan object
      let planType = 'yearly'; // Default to yearly

      if (plan && typeof plan === 'object') {
        if (plan.id) {
          planType = plan.id;
        } else if (plan.type) {
          planType = plan.type;
        } else if (plan.identifier) {
          // Extract from identifier like 'peakheight_yearly'
          planType = plan.identifier.includes('weekly') ? 'weekly' : 'yearly';
        }
      } else if (typeof plan === 'string') {
        planType = plan;
      }

      console.log('💳 Resolved plan type:', planType);
      const result = await purchaseSubscription(planType);

      if (result.success) {
        console.log('✅ Subscription purchase successful - navigating to main app');
        // Navigate to main app immediately after successful payment
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        } else {
          console.log('onSuccess not available, subscription successful');
        }
      } else {
        // Handle error
        console.error('❌ Subscription failed:', result.error);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('❌ Error during subscription:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error stack:', error.stack);
      // You might want to show an error message to the user here
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
        onSuccess={onSuccess}
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
