import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 12/13/14 as reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Device type detection
export const getDeviceType = () => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;

  if (SCREEN_WIDTH <= 360) return 'small'; // Small phones like iPhone SE
  if (SCREEN_WIDTH <= 414) return 'medium'; // Standard iPhones
  if (SCREEN_WIDTH <= 480) return 'large'; // Large phones like iPhone Pro Max
  return 'xlarge'; // Tablets and very large phones
};

// Responsive width calculation
export const responsiveWidth = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.ceil(PixelRatio.roundToNearestPixel(size * scale));
};

// Responsive height calculation
export const responsiveHeight = (size) => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.ceil(PixelRatio.roundToNearestPixel(size * scale));
};

// Responsive font size
export const responsiveFontSize = (size) => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
  return Math.ceil(PixelRatio.roundToNearestPixel(size * scale));
};

// Responsive padding/margin
export const responsivePadding = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.ceil(PixelRatio.roundToNearestPixel(size * scale));
};

// Get responsive grid columns based on screen width
export const getGridColumns = () => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case 'small':
      return 2; // 2 columns for small screens
    case 'medium':
      return 3; // 3 columns for medium screens
    case 'large':
      return 3; // 3 columns for large screens
    case 'xlarge':
      return 4; // 4 columns for very large screens
    default:
      return 3;
  }
};

// Get responsive card width
export const getCardWidth = (columns = null) => {
  const cols = columns || getGridColumns();
  const padding = responsivePadding(32); // 16px on each side
  const gap = responsivePadding(12); // Gap between cards
  const totalGaps = (cols - 1) * gap;

  return (SCREEN_WIDTH - padding - totalGaps) / cols;
};

// Get responsive image dimensions
export const getImageDimensions = (baseWidth, baseHeight) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return {
    width: Math.ceil(PixelRatio.roundToNearestPixel(baseWidth * scale)),
    height: Math.ceil(PixelRatio.roundToNearestPixel(baseHeight * scale))
  };
};

// Safe area adjustments for different devices
export const getSafeAreaPadding = () => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case 'small':
      return {
        top: responsiveHeight(40),
        bottom: responsiveHeight(20),
        horizontal: responsivePadding(16)
      };
    case 'medium':
      return {
        top: responsiveHeight(50),
        bottom: responsiveHeight(30),
        horizontal: responsivePadding(20)
      };
    case 'large':
      return {
        top: responsiveHeight(60),
        bottom: responsiveHeight(40),
        horizontal: responsivePadding(24)
      };
    case 'xlarge':
      return {
        top: responsiveHeight(70),
        bottom: responsiveHeight(50),
        horizontal: responsivePadding(28)
      };
    default:
      return {
        top: responsiveHeight(50),
        bottom: responsiveHeight(30),
        horizontal: responsivePadding(20)
      };
  }
};

// Check if device is iPhone
export const isIPhone = () => {
  return Platform.OS === 'ios';
};

// Check if device has notch (iPhone X and newer)
export const hasNotch = () => {
  return isIPhone() && SCREEN_HEIGHT >= 812;
};

export default {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  responsivePadding,
  getGridColumns,
  getCardWidth,
  getImageDimensions,
  getSafeAreaPadding,
  getDeviceType,
  isIPhone,
  hasNotch,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
};
