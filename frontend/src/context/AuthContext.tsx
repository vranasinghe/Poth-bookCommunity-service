import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    _id: string;
    firstName: string;
    lastName?: string;
    email: string;
    userType: 'Customer' | 'Shop Owner';
    token: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isShopOwner: boolean;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isShopOwner: false,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on app launch
    useEffect(() => {
        const loadUser = async () => {
            try {
                const stored = await AsyncStorage.getItem('userData');
                if (stored) {
                    setUser(JSON.parse(stored));
                }
            } catch (e) {
                console.error('Failed to load user from storage', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (userData: User) => {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userData');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isShopOwner: user?.userType === 'Shop Owner',
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
