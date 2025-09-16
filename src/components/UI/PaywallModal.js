import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const PaywallModal = ({ visible, onClose, onSubscribe }) => {
  const handleClose = () => {
    try {
      console.log('PaywallModal: handleClose called');
      console.log('PaywallModal: onClose type:', typeof onClose);

      if (onClose && typeof onClose === 'function') {
        console.log('PaywallModal: Calling onClose function');
        onClose();
        console.log('PaywallModal: onClose function executed successfully');
      } else {
        console.log('PaywallModal: onClose function not provided or not a function');
      }
    } catch (error) {
      console.error('PaywallModal: Error closing paywall modal:', error);
      console.error('PaywallModal: Error stack:', error.stack);
    }
  };
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const plans = {
    yearly: {
      id: 'yearly',
      title: 'YEARLY',
      weeklyPrice: '$0.58/week',
      billingDetails: 'billed annually at $29.99',
      isBestDeal: true,
    },
    weekly: {
      id: 'weekly',
      title: 'WEEKLY',
      weeklyPrice: '$4.99/week',
      billingDetails: 'billed weekly',
      isBestDeal: false,
    },
  };

  const handleSubscribe = () => {
    const plan = plans[selectedPlan];
    onSubscribe(plan);
  };

  const getButtonText = () => {
    if (selectedPlan === 'yearly') {
      return 'Start Annual Plan - $0.58/week';
    } else {
      return 'Start Weekly Plan - $4.99/week';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Choose Your Plan</Text>
            <Text style={styles.subtitle}>
              Start your height growth journey today
            </Text>
          </View>

          {/* Plans Section */}
          <View style={styles.plansContainer}>
            {Object.values(plans).map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.selectedPlanCard,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                {plan.isBestDeal && (
                  <View style={styles.bestDealBadge}>
                    <Text style={styles.bestDealText}>BEST DEAL</Text>
                  </View>
                )}

                <View style={styles.planContent}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planTitle}>{plan.title}</Text>
                    <View style={styles.checkboxContainer}>
                      {selectedPlan === plan.id ? (
                        <View style={styles.checkedBox}>
                          <Icon name="checkmark" size={16} color="#000000" />
                        </View>
                      ) : (
                        <View style={styles.uncheckedBox} />
                      )}
                    </View>
                  </View>

                  <Text style={styles.weeklyPrice}>{plan.weeklyPrice}</Text>
                  <Text style={styles.billingDetails}>{plan.billingDetails}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>


          {/* Subscribe Button */}
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>{getButtonText()}</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Terms of Service • Privacy Policy</Text>

            {/* Skip button for testing */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleClose}
            >
              <Text style={styles.skipButtonText}>Skip for now (Testing)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 16,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPlanCard: {
    borderColor: '#FFFFFF',
    backgroundColor: '#2A2A2A',
  },
  bestDealBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -40,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  bestDealText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planContent: {
    alignItems: 'center',
    marginTop: 8,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  checkboxContainer: {
    marginLeft: 8,
  },
  checkedBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckedBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  weeklyPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  billingDetails: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 16,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666666',
    textDecorationLine: 'underline',
  },
});

export default PaywallModal;
