import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
  Animated,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import Icon from '../UI/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import SubscriptionService from '../../services/subscriptionService';
import MockSubscriptionService from '../../services/mockSubscriptionService';

// Toggle this to use mock service for testing
const USE_MOCK_SERVICE = false; // Set to false when ready for production

const { width } = Dimensions.get('window');

const PaywallModal = ({ visible, onClose, onSubscribe, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [pricingInfo, setPricingInfo] = useState(null);
  const [availablePackages, setAvailablePackages] = useState(null);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showSubscriptionInfo, setShowSubscriptionInfo] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const plansModalAnim = useRef(new Animated.Value(0)).current;
  const starRotateAnim = useRef(new Animated.Value(0)).current;

  // Load pricing and packages from RevenueCat
  const loadPricingAndPackages = async () => {
    try {
      setIsLoading(true);
      console.log('PaywallModal: Loading pricing and packages...');

      // Choose service based on USE_MOCK_SERVICE flag
      const service = USE_MOCK_SERVICE ? MockSubscriptionService : SubscriptionService;

      // Initialize service
      await service.initialize();

      // Get available packages
      const packages = await service.getAvailablePackages();
      console.log('PaywallModal: Available packages:', packages);
      console.log('PaywallModal: Package keys:', packages ? Object.keys(packages) : 'null');

      // Debug: Log each package
      if (packages) {
        Object.keys(packages).forEach(key => {
          const pkg = packages[key];
          console.log(`PaywallModal: Package ${key}:`, {
            identifier: pkg.identifier,
            price: pkg.product.priceString,
            productId: pkg.product.identifier
          });
        });
      }

      if (packages && Object.keys(packages).length > 0) {
        setAvailablePackages(packages);
        console.log('PaywallModal: Packages set successfully');
      } else {
        console.log('PaywallModal: No packages found, this might be a RevenueCat configuration issue');
        setAvailablePackages(null);
      }

      // Get pricing info
      const pricing = await service.getPricingInfo();
      console.log('PaywallModal: Pricing info:', pricing);
      setPricingInfo(pricing);

      console.log('PaywallModal: Pricing and packages loaded successfully');
    } catch (error) {
      console.error('PaywallModal: Error loading pricing:', error);
      console.error('PaywallModal: Error details:', error.message);
      // Fallback to default pricing
      setPricingInfo({
        weekly: { price: '$4.99', period: 'week' },
        yearly: { price: '$0.58', weeklyPriceString: '$0.58', period: 'week', totalPrice: '$29.99', isBestDeal: true }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      // Load pricing and packages
      loadPricingAndPackages();

      // Entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation for best deal badge
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Shimmer effect for premium elements
      const shimmerAnimation = Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      shimmerAnimation.start();

      // Floating animation for decorative elements
      const floatingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );
      floatingAnimation.start();
    }
  }, [visible]);

  useEffect(() => {
    if (showPlansModal) {
      Animated.spring(plansModalAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Star rotation animation
      const starAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(starRotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(starRotateAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      starAnimation.start();

      return () => {
        starAnimation.stop();
        starRotateAnim.setValue(0);
      };
    } else {
      plansModalAnim.setValue(0);
      starRotateAnim.setValue(0);
    }
  }, [showPlansModal]);

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

  const getPlans = () => {
    const defaultPlans = {
    yearly: {
      id: 'yearly',
      title: 'PeakHeight Premium Yearly',
      weeklyPrice: '$0.58/week',
      billingDetails: 'billed annually at $29.99',
      length: '1 year',
      price: '$29.99',
      isBestDeal: true,
    },
    weekly: {
      id: 'weekly',
      title: 'PeakHeight Premium Weekly',
      weeklyPrice: '$4.99/week',
      billingDetails: 'billed weekly',
      length: '1 week',
      price: '$4.99',
      isBestDeal: false,
    },
  };

    if (pricingInfo) {
      return {
        yearly: {
          id: 'yearly',
          title: 'PeakHeight Premium Yearly',
          weeklyPrice: `${pricingInfo.yearly?.weeklyPriceString || '$0.58'}/week`,
          billingDetails: `billed annually at ${pricingInfo.yearly?.totalPrice || '$29.99'}`,
          length: '1 year',
          price: pricingInfo.yearly?.totalPrice || '$29.99',
          isBestDeal: pricingInfo.yearly?.isBestDeal || true,
        },
        weekly: {
          id: 'weekly',
          title: 'PeakHeight Premium Weekly',
          weeklyPrice: `${pricingInfo.weekly?.price || '$4.99'}/week`,
          billingDetails: pricingInfo.weekly?.billingPeriod ? `billed ${pricingInfo.weekly.billingPeriod}` : 'billed weekly',
          length: '1 week',
          price: pricingInfo.weekly?.price || '$4.99',
          isBestDeal: pricingInfo.weekly?.isBestDeal || false,
        },
      };
    }

    return defaultPlans;
  };

  const plans = getPlans();

  const handleSubscribe = async () => {
    try {
      setIsPurchasing(true);
      console.log('PaywallModal: Starting purchase for plan:', selectedPlan);
      console.log('PaywallModal: Available packages:', availablePackages);

      // Check if user is authenticated
      const { supabase } = await import('../../config/supabase');
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('PaywallModal: User not authenticated:', userError);
        Alert.alert('Authentication Required', 'Please log in to purchase a subscription.');
        return;
      }

      console.log('PaywallModal: User authenticated:', user.id);

      // Ensure packages are available. Avoid relying on async state update after reload.
      const service = USE_MOCK_SERVICE ? MockSubscriptionService : SubscriptionService;
      let packages = availablePackages;
      if (!packages) {
        console.log('PaywallModal: No packages available, fetching directly from service...');
        packages = await service.getAvailablePackages();
        if (packages) setAvailablePackages(packages);
        if (!packages) {
          Alert.alert('Error', 'Unable to load subscription options. Please try again.');
          return;
        }
      }

      // Get the package to purchase
      const packageIdentifier = selectedPlan === 'yearly' ? 'peakheight_yearly' : 'peakheight_weekly';
      let packageToPurchase = packages[packageIdentifier]
        || packages[selectedPlan] // alias keys like 'weekly' | 'yearly'
        || (selectedPlan === 'yearly' ? packages.yearly : packages.weekly);
      if (!packageToPurchase) {
        Alert.alert('Error', 'Selected plan is not available. Please try again.');
        return;
      }

      console.log('PaywallModal: Purchasing package:', packageToPurchase.identifier);

      // Purchase the package
      console.log('PaywallModal: Attempting purchase...');
      const result = await service.purchasePackage(packageToPurchase);
      console.log('PaywallModal: Purchase result:', result);

      if (result.success) {
        console.log('PaywallModal: Purchase successful');
        Alert.alert(
          'Success!',
          'Your subscription is now active. Welcome to PeakHeight Premium!',
          [{ text: 'Continue', onPress: () => {
            // Navigate directly to main app via onSuccess (purchase already completed)
            if (onSuccess && typeof onSuccess === 'function') {
              onSuccess();
            } else if (onSubscribe) {
              // Fallback to onSubscribe if onSuccess not provided
              onSubscribe({ id: selectedPlan, type: selectedPlan });
            }
          }}]
        );
      } else {
        console.error('PaywallModal: Purchase failed:', result.error);
        Alert.alert('Purchase Failed', result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('PaywallModal: Error during purchase:', error);
      console.error('PaywallModal: Error details:', error.message);
      console.error('PaywallModal: Error stack:', error.stack);
      Alert.alert('Error', `Something went wrong: ${error.message}`);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setIsLoading(true);
      console.log('PaywallModal: Restoring purchases...');

      // Choose service based on USE_MOCK_SERVICE flag
      const service = USE_MOCK_SERVICE ? MockSubscriptionService : SubscriptionService;

      const result = await service.restorePurchases();

      if (result.success && result.customerInfo) {
        // Check if there are actually active subscriptions
        const active = result.customerInfo?.entitlements?.active || {};
        const isSubscribed = Object.keys(active).length > 0;
        
        if (isSubscribed) {
          console.log('PaywallModal: Purchases restored successfully with active subscription');
          Alert.alert(
            'Success!',
            'Your previous purchases have been restored.',
            [{ text: 'Continue', onPress: () => {
              // Navigate directly to main app via onSuccess (purchase already restored)
              if (onSuccess && typeof onSuccess === 'function') {
                onSuccess();
              } else if (onSubscribe) {
                // Fallback to onSubscribe if onSuccess not provided
                onSubscribe();
              }
            }}]
          );
        } else {
          console.log('PaywallModal: No active subscriptions found after restore');
          Alert.alert('No Active Subscription', 'No active subscription was found. Please subscribe to access premium features.');
        }
      } else {
        console.log('PaywallModal: No purchases to restore');
        Alert.alert('No Purchases Found', 'No previous purchases were found to restore.');
      }
    } catch (error) {
      console.error('PaywallModal: Error restoring purchases:', error);
      Alert.alert('Error', 'Unable to restore purchases. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isPurchasing) {
      return 'Processing...';
    }

    return 'Unlock PeakHeight Premium!';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.content}>
          {/* Height Growth Visualization */}
          <View style={styles.heightVisualizationContainer}>
            <View style={styles.heightProgression}>
              {/* Three progressively taller person icons */}
              <Animated.View
                style={[
                  styles.heightIcon,
                  styles.heightIcon1,
                  {
                    opacity: fadeAnim,
                  },
                ]}
              >
                <Icon name="body" size={32} color="#4CAF50" />
                <View style={styles.heightMarker}>
                  <Text style={styles.heightLabel}>Month 1</Text>
                </View>
              </Animated.View>
              
              {/* Arrow */}
              <View style={styles.arrowContainer}>
                <Icon name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
              
              <Animated.View
                style={[
                  styles.heightIcon,
                  styles.heightIcon2,
                  {
                    opacity: fadeAnim,
                  },
                ]}
              >
                <Icon name="body" size={58} color="#4CAF50" />
                <View style={styles.heightMarker}>
                  <Text style={styles.heightLabel}>Month 3</Text>
                </View>
              </Animated.View>
              
              {/* Arrow */}
              <View style={styles.arrowContainer}>
                <Icon name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
              
              <Animated.View
                style={[
                  styles.heightIcon,
                  styles.heightIcon3,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: floatingAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -6],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Icon name="body" size={82} color="#4CAF50" />
                <View style={[styles.heightMarker, styles.heightMarkerHighlight]}>
                  <Text style={[styles.heightLabel, { color: '#FFFFFF' }]}>Month 6</Text>
                </View>
              </Animated.View>
            </View>
          </View>

          {/* Headline Section */}
          <View style={styles.headlineSection}>
            <Text style={styles.headline}>Reach Your Peak Height             With Our Daily Plan</Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresCard}>
            <Text style={styles.featuresHeadline}>What do I get?</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureCheckbox}>
                  <Icon name="checkmark" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>Science backed Peak Height plan</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureCheckbox}>
                  <Icon name="checkmark" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>Nutrition plan for maximum growth</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureCheckbox}>
                  <Icon name="checkmark" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>Private community</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureCheckbox}>
                  <Icon name="checkmark" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>24/7 growth coach</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureCheckbox}>
                  <Icon name="checkmark" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>AI powered food scanner</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureCheckbox}>
                  <Icon name="checkmark" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>Personalized exercise plan</Text>
              </View>
            </View>
          
          </View>


          {/* Subscribe Button */}
        <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={() => setShowPlansModal(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F0F0F0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.subscribeButtonGradient}
                >
                  <Text style={styles.subscribeButtonText}>{getButtonText()}</Text>
                </LinearGradient>
              </TouchableOpacity>

                {/* Restore Purchases Button */}
                <TouchableOpacity
                  style={styles.restoreButton}
                  onPress={handleRestorePurchases}
                  disabled={isPurchasing || isLoading}
                >
                  <Text style={styles.restoreButtonText}>Restore Purchases</Text>
                </TouchableOpacity>

                {/* Subscription Information */}
                <View style={styles.subscriptionInfoContainer}>
                  <View style={styles.subscriptionInfoBox}>
                    {/* Terms and Privacy Policy */}
                    <View style={styles.termsContainer}>
                      <TouchableOpacity 
                        onPress={() => setShowSubscriptionInfo(!showSubscriptionInfo)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.termsLink}>Subscriptions</Text>
                      </TouchableOpacity>
                      <Text style={styles.termsSeparator}> • </Text>
                      <TouchableOpacity onPress={async () => {
                        try {
                          await Linking.openURL('https://usepeakheight.netlify.app/terms');
                        } catch (error) {
                          console.error('Error opening Terms of Service:', error);
                        }
                      }}>
                        <Text style={styles.termsLink}>Terms of Service</Text>
                      </TouchableOpacity>
                      <Text style={styles.termsSeparator}> • </Text>
                      <TouchableOpacity onPress={async () => {
                        try {
                          await Linking.openURL('https://usepeakheight.netlify.app/privacy');
                        } catch (error) {
                          console.error('Error opening Privacy Policy:', error);
                        }
                      }}>
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                      </TouchableOpacity>
                    </View>
                    {showSubscriptionInfo && (
                      <Text style={styles.subscriptionInfoText}>
                        Auto-renewable subscription. Cancel anytime in Settings.
                      </Text>
                    )}
                  </View>
                </View>
        </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>

      {/* Plans Selection Modal */}
      <Modal
        visible={showPlansModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPlansModal(false)}
      >
        <View style={styles.plansModalOverlay}>
          <TouchableOpacity
            style={styles.plansModalBackdrop}
            activeOpacity={1}
            onPress={() => setShowPlansModal(false)}
          />
          <Animated.View
            style={[
              styles.plansModalContent,
              {
                transform: [
                  {
                    scale: plansModalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.92, 1],
                    }),
                  },
                  {
                    translateY: plansModalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
                opacity: plansModalAnim,
              },
            ]}
          >
            {/* Modal Header with gradient background */}
            <LinearGradient
              colors={['rgba(76, 175, 80, 0.1)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.plansModalHeaderGradient}
            >
              <View style={styles.plansModalHeader}>
                <View style={styles.plansModalTitleContainer}>
                  <Text style={styles.plansModalTitle}>Choose Your Plan</Text>
                  <Text style={styles.plansModalSubtitle}>Select the perfect plan for your journey</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowPlansModal(false)}
                  style={styles.plansModalCloseButton}
                  activeOpacity={0.7}
                >
                  <View style={styles.plansModalCloseButtonInner}>
                    <Icon name="close-circle" size={20} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={styles.plansModalBody}>
              <ScrollView 
                style={styles.plansModalScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.plansModalScrollContent}
                nestedScrollEnabled={true}
              >
                <View style={styles.plansModalPlansContainer}>
                  {Object.values(plans).length > 0 ? Object.values(plans).map((plan, index) => (
                    <View
                      key={plan.id}
                      style={styles.planCardWrapper}
                    >
                      <TouchableOpacity
                        style={[
                          styles.plansModalPlanCard,
                          selectedPlan === plan.id && styles.selectedPlanCardModal,
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setSelectedPlan(plan.id);
                        }}
                        activeOpacity={0.9}
                      >
                        {plan.isBestDeal && (
                          <Animated.View 
                            style={[
                              styles.bestDealBadgeModal,
                              {
                                transform: [
                                  {
                                    scale: pulseAnim.interpolate({
                                      inputRange: [0, 1, 2],
                                      outputRange: [1, 1.05, 1],
                                    }),
                                  },
                                ],
                              },
                            ]}
                          >
                           <LinearGradient
                             colors={['#FFFFFF', '#F5F5F5', '#FFFFFF']}
                             start={{ x: 0, y: 0 }}
                             end={{ x: 1, y: 0 }}
                             style={styles.bestDealGradientModal}
                           >
                             <Animated.View
                               style={{
                                 transform: [
                                   {
                                     rotate: starRotateAnim.interpolate({
                                       inputRange: [0, 1],
                                       outputRange: ['0deg', '360deg'],
                                     }),
                                   },
                                   {
                                     scale: starRotateAnim.interpolate({
                                       inputRange: [0, 0.5, 1],
                                       outputRange: [1, 1.2, 1],
                                     }),
                                   },
                                 ],
                               marginRight: 4,
                               marginLeft: -2,
                               marginTop: -1,
                               marginBottom: -1,
                               width: 16,
                               height: 16,
                               alignItems: 'center',
                               justifyContent: 'center',
                             }}
                             >
                               <Icon name="star" size={14} color="#FFD700" />
                             </Animated.View>
                             <Text style={styles.bestDealTextModal}>BEST DEAL</Text>
                           </LinearGradient>
                          </Animated.View>
                        )}
                        {plan.id === 'yearly' && (
                          <View style={styles.discountBadgeModal}>
                            <LinearGradient
                              colors={['#FF6B6B', '#FF5252']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.discountBadgeGradient}
                            >
                              <Text style={styles.discountBadgeText}>88% OFF</Text>
                            </LinearGradient>
                          </View>
                        )}

                        <View style={styles.planContentModal}>
                          <View style={styles.planHeaderModal}>
                            <View style={styles.planTitleContainer}>
                              <Text style={styles.planTitleModal}>{plan.title}</Text>
                              {selectedPlan === plan.id && (
                                <View style={styles.selectedIndicatorWhite}>
                                  <View style={styles.selectedIndicatorInnerWhite} />
                                </View>
                              )}
                            </View>
                            <View style={[
                              styles.checkboxContainerModal,
                              selectedPlan === plan.id && styles.checkboxContainerSelected,
                            ]}>
                              {selectedPlan === plan.id ? (
                                <View style={styles.checkedBoxModalWhite}>
                                  <Icon name="checkmark" size={12} color="#000000" />
                                </View>
                              ) : (
                                <View style={styles.uncheckedBoxModal} />
                              )}
                            </View>
                          </View>

                          <View style={styles.priceContainerModal}>
                            <Text style={styles.weeklyPriceModal}>{plan.weeklyPrice}</Text>
                            <Text style={styles.billingDetailsModal} numberOfLines={2} adjustsFontSizeToFit={true}>
                              {plan.billingDetails}
                            </Text>
                          </View>
                          </View>
                        </TouchableOpacity>
                    </View>
                  )) : (
                    <View style={styles.noPlansContainer}>
                      <Text style={styles.noPlansText}>Loading plans...</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>

            <View style={styles.plansModalFooter}>
              <TouchableOpacity
                style={[styles.plansModalSubscribeButton, isPurchasing && styles.subscribeButtonDisabled]}
                onPress={handleSubscribe}
                disabled={isPurchasing || isLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={isPurchasing ? ['#666666', '#555555'] : ['#FFFFFF', '#F5F5F5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.subscribeButtonGradientModal}
                >
                  {isPurchasing ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#000000" />
                      <Text style={[styles.subscribeButtonTextModal, { marginLeft: 10 }]}>Processing...</Text>
                    </View>
                  ) : (
                     <Text style={styles.subscribeButtonTextModal}>Subscribe & Get Access!</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 65 : 45,
    backgroundColor: '#000000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  // Height Growth Visualization
  heightVisualizationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#0A0A0A',
    borderRadius: 28,
    marginHorizontal: -4,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  heightProgression: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 120,
    position: 'relative',
    paddingHorizontal: 16,
  },
  heightIcon: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  heightIcon1: {
    marginBottom: 5,
  },
  heightIcon2: {
    marginBottom: 0,
  },
  heightIcon3: {
    marginBottom: -5,
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  heightMarker: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  heightMarkerHighlight: {
    backgroundColor: '#4CAF50',
    borderWidth: 0,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 8,
  },
  flameIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  heightLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heightLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameIcon: {
    marginLeft: 4,
  },
  // Headline Section
  headlineSection: {
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subHeadline: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.2,
    marginTop: 4,
  },

  // Features Section
  featuresContainer: {
    marginBottom: 20,
    marginTop: 8,
  },
  featuresCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 20,
    marginTop: 0,
    overflow: 'hidden',
  },
  featuresHeadline: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  featuresList: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  featureText: {
    fontSize: 13,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: 0.1,
  },

  // Plans Section
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  planCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    marginHorizontal: 6,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedPlanCard: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  bestDealBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -50,
    zIndex: 1,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  bestDealGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
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
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  checkedBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  uncheckedBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
  },
  weeklyPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  billingDetails: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    flexShrink: 1,
    lineHeight: 16,
  },
  savingsBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  savingsText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Subscription Information
  subscriptionInfoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 4,
  },
  subscriptionInfoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionInfoText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 6,
    paddingHorizontal: 4,
  },

  // Terms and Privacy Policy
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  termsText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  termsLink: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    textDecorationLine: 'underline',
  },
  termsSeparator: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
  },

  // Button Section
  buttonContainer: {
    marginBottom: 20,
    marginTop: 0,
  },
  subscribeButton: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  subscribeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    minHeight: 56,
  },
  subscribeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreButton: {
    marginTop: 2,
    paddingVertical: 4,
  },
  restoreButtonText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

  // Plans Modal
  plansModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plansModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  plansModalContent: {
    backgroundColor: '#0A0A0A',
    borderRadius: 24,
    width: '95%',
    maxWidth: 480,
    maxHeight: '90%',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.9,
    shadowRadius: 50,
    elevation: 25,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  plansModalHeaderGradient: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  plansModalBody: {
    height: 320,
  },
  planCardWrapper: {
    marginBottom: 0,
  },
  plansModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  plansModalTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  plansModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 4,
    lineHeight: 26,
  },
  plansModalSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  plansModalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plansModalCloseButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  plansModalScrollView: {
    flex: 1,
  },
  plansModalScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 12,
  },
  plansModalPlansContainer: {
    marginBottom: 2,
    overflow: 'visible',
  },
  noPlansContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPlansText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
  },
  plansModalPlanCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    position: 'relative',
    marginBottom: 10,
    marginTop: 8,
    minHeight: 85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'visible',
  },
  selectedPlanCardModal: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  selectedGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 26,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    zIndex: -1,
  },
  bestDealBadgeModal: {
    position: 'absolute',
    top: -14,
    left: '50%',
    marginLeft: -50,
    zIndex: 100,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  bestDealGradientModal: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    paddingLeft: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestDealTextModal: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  discountBadgeModal: {
    position: 'absolute',
    top: -12,
    right: 16,
    zIndex: 1,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  discountBadgeGradient: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  planContentModal: {
    marginTop: 2,
  },
  planHeaderModal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  planTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  planTitleModal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.1,
    flex: 1,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginLeft: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedIndicatorInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  selectedIndicatorWhite: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginLeft: 10,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedIndicatorInnerWhite: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  checkboxContainerModal: {
    marginLeft: 12,
  },
  checkboxContainerSelected: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  checkedBoxModal: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  checkedBoxModalWhite: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  uncheckedBoxModal: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'transparent',
  },
  priceContainerModal: {
    alignItems: 'flex-start',
  },
  weeklyPriceModal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  billingDetailsModal: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 13,
    fontWeight: '500',
  },
  plansModalFooter: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  plansModalSubscribeButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeButtonGradientModal: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    minHeight: 48,
  },
  subscribeButtonTextModal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },

});

export default PaywallModal;


