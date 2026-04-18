import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ title: 'Login', headerBackTitle: 'Back' }} />
                <Stack.Screen name="register" options={{ title: 'Register', headerBackTitle: 'Back' }} />
                <Stack.Screen name="blog/index" options={{ title: 'Manage Blogs' }} />
                <Stack.Screen name="blog/create" options={{ title: 'Create Blog' }} />
                <Stack.Screen name="blog/edit" options={{ title: 'Edit Blog' }} />
                <Stack.Screen name="blog/view" options={{ title: 'Read Article' }} />
            </Stack>
        </AuthProvider>
    );
}
