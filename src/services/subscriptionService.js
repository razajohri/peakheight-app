import { supabase } from '../config/supabase';
import { API_KEYS } from '../config/apiKeys';

// Subscription service with RevenueCat integration
export class SubscriptionService {
  // =============================================
  // REVENUECAT INTEGRATION
  // =============================================

  // Initialize RevenueCat
  static async initializeRevenueCat() {
    try {
      // This would typically be done in the app initialization
      // For now, we'll simulate the initialization
      console.log('RevenueCat initialized with API key:', API_KEYS.REVENUECAT_API_KEY);
      return { success: true, error: null };
    } catch (error) {
      console.error('Initialize RevenueCat error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get available subscription plans
  static async getSubscriptionPlans() {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price');

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { plans: data, error: null };
    } catch (error) {
      console.error('Get subscription plans error:', error);
      return { plans: null, error: error.message };
    }
  }

  // Purchase subscription
  static async purchaseSubscription(userId, planId, productId) {
    try {
      // This would integrate with RevenueCat SDK
      // For now, we'll simulate the purchase process

      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError) {
        throw new Error(this.getErrorMessage(planError));
      }

      // Simulate successful purchase
      const subscriptionData = {
        user_id: userId,
        plan_id: planId,
        revenuecat_user_id: `rc_${userId}`,
        revenuecat_entitlement: 'premium',
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + plan.duration_days * 24 * 60 * 60 * 1000).toISOString(),
        auto_renew: true,
      };

      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert(subscriptionData)
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      // Update user premium status
      await supabase
        .from('users')
        .update({
          premium_status: true,
          premium_expires_at: subscriptionData.end_date,
        })
        .eq('id', userId);

      return { subscription: data, error: null };
    } catch (error) {
      console.error('Purchase subscription error:', error);
      return { subscription: null, error: error.message };
    }
  }

