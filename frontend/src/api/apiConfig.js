import { Platform } from 'react-native';

// Centralized API Base URL configuration
// Using EXPO_PUBLIC_ prefix makes these variables available in client code
// Defaulting to your Railway production URL for web, and your local IP for mobile dev.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || (
    Platform.OS === 'web' 
        ? 'https://poth-bookcommunity-service-production.up.railway.app' // Fallback for web
        : 'http://192.168.1.100:5000' // Local IP for mobile dev - REPLACE with your machine IP
);

export const API_BASE_URL = BASE_URL;

export const JSON_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
