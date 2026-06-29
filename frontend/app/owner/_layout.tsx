import { Stack } from 'expo-router';

export default function OwnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="manage-stock" />
      <Stack.Screen name="register-book" />
      <Stack.Screen name="register-shop" />
      <Stack.Screen name="update-stock" />
    </Stack>
  );
}
