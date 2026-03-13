// Onboarding-specific design constants
// These are separate from main app constants to maintain the black/white onboarding theme

export const ONBOARDING_TYPOGRAPHY = {
  // Page Titles
  PAGE_TITLE: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    lineHeight: 40,
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },
  // Subtitles
  SUBTITLE: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    color: '#9CA3AF',
  },
  // Body Text
  BODY: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    color: '#FFFFFF',
  },
  // Option Text
  OPTION_TEXT: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    lineHeight: 24,
    color: '#FFFFFF',
  },
  // Button Text
  BUTTON_TEXT: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  // Progress Text
  PROGRESS_TEXT: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
};

export const ONBOARDING_COLORS = {
  BACKGROUND: '#000000',
  SURFACE: '#0a0a0a',
  SURFACE_ELEVATED: '#1f1f1f',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#9CA3AF',
  BORDER: '#1f1f1f',
  BORDER_SELECTED: '#FFFFFF',
  BUTTON_BACKGROUND: '#FFFFFF',
  BUTTON_DISABLED: 'rgba(255, 255, 255, 0.5)',
  PROGRESS_BAR: '#1f1f1f',
  PROGRESS_FILL: '#FFFFFF',
};

export const ONBOARDING_SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
  // Common patterns
  PAGE_HORIZONTAL: 24,
  PAGE_VERTICAL: 16,
  SECTION_GAP: 32,
  CARD_PADDING: 18,
  BUTTON_PADDING_VERTICAL: 16,
  BUTTON_PADDING_HORIZONTAL: 24,
};

export const ONBOARDING_BORDER_RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  BUTTON: 12,
  CARD: 12,
  BACK_BUTTON: 20,
};

export const ONBOARDING_TOTAL_STEPS = 16; // Total number of onboarding pages so progress shows 16/16

export const ONBOARDING_ANIMATIONS = {
  PAGE_TRANSITION: 300,
  CONTENT_FADE: 600,
  BUTTON_PRESS: 100,
  PROGRESS_BAR: 500,
};
