import { shared } from './palettes/shared';
import { readerPalette } from './palettes/readerTheme';
import { ownerPalette } from './palettes/ownerTheme';

/** Build a full theme object by merging a palette with shared tokens */
const buildTheme = (palette: typeof readerPalette) => ({
  colors: {
    ...palette,
    // Semantic status colors (same in both themes)
    success: shared.status.success,
    warning: shared.status.warning,
    error: shared.status.error,
    info: shared.status.info,
  },
  typography: shared.typography,
  spacing: shared.spacing,
  radii: shared.radii,
  shadows: shared.shadows,
});

export const readerTheme = buildTheme(readerPalette);
export const ownerTheme = buildTheme(ownerPalette);

export type Theme = typeof readerTheme;
export type ThemeVariant = 'reader' | 'owner';
