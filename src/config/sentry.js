import * as Sentry from '@sentry/react-native';

// Initialize Sentry for Expo with delayed initialization
export const initSentry = () => {
  // Use setTimeout to ensure React Native is fully loaded
  setTimeout(() => {
    try {
      // Check if Sentry is already initialized
      if (Sentry.getCurrentHub().getClient()) {
        console.log('✅ Sentry already initialized');
        return;
      }

      Sentry.init({
        dsn: 'https://a6675bf85d592e5807e7da45758ee8c1@o4510233551175680.ingest.us.sentry.io/4510233553272832',
        // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
        // Set sample rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: 1.0,
        // Set the release version
        release: '1.0.0',
        // Set the environment
        environment: __DEV__ ? 'development' : 'production',
        // Simplified configuration to avoid prototype issues
        integrations: [
          new Sentry.ReactNativeTracing({
            // Set sampling rate for performance monitoring
            tracesSampleRate: 1.0,
          }),
        ],
        // Enable features that work well with Expo
        enableAutoSessionTracking: true,
        enableNativeCrashHandling: true,
        // Simplified breadcrumb handling
        beforeBreadcrumb(breadcrumb, hint) {
          // Simple breadcrumb filtering without complex URL parsing
          if (breadcrumb.category === 'http' && breadcrumb.data?.url) {
            // Just log the breadcrumb without complex URL manipulation
            console.log('Sentry breadcrumb:', breadcrumb.category);
          }
          return breadcrumb;
        },
      });
      console.log('✅ Sentry initialized successfully');
    } catch (error) {
      console.error('❌ Sentry initialization failed:', error);
      // Don't throw the error, just log it
    }
  }, 100); // Small delay to ensure React Native is ready
};

// Export Sentry functions for use throughout the app
export const captureException = (error, context = {}) => {
  Sentry.captureException(error, context);
};

export const captureMessage = (message, level = 'info', context = {}) => {
  Sentry.captureMessage(message, level, context);
};

export const addBreadcrumb = (breadcrumb) => {
  Sentry.addBreadcrumb(breadcrumb);
};

export const setUser = (user) => {
  Sentry.setUser(user);
};

export const setTag = (key, value) => {
  Sentry.setTag(key, value);
};

export const setContext = (key, context) => {
  Sentry.setContext(key, context);
};

export const setExtra = (key, value) => {
  Sentry.setExtra(key, value);
};

export const clearUser = () => {
  Sentry.setUser(null);
};

export default Sentry;
