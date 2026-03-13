import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';
import { API_KEYS } from '../config/apiKeys';

class SubscriptionService {
  // RevenueCat product IDs - these should match your RevenueCat dashboard
  static PRODUCT_IDS = {
    WEEKLY: 'peakheight_weekly',
    YEARLY: 'peakheight_yearly',
  };

  // RevenueCat offering IDs (platform-specific)
  static OFFERING_ID_IOS = 'ofrngff99167560'; // iOS offering ID
  static OFFERING_ID_ANDROID = 'ofrng13ceca941c'; // Android offering ID (default)
  static OFFERING_ID = Platform.OS === 'ios' ? 'ofrngff99167560' : 'ofrng13ceca941c';

  // Track initialization status
  static initialized = false;

  // Initialize RevenueCat
  static async initialize() {
    try {
      // Skip if already initialized
      if (this.initialized) {
        console.log('SubscriptionService: Already initialized, skipping...');
        return;
      }

      console.log('SubscriptionService: Initializing RevenueCat...');

      // Get platform-specific RevenueCat API key
      const apiKey = Platform.OS === 'ios' 
        ? API_KEYS.REVENUECAT_API_KEY_IOS 
        : API_KEYS.REVENUECAT_API_KEY_ANDROID;

      if (!apiKey || apiKey === 'YOUR_REVENUECAT_API_KEY' || apiKey === 'YOUR_ANDROID_API_KEY_HERE') {
        const platform = Platform.OS === 'ios' ? 'iOS' : 'Android';
        throw new Error(`RevenueCat ${platform} API key not configured. Please set EXPO_PUBLIC_REVENUECAT_API_KEY_${platform.toUpperCase()} in your environment variables.`);
      }

      console.log(`SubscriptionService: Using ${Platform.OS} API key:`, apiKey.substring(0, 10) + '...');

      // Enable debug logging
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

      await Purchases.configure({ apiKey });
      this.initialized = true;
      console.log('SubscriptionService: RevenueCat configured successfully');

      // Log in user if authenticated
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await Purchases.logIn(user.id);
          console.log('SubscriptionService: User logged into RevenueCat');
        }
      } catch (authError) {
        console.log('SubscriptionService: No authenticated user, skipping login');
      }
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
      this.initialized = false;
      throw error;
    }
  }

  // Log user into RevenueCat (call after authentication)
  static async logUserIntoRevenueCat(userId) {
    try {
      if (!this.initialized) {
        console.log('SubscriptionService: RevenueCat not initialized, initializing first...');
        await this.initialize();
      }

      console.log('SubscriptionService: Logging user into RevenueCat:', userId);
      const { customerInfo } = await Purchases.logIn(userId);
      console.log('SubscriptionService: User successfully logged into RevenueCat');
      
      // Update subscription status in database
      await this.updateUserSubscriptionStatus(customerInfo);
      
      return customerInfo;
    } catch (error) {
      console.error('Error logging user into RevenueCat:', error);
      throw error;
    }
  }

  // Log user out of RevenueCat (call before logout)
  static async logUserOutOfRevenueCat() {
    try {
      if (!this.initialized) {
        console.log('SubscriptionService: RevenueCat not initialized, skipping logout');
        return;
      }

      console.log('SubscriptionService: Logging user out of RevenueCat');
      await Purchases.logOut();
      console.log('SubscriptionService: User successfully logged out of RevenueCat');
    } catch (error) {
      console.error('Error logging user out of RevenueCat:', error);
      throw error;
    }
  }

  // Get available packages
  static async getAvailablePackages() {
    try {
      // Check if user is bypass user
      const bypassUserIds = [
        'db497060-1ca7-428f-adcd-7546b72405de', // roman.lakhnyu@gmail.com
        'c8c02575-4351-4953-b04b-3c6c8adbcde2', // usepeakheight@gmail.com
        'a8e234d9-dd05-4d72-9d0b-5cbbfc1022a6', // imeddieking@gmail.com
        'ebb90fe5-eec7-4696-ac61-48432db46e0b', // immujtaba@gmail.com (old ID)
        'b241a0ec-bd7b-46d9-93cf-29ab6a37dde1'  // immujtaba@gmail.com
      ];
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!userError && user && bypassUserIds.includes(user.id)) {
        console.log('🔓 SubscriptionService: Bypass user detected, skipping RevenueCat package fetch');
        throw new Error('Bypass users should not fetch packages from RevenueCat');
      }
      
      console.log('SubscriptionService: Getting available packages from RevenueCat...');

      // Ensure RevenueCat is initialized
      if (!this.initialized) {
        console.log('SubscriptionService: RevenueCat not initialized, initializing now...');
        await this.initialize();
      }

      const toMap = (pkgArray) => {
        const map = {};
        (pkgArray || []).forEach((pkg) => {
          const pid = pkg?.product?.identifier;
          if (pid) map[pid] = pkg;
          if (pid?.includes('weekly')) map.weekly = pkg;
          if (pid?.includes('yearly') || pid?.includes('annual')) map.yearly = pkg;
        });
        return map;
      };

      const offerings = await Purchases.getOfferings();
      console.log('SubscriptionService: Current offering exists:', !!offerings?.current);

      // Try to get the specific offering by ID first
      const specific = offerings?.all?.[SubscriptionService.OFFERING_ID]?.availablePackages;
      if (specific && specific.length) {
        const mapped = toMap(specific);
        console.log('SubscriptionService: Found specific offering packages:', Object.keys(mapped));
        return mapped;
      }

      // Fallback to current offering
      const currentPkgs = offerings?.current?.availablePackages;
      if (currentPkgs && currentPkgs.length) {
        const mapped = toMap(currentPkgs);
        console.log('SubscriptionService: Found current offering packages:', Object.keys(mapped));
        return mapped;
      }

      console.log('SubscriptionService: No offerings found. Ensure products are added to a Current offering in RevenueCat dashboard');
      return null;
    } catch (error) {
      console.error('Error getting packages:', error);
      console.error('Error details:', error.message);
      return null;
    }
  }

  // Purchase a subscription
  static async purchasePackage(packageToPurchase) {
    try {
      console.log('SubscriptionService: Purchasing package:', packageToPurchase?.identifier);

      // Ensure RevenueCat is initialized
      if (!this.initialized) {
        console.log('SubscriptionService: RevenueCat not initialized, initializing now...');
        await this.initialize();
      }

      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      console.log('SubscriptionService: Purchase successful');

      // Update user subscription status in database
      await this.updateUserSubscriptionStatus(customerInfo);

      return {
        success: true,
        customerInfo,
      };
    } catch (error) {
      console.error('Error purchasing package:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Restore purchases
  static async restorePurchases() {
    try {
      console.log('SubscriptionService: Restoring purchases...');

      const customerInfo = await Purchases.restorePurchases();
      console.log('SubscriptionService: Purchases restored');

      // Update user subscription status in database
      await this.updateUserSubscriptionStatus(customerInfo);

      return {
        success: true,
        customerInfo,
      };
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Check subscription status
  static async checkSubscriptionStatus() {
    try {
      console.log('SubscriptionService: Checking subscription status...');
      
      // Bypass RevenueCat for test users - check DB premium_status only
      const bypassUserIds = [
        'db497060-1ca7-428f-adcd-7546b72405de', // roman.lakhnyu@gmail.com
        'c8c02575-4351-4953-b04b-3c6c8adbcde2', // usepeakheight@gmail.com
        'a8e234d9-dd05-4d72-9d0b-5cbbfc1022a6', // imeddieking@gmail.com
        'ebb90fe5-eec7-4696-ac61-48432db46e0b', // immujtaba@gmail.com (old ID)
        'b241a0ec-bd7b-46d9-93cf-29ab6a37dde1'  // immujtaba@gmail.com
      ];
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!userError && user && bypassUserIds.includes(user.id)) {
        console.log('🔓 SubscriptionService: Bypass user detected, checking DB premium_status only');
        // Check database premium_status for bypass users
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('premium_status')
          .eq('id', user.id)
          .maybeSingle();
        
        if (!dbError && userData) {
          const isPremium = !!userData.premium_status;
          console.log('🔓 SubscriptionService: Bypass user premium_status from DB:', isPremium);
          return {
            isSubscribed: isPremium,
            customerInfo: isPremium ? { entitlements: { active: { premium: {} } } } : null
          };
        }
        return { isSubscribed: false, customerInfo: null };
      }

      const customerInfo = await Purchases.getCustomerInfo();
      console.log('SubscriptionService: Customer info retrieved');

      // Update user subscription status in database
      await this.updateUserSubscriptionStatus(customerInfo);

      const active = customerInfo?.entitlements?.active || {};
      const isSubscribed = Object.keys(active).length > 0;
      console.log('SubscriptionService: User subscribed:', isSubscribed);

      return {
        isSubscribed,
        customerInfo,
      };
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return {
        isSubscribed: false,
        error: error.message,
      };
    }
  }

  // Update user subscription status in database
  static async updateUserSubscriptionStatus(customerInfo) {
    try {
      console.log('SubscriptionService: Updating user subscription status...');

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('SubscriptionService: Error getting user:', userError);
        return;
      }

      if (!user) {
        console.log('SubscriptionService: No authenticated user found, skipping database update');
        return;
      }

      console.log('SubscriptionService: User found:', user.id);

      // Skip database update for specific test users to preserve manual premium status
      const skipUserIds = [
        'db497060-1ca7-428f-adcd-7546b72405de', // roman.lakhnyu@gmail.com (manual premium)
        'c8c02575-4351-4953-b04b-3c6c8adbcde2', // usepeakheight@gmail.com (paid premium)
        'a8e234d9-dd05-4d72-9d0b-5cbbfc1022a6', // imeddieking@gmail.com (paid premium)
        'ebb90fe5-eec7-4696-ac61-48432db46e0b', // immujtaba@gmail.com (old ID, bypass RevenueCat)
        'b241a0ec-bd7b-46d9-93cf-29ab6a37dde1'  // immujtaba@gmail.com (bypass RevenueCat)
      ];
      
      if (skipUserIds.includes(user.id)) {
        console.log('SubscriptionService: Skipping database update for test/premium user to preserve manual premium status');
        return;
      }

      const active = customerInfo?.entitlements?.active || {};
      const isSubscribed = Object.keys(active).length > 0;
      const activeEntitlements = Object.keys(active);
      const latestPurchaseDate = customerInfo.latestExpirationDate;

      console.log('SubscriptionService: Subscription status:', {
        isSubscribed,
        activeEntitlements,
        latestPurchaseDate
      });

      // Update user subscription status
      const { error: updateError } = await supabase
        .from('users')
        .update({
          premium_status: isSubscribed,
          premium_expires_at: latestPurchaseDate,
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('SubscriptionService: Error updating user subscription:', updateError);
        return;
      }

      console.log('SubscriptionService: User subscription status updated successfully');

      // Insert or update subscription record
      if (isSubscribed && activeEntitlements.length > 0) {
        const entitlement = activeEntitlements[0];
        const productId = customerInfo.entitlements.active[entitlement].productIdentifier;

        console.log('SubscriptionService: Creating subscription record:', {
          userId: user.id,
          productId,
          entitlement
        });

        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: user.id,
            plan_id: this.getPlanIdFromProductId(productId),
            revenuecat_user_id: customerInfo.originalAppUserId,
            revenuecat_entitlement: entitlement,
            status: 'active',
            start_date: customerInfo.originalPurchaseDate,
            end_date: latestPurchaseDate,
            auto_renew: true,
          }, {
            onConflict: 'user_id',
          });

        if (subscriptionError) {
          console.error('SubscriptionService: Error creating subscription record:', subscriptionError);
        } else {
          console.log('SubscriptionService: Subscription record created successfully');
        }
      }
    } catch (error) {
      console.error('Error updating subscription status:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
  }

  // Get plan ID from product ID
  // Handles both iOS format (peakheight_weekly) and Android format (peakheight_weekly:1)
  static getPlanIdFromProductId(productId) {
    if (!productId) return 'unknown';
    
    // Check if productId starts with or equals the base product IDs
    // iOS: peakheight_weekly, peakheight_yearly
    // Android: peakheight_weekly:1, peakheight_yearly:2
    if (productId === this.PRODUCT_IDS.WEEKLY || productId.startsWith(this.PRODUCT_IDS.WEEKLY + ':')) {
      return 'weekly_premium';
    }
    if (productId === this.PRODUCT_IDS.YEARLY || productId.startsWith(this.PRODUCT_IDS.YEARLY + ':')) {
      return 'yearly_premium';
    }
    
    // Fallback: check if it includes the keywords (for extra safety)
    if (productId.includes('weekly')) {
      return 'weekly_premium';
    }
    if (productId.includes('yearly') || productId.includes('annual')) {
      return 'yearly_premium';
    }
    
    return 'unknown';
  }

  // Get subscription info for display
  static getSubscriptionInfo(customerInfo) {
    const activeEntitlements = Object.keys(customerInfo.entitlements.active);

    if (activeEntitlements.length === 0) {
      return {
        isActive: false,
        planType: null,
        expiresAt: null,
      };
    }

    const entitlement = customerInfo.entitlements.active[activeEntitlements[0]];
    const productId = entitlement.productIdentifier;

    // Determine plan type - handles both iOS (peakheight_yearly) and Android (peakheight_yearly:2) formats
    let planType = 'weekly';
    if (productId === this.PRODUCT_IDS.YEARLY || 
        productId.startsWith(this.PRODUCT_IDS.YEARLY + ':') ||
        productId.includes('yearly') || 
        productId.includes('annual')) {
      planType = 'yearly';
    }

    return {
      isActive: true,
      planType,
      expiresAt: entitlement.expirationDate,
      productId,
    };
  }

  // Handle subscription changes
  static setupSubscriptionListener() {
    console.log('SubscriptionService: Setting up subscription listener...');
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log('SubscriptionService: Customer info updated');
      this.updateUserSubscriptionStatus(customerInfo);
    });
  }

  // Get pricing info for display
  static async getPricingInfo() {
    try {
      const formatCurrency = (amount, currencyCode, fallback) => {
        if (typeof amount === 'number' && !Number.isNaN(amount) && currencyCode) {
          try {
            return new Intl.NumberFormat(undefined, {
              style: 'currency',
              currency: currencyCode,
              minimumFractionDigits: amount < 1 ? 2 : 0,
              maximumFractionDigits: 2,
            }).format(amount);
          } catch (error) {
            console.log('SubscriptionService: Intl format failed, using fallback', error.message);
          }
        }
        if (fallback) return fallback;
        if (typeof amount === 'number' && !Number.isNaN(amount)) {
          return `$${amount.toFixed(2)}`;
        }
        return '$0.00';
      };

      const packages = await this.getAvailablePackages();

      if (!packages) {
        // Fallback pricing if RevenueCat is not available
        return {
          weekly: {
            price: '$4.99',
            weeklyPriceString: '$4.99',
            period: 'week',
            productId: this.PRODUCT_IDS.WEEKLY,
          },
          yearly: {
            price: '$0.58',
            weeklyPriceString: '$0.58',
            period: 'week',
            billingPeriod: 'year',
            totalPrice: '$29.99',
            productId: this.PRODUCT_IDS.YEARLY,
            isBestDeal: true,
          },
        };
      }

      const weeklyPackage = packages.weekly;
      const yearlyPackage = packages.yearly;

      const weeklyPriceNumber = typeof weeklyPackage?.product?.price === 'number'
        ? weeklyPackage.product.price
        : 4.99;
      const weeklyCurrency = weeklyPackage?.product?.currencyCode
        || yearlyPackage?.product?.currencyCode
        || 'USD';
      const weeklyPriceString = formatCurrency(
        weeklyPriceNumber,
        weeklyCurrency,
        weeklyPackage?.product?.priceString || '$4.99'
      );

      const yearlyPriceNumber = typeof yearlyPackage?.product?.price === 'number'
        ? yearlyPackage.product.price
        : 29.99;
      const yearlyCurrency = yearlyPackage?.product?.currencyCode || 'USD';
      const yearlyTotalPriceString = formatCurrency(
        yearlyPriceNumber,
        yearlyCurrency,
        yearlyPackage?.product?.priceString || '$29.99'
      );
      const yearlyWeeklyPriceNumber = yearlyPriceNumber / 52;
      const yearlyWeeklyPriceString = formatCurrency(yearlyWeeklyPriceNumber, yearlyCurrency, '$0.58');

      return {
        weekly: {
          price: weeklyPriceString,
          weeklyPriceString: weeklyPriceString,
          period: 'week',
          productId: weeklyPackage?.product?.identifier,
        },
        yearly: {
          price: yearlyWeeklyPriceString,
          weeklyPriceString: yearlyWeeklyPriceString,
          period: 'week',
          billingPeriod: 'year',
          totalPrice: yearlyTotalPriceString,
          productId: yearlyPackage?.product?.identifier,
          isBestDeal: true,
        },
      };
    } catch (error) {
      console.error('Error getting pricing info:', error);
      return null;
    }
  }
}

export default SubscriptionService;
