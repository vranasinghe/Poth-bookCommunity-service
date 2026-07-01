/**
 * This hook is now a compatibility shim that delegates to the new ThemeContext.
 * For new code, use `useTheme()` from `@/src/theme/ThemeContext` directly.
 */

import { useTheme } from '@/src/theme/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ReturnType<typeof useTheme>['colors']
) {
  const theme = useTheme();
  const colorFromProps = props['light']; // Single-theme app: always use light slot

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return (theme.colors as any)[colorName] ?? '#000';
  }
}
