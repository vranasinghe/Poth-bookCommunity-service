/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    primary: '#003D71',
    secondary: '#666666',
    tint: '#007AFF',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#003D71',
    cardBackground: '#FFFFFF',
    buttonBackground: '#1A1A1A',
    buttonText: '#FFFFFF',
    inputBackground: '#E8E8E8',
    gradient: ['#004E92', '#000428'] as const,
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    border: '#E0E0E0',
    glass: 'rgba(255, 255, 255, 0.7)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    primary: '#007AFF',
    secondary: '#9BA1A6',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Courier',
  },
  android: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Courier',
  },
});
