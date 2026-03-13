// Fallback Sentry configuration if the main one fails
// This provides dummy functions that don't do anything

export const initSentry = () => {
  console.log('⚠️ Sentry disabled - using fallback mode');
};

export const captureException = (error, context = {}) => {
  console.log('Sentry fallback - Error captured:', error.message);
};

export const captureMessage = (message, level = 'info', context = {}) => {
  console.log('Sentry fallback - Message captured:', message);
};

export const addBreadcrumb = (breadcrumb) => {
  console.log('Sentry fallback - Breadcrumb added:', breadcrumb.message);
};

export const setUser = (user) => {
  console.log('Sentry fallback - User set:', user.id);
};

export const setTag = (key, value) => {
  console.log('Sentry fallback - Tag set:', key, value);
};

export const setContext = (key, context) => {
  console.log('Sentry fallback - Context set:', key);
};

export const setExtra = (key, value) => {
  console.log('Sentry fallback - Extra set:', key, value);
};

export const clearUser = () => {
  console.log('Sentry fallback - User cleared');
};

export default {
  initSentry,
  captureException,
  captureMessage,
  addBreadcrumb,
  setUser,
  setTag,
  setContext,
  setExtra,
  clearUser
};
