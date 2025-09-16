// import Purchases from 'react-native-purchases'; // Commented out for testing
import { supabase } from '../config/supabase';

class SubscriptionService {
  // RevenueCat product IDs - these should match your RevenueCat dashboard
  static PRODUCT_IDS = {
    WEEKLY: 'peakheight_weekly',
    YEARLY: 'peakheight_yearly',
  };

  // Initialize RevenueCat (Mock version for testing)
  static async initialize() {
    try {
      console.log('SubscriptionService: Mock initialization - RevenueCat not configured');
      // Mock initialization for testing
      // In production, uncomment the RevenueCat code below:

      // const apiKey = __DEV__
      //   ? 'your_sandbox_api_key'
      //   : 'your_production_api_key';
      // await Purchases.configure({ apiKey });

      // const { data: { user } } = await supabase.auth.getUser();
      // if (user) {
      //   await Purchases.logIn(user.id);
      // }
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
    }
  }

  // Get available packages (Mock version for testing)
  static async getAvailablePackages() {
    try {
      console.log('SubscriptionService: Mock packages - RevenueCat not configured');

      // Mock packages for testing
      return {
        weekly: {
          product: {
            identifier: this.PRODUCT_IDS.WEEKLY,
            priceString: '$4.99'
          }
        },
        yearly: {
          product: {
            identifier: this.PRODUCT_IDS.YEARLY,
            priceString: '$29.99'
          }
        }
      };

      // In production, uncomment the RevenueCat code below:
      // const offerings = await Purchases.getOfferings();
      // if (offerings.current) {
      //   return {
      //     weekly: offerings.current.weekly,
      //     yearly: offerings.current.annual,
      //   };
      // }
      // return null;
    } catch (error) {
      console.error('Error getting packages:', error);
      return null;
    }
  }

  // Purchase a subscription (Mock version for testing)
  static async purchasePackage(packageToPurchase) {
    try {
      console.log('SubscriptionService: Mock purchase - RevenueCat not configured');

      // Mock purchase for testing
      const mockCustomerInfo = {
        entitlements: {
          active: {
            premium: {
              productIdentifier: packageToPurchase?.product?.identifier || this.PRODUCT_IDS.YEARLY,
              expirationDate: new Date(Date.now() + (packageToPurchase?.product?.identifier === this.PRODUCT_IDS.WEEKLY ? 7 : 365) * 24 * 60 * 60 * 1000).toISOString()
            }
          }
        },
        originalAppUserId: 'mock_user_id',
        originalPurchaseDate: new Date().toISOString(),
        latestExpirationDate: new Date(Date.now() + (packageToPurchase?.product?.identifier === this.PRODUCT_IDS.WEEKLY ? 7 : 365) * 24 * 60 * 60 * 1000).toISOString()
      };

      // Update user subscription status in database
      await this.updateUserSubscriptionStatus(mockCustomerInfo);

      return {
        success: true,
        customerInfo: mockCustomerInfo,
      };

      // In production, uncomment the RevenueCat code below:
      // const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      // await this.updateUserSubscriptionStatus(customerInfo);
      // return { success: true, customerInfo };
    } catch (error) {
      console.error('Error purchasing package:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Restore purchases (Mock version for testing)
  static async restorePurchases() {
    try {
      console.log('SubscriptionService: Mock restore - RevenueCat not configured');

      // Mock restore for testing
      const mockCustomerInfo = {
        entitlements: { active: {} },
        originalAppUserId: 'mock_user_id',
        originalPurchaseDate: null,
        latestExpirationDate: null
      };

      // Update user subscription status in database
      await this.updateUserSubscriptionStatus(mockCustomerInfo);

        return {
        success: true,
        customerInfo: mockCustomerInfo,
        };

      // In production, uncomment the RevenueCat code below:
      // const customerInfo = await Purchases.restorePurchases();
      // await this.updateUserSubscriptionStatus(customerInfo);
      // return { success: true, customerInfo };
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Check subscription status (Mock version for testing)
  static async checkSubscriptionStatus() {
    try {
      console.log('SubscriptionService: Mock status check - RevenueCat not configured');

      // Mock status check for testing
      const mockCustomerInfo = {
        entitlements: { active: {} },
        originalAppUserId: 'mock_user_id',
        originalPurchaseDate: null,
        latestExpirationDate: null
      };

      // Update user subscription status in database
      await this.updateUserSubscriptionStatus(mockCustomerInfo);

      return {
        isSubscribed: false, // Default to not subscribed for testing
        customerInfo: mockCustomerInfo,
      };

      // In production, uncomment the RevenueCat code below:
      // const customerInfo = await Purchases.getCustomerInfo();
      // await this.updateUserSubscriptionStatus(customerInfo);
      // return { isSubscribed: !customerInfo.entitlements.active.isEmpty, customerInfo };
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isSubscribed = !customerInfo.entitlements.active.isEmpty;
      const activeEntitlements = Object.keys(customerInfo.entitlements.active);
      const latestPurchaseDate = customerInfo.latestExpirationDate;

      // Update user subscription status
      await supabase
        .from('users')
        .update({
          premium_status: isSubscribed,
          premium_expires_at: latestPurchaseDate,
        })
        .eq('id', user.id);

      // Insert or update subscription record
      if (isSubscribed && activeEntitlements.length > 0) {
        const entitlement = activeEntitlements[0];
        const productId = customerInfo.entitlements.active[entitlement].productIdentifier;

        await supabase
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
      }
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  }

  // Get plan ID from product ID
  static getPlanIdFromProductId(productId) {
    switch (productId) {
      case this.PRODUCT_IDS.WEEKLY:
        return 'weekly_premium';
      case this.PRODUCT_IDS.YEARLY:
        return 'yearly_premium';
      default:
        return 'unknown';
    }
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

    return {
      isActive: true,
      planType: productId === this.PRODUCT_IDS.YEARLY ? 'yearly' : 'weekly',
      expiresAt: entitlement.expirationDate,
      productId,
    };
  }

  // Handle subscription changes (Mock version for testing)
  static setupSubscriptionListener() {
    console.log('SubscriptionService: Mock listener setup - RevenueCat not configured');
    // Mock listener for testing
    // In production, uncomment the RevenueCat code below:
    // Purchases.addCustomerInfoUpdateListener((customerInfo) => {
    //   this.updateUserSubscriptionStatus(customerInfo);
    // });
  }

  // Get pricing info for display
  static async getPricingInfo() {
    try {
      const packages = await this.getAvailablePackages();

      if (!packages) {
        // Fallback pricing if RevenueCat is not available
        return {
          weekly: {
            price: '$4.99',
            period: 'week',
            productId: this.PRODUCT_IDS.WEEKLY,
          },
          yearly: {
            price: '$0.58',
            period: 'week',
            billingPeriod: 'year',
            totalPrice: '$29.99',
            productId: this.PRODUCT_IDS.YEARLY,
            isBestDeal: true,
          },
        };
      }

      return {
        weekly: {
          price: packages.weekly?.product.priceString || '$4.99',
          period: 'week',
          productId: packages.weekly?.product.identifier,
        },
        yearly: {
          price: packages.yearly?.product.priceString || '$0.58',
          period: 'week',
          billingPeriod: 'year',
          totalPrice: packages.yearly?.product.priceString || '$29.99',
          productId: packages.yearly?.product.identifier,
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
