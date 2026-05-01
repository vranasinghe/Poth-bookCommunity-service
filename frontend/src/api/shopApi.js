import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/shops`;

export const getShopsAPI = async () => {
    return await axios.get(API_URL);
};

export const getShopByIdAPI = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};

export const createShopAPI = async (shopData, token) => {
    return await axios.post(API_URL, shopData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getShopsByOwnerAPI = async (token) => {
    return await axios.get(`${API_URL}/owner/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateShopAPI = async (id, shopData, token) => {
    return await axios.put(`${API_URL}/${id}`, shopData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const deleteShopAPI = async (id, token) => {
    return await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
