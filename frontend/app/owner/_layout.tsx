import { Stack } from 'expo-router';
import { ThemeProvider } from '../../src/theme/ThemeContext';

/**
 * Owner layout — wraps all owner routes in the brown theme.
 * This is a LOCAL context override: navigating away from /owner/
 * automatically restores the parent reader theme with no flash.
 */
export default function OwnerLayout() {
  return (
    <ThemeProvider variant="owner">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="manage-stock" />
        <Stack.Screen name="register-book" />
        <Stack.Screen name="register-shop" />
        <Stack.Screen name="update-stock" />
        <Stack.Screen name="view-slip" />
      </Stack>
    </ThemeProvider>
  );
}
