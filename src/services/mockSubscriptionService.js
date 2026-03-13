// Mock subscription service for testing without App Store
// Use this only for development/testing

class MockSubscriptionService {
  static async initialize() {
    console.log('MockSubscriptionService: Initializing mock service...');
    return Promise.resolve();
  }

  static async getAvailablePackages() {
    console.log('MockSubscriptionService: Returning mock packages...');

    // Mock packages that match your RevenueCat setup
    return {
      'peakheight_weekly': {
        identifier: 'peakheight_weekly',
        product: {
          identifier: 'peakheight_weekly',
          priceString: '$4.99',
          price: 4.99,
          currencyCode: 'USD'
        }
      },
      'peakheight_yearly': {
        identifier: 'peakheight_yearly',
        product: {
          identifier: 'peakheight_yearly',
          priceString: '$29.99',
          price: 29.99,
          currencyCode: 'USD'
        }
      }
    };
  }

  static async getPricingInfo() {
    console.log('MockSubscriptionService: Returning mock pricing...');

    return {
      weekly: {
        price: '$4.99',
        weeklyPriceString: '$4.99',
        period: 'week',
        productId: 'peakheight_weekly'
      },
      yearly: {
        price: '$0.58',
        weeklyPriceString: '$0.58',
        period: 'week',
        billingPeriod: 'year',
        totalPrice: '$29.99',
        productId: 'peakheight_yearly',
        isBestDeal: true
      }
    };
  }

  static async purchasePackage(packageToPurchase) {
    console.log('MockSubscriptionService: Mocking purchase for:', packageToPurchase?.identifier);

    // Simulate purchase delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful purchase
    const response = {
      success: true,
      customerInfo: {
        entitlements: {
          active: {
            'premium': {
              productIdentifier: packageToPurchase?.identifier,
              expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
            }
          }
        },
        originalAppUserId: 'mock_user_id',
        originalPurchaseDate: new Date(),
        latestExpirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    };

    // Update in-memory mock state so immediate checks read as subscribed
    this.isSubscribedMock = true;
    this.mockCustomerInfo = response.customerInfo;

    return response;
  }

  static async restorePurchases() {
    console.log('MockSubscriptionService: Mocking restore purchases...');

    return {
      success: false,
      error: 'No previous purchases found'
    };
  }

  static async checkSubscriptionStatus() {
    console.log('MockSubscriptionService: Mocking subscription check...');
    console.log('MockSubscriptionService: Current subscription status:', this.isSubscribedMock);

    // First check the database for the actual subscription status
    try {
      const { supabase } = await import('../config/supabase');
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (!userError && user) {
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('premium_status, premium_expires_at')
          .eq('id', user.id)
          .single();

        if (!dbError && userData) {
          console.log('MockSubscriptionService: Database subscription status:', userData.premium_status);

          // Update our mock status to match database
          this.isSubscribedMock = !!userData.premium_status;

          if (userData.premium_status) {
            // Ensure mockCustomerInfo has the right structure
            this.mockCustomerInfo = {
              entitlements: {
                active: {
                  'premium_entitlement': {
                    productIdentifier: 'peakheight_yearly',
                    expirationDate: userData.premium_expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                  }
                }
              },
              latestExpirationDate: userData.premium_expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              originalAppUserId: user?.id || 'mock_user_id',
              originalPurchaseDate: new Date().toISOString(),
            };
          } else {
            this.mockCustomerInfo = {
              entitlements: {
                active: {}
              },
              latestExpirationDate: null,
              originalAppUserId: user?.id || 'mock_user_id',
              originalPurchaseDate: new Date().toISOString(),
            };
          }
        }
      }
    } catch (error) {
      console.log('MockSubscriptionService: Error checking database status:', error);
    }

    return {
      isSubscribed: this.isSubscribedMock,
      customerInfo: this.mockCustomerInfo
    };
  }

  static async updateUserSubscriptionStatus(customerInfo) {
    console.log('MockSubscriptionService: Mocking database update...');
    console.log('MockSubscriptionService: Customer info:', customerInfo);

    try {
      // Import supabase for mock database update
      const { supabase } = await import('../config/supabase');
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('MockSubscriptionService: Error getting user:', userError);
        return;
      }

      if (!user || !user.id) {
        console.log('MockSubscriptionService: No authenticated user found or user.id is undefined, skipping database update');
        console.log('MockSubscriptionService: User object:', user);
        return;
      }

      // Skip database update for specific test users to preserve manual premium status
      const skipUserIds = [
        'db497060-1ca7-428f-adcd-7546b72405de', // roman.lakhnyu@gmail.com (manual premium)
        'c8c02575-4351-4953-b04b-3c6c8adbcde2', // usepeakheight@gmail.com (paid premium)
        'ebb90fe5-eec7-4696-ac61-48432db46e0b', // immujtaba@gmail.com (old ID, bypass RevenueCat)
        'b241a0ec-bd7b-46d9-93cf-29ab6a37dde1'  // immujtaba@gmail.com (bypass RevenueCat)
      ];
      
      if (skipUserIds.includes(user.id)) {
        console.log('MockSubscriptionService: Skipping database update for test/premium user to preserve manual premium status');
        return;
      }

      const activeEntitlements = customerInfo?.entitlements?.active || {};
      const isSubscribed = !!activeEntitlements && Object.keys(activeEntitlements).length > 0;
      const latestPurchaseDate = customerInfo.latestExpirationDate;

      console.log('MockSubscriptionService: Updating user subscription status:', {
        userId: user.id,
        isSubscribed,
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
        console.error('MockSubscriptionService: Error updating user subscription:', updateError);
        return;
      }

      console.log('MockSubscriptionService: User subscription status updated successfully');

      // Also create a subscription record for mock
      if (isSubscribed) {
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: user.id,
            plan_id: 'yearly_premium', // Mock plan ID
            revenuecat_user_id: 'mock_user_id',
            revenuecat_entitlement: Object.keys(activeEntitlements)[0] || 'premium',
            status: 'active',
            start_date: new Date(),
            end_date: latestPurchaseDate,
            auto_renew: true,
          }, {
            onConflict: 'user_id',
          });

        if (subscriptionError) {
          console.error('MockSubscriptionService: Error creating subscription record:', subscriptionError);
        } else {
          console.log('MockSubscriptionService: Subscription record created successfully');
        }
      }
    } catch (error) {
      console.error('MockSubscriptionService: Error in database update:', error);
    }
  }
}

export default MockSubscriptionService;
