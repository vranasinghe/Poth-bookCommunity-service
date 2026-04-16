import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
    token: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    loginContext: (userData: User) => Promise<void>;
    logoutContext: () => Promise<void>;
    updateUserContext: (data: Partial<User>) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    loginContext: async () => {},
    logoutContext: async () => {},
    updateUserContext: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const rootSegment = useSegments()[0];
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('@poth_user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to load user data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        // Only guard: if unauthenticated and not already on an auth screen, push to login
        if (!user && rootSegment !== 'auth' && rootSegment !== 'register' && rootSegment !== undefined) {
            router.replace('/auth');
        }
    }, [user, isLoading, rootSegment]);

    const loginContext = async (userData: User) => {
        try {
            await AsyncStorage.setItem('@poth_user', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error("Failed to login", error);
        }
    };

    const logoutContext = async () => {
        try {
            await AsyncStorage.removeItem('@poth_user');
            setUser(null);
            router.replace('/auth');
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    const updateUserContext = async (data: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...data };
            try {
                await AsyncStorage.setItem('@poth_user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            } catch (error) {
                console.error("Failed to update user context", error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, loginContext, logoutContext, updateUserContext }}>
            {children}
        </AuthContext.Provider>
    );
};
