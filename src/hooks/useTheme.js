import { useMemo } from 'react';

export function useTheme() {
  const colors = useMemo(() => ({
    // Background colors
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceElevated: '#F5F5F5',

    // Text colors
    textPrimary: '#000000',
    textSecondary: '#666666',
    textDisabled: '#AAAAAA',

    // Accent colors
    accent: '#000000',
    accentLight: '#333333',

    // Status colors
    success: '#000000',
    warning: '#000000',
    error: '#FF3B30',

    // Feature-specific colors
    heightGreen: '#000000',
    postureBlue: '#000000',
    habitPurple: '#000000',

    // Border colors
    border: '#E5E5E5',
    borderLight: '#CCCCCC',

    // Chart colors
    chartLine: '#000000',
    chartArea: 'rgba(0, 0, 0, 0.1)',
  }), []);

  return { colors };
}
