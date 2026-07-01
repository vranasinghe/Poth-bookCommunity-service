import React, { createContext, useContext, useState, ReactNode } from 'react';
import { readerTheme, ownerTheme, Theme, ThemeVariant } from './theme';

interface ThemeContextValue {
  theme: Theme;
  variant: ThemeVariant;
  setVariant: (v: ThemeVariant) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: readerTheme,
  variant: 'reader',
  setVariant: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
  /** Override the active variant at a layout boundary (e.g. owner layout) */
  variant?: ThemeVariant;
}

/**
 * ThemeProvider — wraps a subtree with a specific theme variant.
 *
 * Usage:
 *  - Root layout: <ThemeProvider>  (defaults to 'reader')
 *  - Owner layout: <ThemeProvider variant="owner">  (overrides for all owner routes)
 *
 * Nested providers work correctly — the innermost provider wins.
 */
export const ThemeProvider = ({ children, variant: variantProp }: ThemeProviderProps) => {
  // If a variant prop is passed (e.g., from owner/_layout), use that directly.
  // If not, allow internal state switching (future-proof for e.g. user preference).
  const [internalVariant, setInternalVariant] = useState<ThemeVariant>(variantProp ?? 'reader');

  const activeVariant = variantProp ?? internalVariant;
  const activeTheme = activeVariant === 'owner' ? ownerTheme : readerTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        variant: activeVariant,
        setVariant: setInternalVariant,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/** Hook to access the active theme and variant in any component */
export const useTheme = (): Theme => {
  const { theme } = useContext(ThemeContext);
  return theme;
};

/** Hook to access the full context (theme + variant + setter) */
export const useThemeContext = (): ThemeContextValue => {
  return useContext(ThemeContext);
};
