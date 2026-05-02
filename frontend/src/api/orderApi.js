import axios from 'axios';
import { API_BASE_URL, JSON_HEADERS } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/orders`;


// Create a new order
export const createOrderAPI = async (orderData) => {
    return await axios.post(`${API_URL}`, orderData, { headers: JSON_HEADERS });
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
