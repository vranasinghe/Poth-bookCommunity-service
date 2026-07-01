import { Platform } from 'react-native';

/**
 * Shared design tokens — IDENTICAL across reader and owner themes.
 * Only brand/primary/accent colors differ between themes.
 */
export const shared = {
  typography: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'System',
    }),
    scale: {
      h1: { fontSize: 30, fontWeight: '900' as const, lineHeight: 38 },
      h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
      h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
      body: { fontSize: 16, fontWeight: 'normal' as const, lineHeight: 22 },
      bodySmall: { fontSize: 14, fontWeight: 'normal' as const, lineHeight: 20 },
      caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
      button: { fontSize: 16, fontWeight: '700' as const, lineHeight: 20 },
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  radii: {
    sm: 8,
    md: 16,
    lg: 24,
    full: 9999,
  },

  shadows: {
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },
  },

  /** Semantic status colors — same across both themes */
  status: {
    success: '#27AE60',
    warning: '#F39C12',
    error: '#E74C3C',
    info: '#2980B9',
  },
};
