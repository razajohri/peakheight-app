import { useState, useEffect } from 'react';
import SubscriptionService from '../services/subscriptionService';
import MockSubscriptionService from '../services/mockSubscriptionService';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../config/supabase';

// Toggle this to use mock service for testing
const USE_MOCK_SERVICE = false; // Set to false when ready for production

// Bypass RevenueCat for test users
const BYPASS_USER_IDS = [
  'db497060-1ca7-428f-adcd-7546b72405de', // roman.lakhnyu@gmail.com
  'c8c02575-4351-4953-b04b-3c6c8adbcde2', // usepeakheight@gmail.com
  'a8e234d9-dd05-4d72-9d0b-5cbbfc1022a6', // imeddieking@gmail.com
  'ebb90fe5-eec7-4696-ac61-48432db46e0b', // immujtaba@gmail.com (old ID)
  'b241a0ec-bd7b-46d9-93cf-29ab6a37dde1'  // immujtaba@gmail.com
];

export const useSubscription = () => {
  const { userProfile } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pricingInfo, setPricingInfo] = useState(null);

  useEffect(() => {
    if (userProfile) {
      console.log('useSubscription: User profile loaded, checking subscription status...');
      checkSubscriptionStatus();
      // Skip RevenueCat calls for bypass users
      const isBypassUser = userProfile?.id && BYPASS_USER_IDS.includes(userProfile.id);
      if (!isBypassUser) {
        getPricingInfo();
        setupSubscriptionListener();
      } else {
        console.log('🔓 useSubscription: Bypass user detected, skipping RevenueCat calls');
      }
    }
  }, [userProfile]);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);

      // Check if user is bypass user
      const isBypassUser = userProfile?.id && BYPASS_USER_IDS.includes(userProfile.id);
      
      if (isBypassUser) {
        console.log('🔓 useSubscription: Bypass user detected, checking DB premium_status only');
        // For bypass users, only check database premium_status
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('premium_status')
            .eq('id', userProfile.id)
            .maybeSingle();

          if (!error && userData) {
            const isPremium = !!userData.premium_status;
            setIsSubscribed(isPremium);
            console.log('🔓 useSubscription: Bypass user premium_status from DB:', isPremium);
            setSubscriptionInfo(isPremium ? { status: 'active' } : null);
          } else {
            setIsSubscribed(false);
            setSubscriptionInfo(null);
          }
        } catch (dbError) {
          console.error('useSubscription: Error checking bypass user premium status:', dbError);
          setIsSubscribed(false);
          setSubscriptionInfo(null);
        }
        return;
      }

      if (USE_MOCK_SERVICE) {
        console.log('useSubscription: Using mock service for subscription check');
        const result = await MockSubscriptionService.checkSubscriptionStatus();

        if (result.isSubscribed !== undefined) {
          setIsSubscribed(result.isSubscribed);
          setSubscriptionInfo(MockSubscriptionService.getSubscriptionInfo ? MockSubscriptionService.getSubscriptionInfo(result.customerInfo) : null);
        }
      } else {
        const result = await SubscriptionService.checkSubscriptionStatus();

        if (result.isSubscribed !== undefined) {
          setIsSubscribed(result.isSubscribed);
          setSubscriptionInfo(SubscriptionService.getSubscriptionInfo ? SubscriptionService.getSubscriptionInfo(result.customerInfo) : null);
        }
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      // For mock service, set default values on error
      if (USE_MOCK_SERVICE) {
        setIsSubscribed(false);
        setSubscriptionInfo(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPricingInfo = async () => {
    try {
      // Skip for bypass users
      const isBypassUser = userProfile?.id && BYPASS_USER_IDS.includes(userProfile.id);
      if (isBypassUser) {
        console.log('🔓 useSubscription: Bypass user, skipping pricing info');
        return;
      }
      
      const service = USE_MOCK_SERVICE ? MockSubscriptionService : SubscriptionService;
      const pricing = await service.getPricingInfo();
      setPricingInfo(pricing);
    } catch (error) {
      console.error('Error getting pricing info:', error);
    }
  };

  const setupSubscriptionListener = () => {
    // Skip for bypass users
    const isBypassUser = userProfile?.id && BYPASS_USER_IDS.includes(userProfile.id);
    if (isBypassUser) {
      console.log('🔓 useSubscription: Bypass user, skipping subscription listener');
      return;
    }
    
    if (!USE_MOCK_SERVICE) {
      SubscriptionService.setupSubscriptionListener();
    } else {
      console.log('useSubscription: Using mock service, skipping subscription listener setup');
    }
  };

  const purchaseSubscription = async (planType) => {
    try {
      setLoading(true);
      
      // Block purchases for bypass users
      const isBypassUser = userProfile?.id && BYPASS_USER_IDS.includes(userProfile.id);
      if (isBypassUser) {
        console.log('🔓 useSubscription: Bypass user cannot make purchases through RevenueCat');
        return { success: false, error: 'Bypass users should have premium_status set in database' };
      }
      
      const service = USE_MOCK_SERVICE ? MockSubscriptionService : SubscriptionService;
      const packages = await service.getAvailablePackages();

      if (!packages) {
        throw new Error('No packages available');
      }

      console.log('useSubscription: Available packages:', Object.keys(packages));
      console.log('useSubscription: Plan type:', planType);

      // Handle different package key formats
      let packageToPurchase;
      if (packages[`peakheight_${planType}`]) {
        // Direct package access
        packageToPurchase = packages[`peakheight_${planType}`];
      } else if (planType === 'yearly' && packages.yearly) {
        packageToPurchase = packages.yearly;
      } else if (planType === 'weekly' && packages.weekly) {
        packageToPurchase = packages.weekly;
      } else {
        // Try to find any package with the plan type in the identifier
        const packageKeys = Object.keys(packages);
        const matchingPackage = packageKeys.find(key =>
          key.includes(planType) || packages[key].identifier?.includes(planType)
        );

        if (matchingPackage) {
          packageToPurchase = packages[matchingPackage];
        } else {
          throw new Error(`Package not found for plan: ${planType}. Available packages: ${packageKeys.join(', ')}`);
        }
      }

      if (!packageToPurchase) {
        throw new Error(`Package not found for plan: ${planType}`);
      }

      console.log('useSubscription: Package to purchase:', packageToPurchase.identifier);

      const result = await service.purchasePackage(packageToPurchase);

      if (result.success) {
        console.log('useSubscription: Purchase successful, updating subscription status');
        setIsSubscribed(true);
        setSubscriptionInfo(service.getSubscriptionInfo ? service.getSubscriptionInfo(result.customerInfo) : null);

        // Persist subscription status (for mock service, updates Supabase users table)
        if (typeof service.updateUserSubscriptionStatus === 'function') {
          try {
            await service.updateUserSubscriptionStatus(result.customerInfo);
            console.log('useSubscription: Subscription status persisted successfully');
          } catch (persistError) {
            console.warn('useSubscription: Failed to persist subscription status:', persistError);
          }
        }

        // Force a refresh of subscription status
        setTimeout(() => {
          checkSubscriptionStatus();
        }, 1000);

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
      const service = USE_MOCK_SERVICE ? MockSubscriptionService : SubscriptionService;
      const result = await service.restorePurchases();

      if (result.success) {
        const active = result?.customerInfo?.entitlements?.active || {};
        setIsSubscribed(Object.keys(active).length > 0);
        setSubscriptionInfo(service.getSubscriptionInfo ? service.getSubscriptionInfo(result.customerInfo) : null);
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
