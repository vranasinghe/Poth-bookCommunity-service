import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, JSON_HEADERS } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/orders`;


// Create a new order
export const createOrderAPI = async (orderData) => {
    // If orderData is NOT FormData, use axios as usual
    if (!(orderData instanceof FormData)) {
        return await axios.post(`${API_URL}`, orderData, { headers: JSON_HEADERS });
    }

    // For FormData (file uploads), use fetch to avoid axios boundary issues in React Native
    const stored = await AsyncStorage.getItem('@poth_user');
    const token = stored ? JSON.parse(stored)?.token : '';

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            // Do NOT set Content-Type for FormData
        },
        body: orderData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw { response: { data, status: response.status } };
    }
    return { data };
};


// Get orders for a specific reader
export const getReaderOrdersAPI = async (readerId) => {
    return await axios.get(`${API_URL}/reader/${readerId}`, { headers: JSON_HEADERS });
};

// Get orders for a specific shop
export const getShopOrdersAPI = async (shopId) => {
    return await axios.get(`${API_URL}/shop/${shopId}`, { headers: JSON_HEADERS });
};

// Update order status
export const updateOrderStatusAPI = async (orderId, status) => {
    return await axios.put(`${API_URL}/${orderId}/status`, { status }, { headers: JSON_HEADERS });
};

// Update order delivery details
export const updateOrderDeliveryAPI = async (orderId, deliveryDetails) => {
    return await axios.put(`${API_URL}/${orderId}/delivery`, { deliveryDetails }, { headers: JSON_HEADERS });
};

// Delete/Cancel an order
export const deleteOrderAPI = async (orderId) => {
    return await axios.delete(`${API_URL}/${orderId}`, { headers: JSON_HEADERS });
};
