import { useState, useEffect } from 'react';
import SubscriptionService from '../services/subscriptionService';
import { useUser } from '../contexts/UserContext';

export const useSubscription = () => {
  const { userProfile } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pricingInfo, setPricingInfo] = useState(null);

  useEffect(() => {
    if (userProfile) {
      checkSubscriptionStatus();
      getPricingInfo();
      setupSubscriptionListener();
    }
  }, [userProfile]);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const result = await SubscriptionService.checkSubscriptionStatus();

      if (result.success) {
        setIsSubscribed(result.isSubscribed);
        setSubscriptionInfo(SubscriptionService.getSubscriptionInfo(result.customerInfo));
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPricingInfo = async () => {
    try {
      const pricing = await SubscriptionService.getPricingInfo();
      setPricingInfo(pricing);
    } catch (error) {
      console.error('Error getting pricing info:', error);
    }
  };

  const setupSubscriptionListener = () => {
    SubscriptionService.setupSubscriptionListener();
  };

  const purchaseSubscription = async (planType) => {
    try {
      setLoading(true);
      const packages = await SubscriptionService.getAvailablePackages();

      if (!packages) {
        throw new Error('No packages available');
      }

      const packageToPurchase = planType === 'yearly' ? packages.yearly : packages.weekly;

      if (!packageToPurchase) {
        throw new Error(`Package not found for plan: ${planType}`);
      }

      const result = await SubscriptionService.purchasePackage(packageToPurchase);

      if (result.success) {
        setIsSubscribed(true);
        setSubscriptionInfo(SubscriptionService.getSubscriptionInfo(result.customerInfo));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setLoading(true);
      const result = await SubscriptionService.restorePurchases();

      if (result.success) {
        setIsSubscribed(!result.customerInfo.entitlements.active.isEmpty);
        setSubscriptionInfo(SubscriptionService.getSubscriptionInfo(result.customerInfo));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    isSubscribed,
    subscriptionInfo,
    loading,
    pricingInfo,
    purchaseSubscription,
    restorePurchases,
    checkSubscriptionStatus,
  };
};
