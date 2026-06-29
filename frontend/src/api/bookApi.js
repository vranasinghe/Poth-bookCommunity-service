import { Platform } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/books`;

export const getBooksAPI = async () => {
    return await axios.get(API_URL);
};

export const getBookByIdAPI = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};

export const getBooksByShopAPI = async (shopId) => {
    return await axios.get(`${API_URL}/shop/${shopId}`);
};

export const getBooksByOwnerAPI = async (token) => {
    return await axios.get(`${API_URL}/owner/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const createBookAPI = async (bookData, token) => {
    const isFormData = bookData instanceof FormData;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' })
        }
    };

    if (Platform.OS === 'web' && isFormData) {
        delete config.headers['Content-Type'];
    }

    return await axios.post(API_URL, bookData, config);
};

export const updateBookAPI = async (id, bookData, token) => {
    const isFormData = bookData instanceof FormData;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' })
        }
    };

    if (Platform.OS === 'web' && isFormData) {
        delete config.headers['Content-Type'];
    }

    return await axios.put(`${API_URL}/${id}`, bookData, config);
};

export const deleteBookAPI = async (id, token) => {
    return await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