  // Restore purchases
  static async restorePurchases(userId) {
    try {
      // This would integrate with RevenueCat SDK
      // For now, we'll check existing subscriptions

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(this.getErrorMessage(error));
      }

      if (data && new Date(data.end_date) > new Date()) {
        // Update user premium status
        await supabase
          .from('users')
          .update({
            premium_status: true,
            premium_expires_at: data.end_date,
          })
          .eq('id', userId);

        return { restored: true, subscription: data, error: null };
      }

      return { restored: false, subscription: null, error: null };
    } catch (error) {
      console.error('Restore purchases error:', error);
      return { restored: false, subscription: null, error: error.message };
    }
  }

  // Cancel subscription
  static async cancelSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled',
          auto_renew: false,
        })
        .eq('user_id', userId)
        .eq('status', 'active')
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { subscription: data, error: null };
    } catch (error) {
      console.error('Cancel subscription error:', error);
      return { subscription: null, error: error.message };
    }
  }

  // =============================================
  // PREMIUM FEATURE GATING
  // =============================================

  // Check if user has premium access
  static async checkPremiumAccess(userId) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('status, end_date, plan_id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(this.getErrorMessage(error));
      }

      if (data) {
        const isActive = data.status === 'active' &&
          new Date(data.end_date) > new Date();

        return {
          hasAccess: isActive,
          subscription: data,
          error: null
        };
      }

      return { hasAccess: false, subscription: null, error: null };
    } catch (error) {
      console.error('Check premium access error:', error);
      return { hasAccess: false, subscription: null, error: error.message };
    }
  }

  // Check specific premium feature access
  static async checkFeatureAccess(userId, feature) {
    try {
      const { hasAccess, subscription } = await this.checkPremiumAccess(userId);

      if (!hasAccess) {
        return { hasAccess: false, reason: 'No active subscription' };
      }

      // Check if feature is included in the plan
      const { data: plan, error } = await supabase
        .from('subscription_plans')
        .select('features')
        .eq('id', subscription.plan_id)
        .single();

      if (error) {
        return { hasAccess: false, reason: 'Plan not found' };
      }

      const features = plan.features || [];
      const hasFeature = features.includes(feature);

      return {
        hasAccess: hasFeature,
        reason: hasFeature ? 'Feature included' : 'Feature not included in plan'
      };
    } catch (error) {
      console.error('Check feature access error:', error);
      return { hasAccess: false, reason: 'Error checking access' };
    }
  }

  // Get premium features for user
  static async getPremiumFeatures(userId) {
    try {
      const { hasAccess, subscription } = await this.checkPremiumAccess(userId);

      if (!hasAccess) {
        return { features: [], error: null };
      }

      const { data: plan, error } = await supabase
        .from('subscription_plans')
        .select('features')
        .eq('id', subscription.plan_id)
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      return { features: plan.features || [], error: null };
    } catch (error) {
      console.error('Get premium features error:', error);
      return { features: [], error: error.message };
    }
  }

  // =============================================
  // SUBSCRIPTION MANAGEMENT
  // =============================================

  // Get user subscription details
  static async getUserSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (name, description, price, features)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(this.getErrorMessage(error));
      }

      return { subscription: data, error: null };
    } catch (error) {
      console.error('Get user subscription error:', error);
      return { subscription: null, error: error.message };
    }
  }

  // Update subscription status (webhook from RevenueCat)
  static async updateSubscriptionStatus(userId, statusData) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          status: statusData.status,
          end_date: statusData.end_date,
          auto_renew: statusData.auto_renew,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('revenuecat_user_id', statusData.revenuecat_user_id)
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      // Update user premium status
      const isActive = statusData.status === 'active' &&
        new Date(statusData.end_date) > new Date();

      await supabase
        .from('users')
        .update({
          premium_status: isActive,
          premium_expires_at: statusData.end_date,
        })
        .eq('id', userId);

      return { subscription: data, error: null };
    } catch (error) {
      console.error('Update subscription status error:', error);
      return { subscription: null, error: error.message };
    }
  }

  // Get subscription analytics
  static async getSubscriptionAnalytics() {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('status, plan_id, created_at, end_date');

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      const analytics = {
        totalSubscriptions: data.length,
        activeSubscriptions: data.filter(s => s.status === 'active').length,
        cancelledSubscriptions: data.filter(s => s.status === 'cancelled').length,
        expiredSubscriptions: data.filter(s => s.status === 'expired').length,
        planDistribution: {},
        monthlyRevenue: 0,
      };

      // Calculate plan distribution
      data.forEach(subscription => {
        const planId = subscription.plan_id;
        analytics.planDistribution[planId] = (analytics.planDistribution[planId] || 0) + 1;
      });

      return { analytics, error: null };
    } catch (error) {
      console.error('Get subscription analytics error:', error);
      return { analytics: null, error: error.message };
    }
  }

  // =============================================
  // TRIAL MANAGEMENT
  // =============================================

  // Start free trial
  static async startFreeTrial(userId, planId = 'monthly') {
    try {
      const trialData = {
        user_id: userId,
        plan_id: planId,
        revenuecat_user_id: `rc_${userId}`,
        revenuecat_entitlement: 'premium',
        status: 'trial',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        auto_renew: true,
      };

      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert(trialData)
        .select()
        .single();

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      // Update user premium status
      await supabase
        .from('users')
        .update({
          premium_status: true,
          premium_expires_at: trialData.end_date,
        })
        .eq('id', userId);

      return { subscription: data, error: null };
    } catch (error) {
      console.error('Start free trial error:', error);
      return { subscription: null, error: error.message };
    }
  }

  // Check if user is eligible for trial
  static async checkTrialEligibility(userId) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('status')
        .eq('user_id', userId);

      if (error) {
        throw new Error(this.getErrorMessage(error));
      }

      // User is eligible if they've never had a subscription
      const hasHadSubscription = data.length > 0;

      return { eligible: !hasHadSubscription, error: null };
    } catch (error) {
      console.error('Check trial eligibility error:', error);
      return { eligible: false, error: error.message };
    }
  }

  // =============================================
  // PROMOTIONAL OFFERS
  // =============================================

  // Apply promotional code
  static async applyPromoCode(userId, promoCode) {
    try {
      // This would integrate with RevenueCat promotional offers
      // For now, we'll simulate the process

      const validPromoCodes = {
        'HEIGHT2024': { discount: 0.2, description: '20% off first month' },
        'STUDENT50': { discount: 0.5, description: '50% off for students' },
        'EARLYBIRD': { discount: 0.3, description: '30% off early bird special' },
      };

      const promo = validPromoCodes[promoCode.toUpperCase()];

      if (!promo) {
        return { valid: false, error: 'Invalid promotional code' };
      }

      return {
        valid: true,
        discount: promo.discount,
        description: promo.description,
        error: null
      };
    } catch (error) {
      console.error('Apply promo code error:', error);
      return { valid: false, error: error.message };
    }
  }

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================

  // Get error message
  static getErrorMessage(error) {
    const errorMessages = {
      'duplicate key value violates unique constraint': 'Subscription already exists.',
      'insert or update on table violates foreign key constraint': 'Invalid subscription plan.',
      'new row violates row-level security policy': 'You do not have permission to perform this action.',
    };

    return errorMessages[error.message] || error.message || 'An unexpected error occurred.';
  }

  // Format subscription status
  static formatSubscriptionStatus(status) {
    const statusMap = {
      'active': 'Active',
      'cancelled': 'Cancelled',
      'expired': 'Expired',
      'trial': 'Free Trial',
    };

    return statusMap[status] || status;
  }

  // Calculate days until expiration
  static calculateDaysUntilExpiration(endDate) {
    const now = new Date();
    const expiration = new Date(endDate);
    const diffTime = expiration - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  // Check if subscription is expiring soon
  static isSubscriptionExpiringSoon(endDate, daysThreshold = 7) {
    const daysUntilExpiration = this.calculateDaysUntilExpiration(endDate);
    return daysUntilExpiration <= daysThreshold && daysUntilExpiration > 0;
  }
}

// Export individual functions for backward compatibility
export const initializeRevenueCat = SubscriptionService.initializeRevenueCat;
export const getSubscriptionPlans = SubscriptionService.getSubscriptionPlans;
export const purchaseSubscription = SubscriptionService.purchaseSubscription;
export const restorePurchases = SubscriptionService.restorePurchases;
export const cancelSubscription = SubscriptionService.cancelSubscription;
export const checkPremiumAccess = SubscriptionService.checkPremiumAccess;
export const checkFeatureAccess = SubscriptionService.checkFeatureAccess;
export const getPremiumFeatures = SubscriptionService.getPremiumFeatures;
export const getUserSubscription = SubscriptionService.getUserSubscription;
export const updateSubscriptionStatus = SubscriptionService.updateSubscriptionStatus;
export const getSubscriptionAnalytics = SubscriptionService.getSubscriptionAnalytics;
export const startFreeTrial = SubscriptionService.startFreeTrial;
export const checkTrialEligibility = SubscriptionService.checkTrialEligibility;
export const applyPromoCode = SubscriptionService.applyPromoCode;

export default SubscriptionService;
