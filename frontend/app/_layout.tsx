import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/theme/ThemeContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Default to reader (blue) theme for all routes */}
      <ThemeProvider variant="reader">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="register" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="owner" />
          <Stack.Screen name="search" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
