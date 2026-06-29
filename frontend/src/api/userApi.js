import axios from 'axios';
import { API_BASE_URL, JSON_HEADERS } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/users`;

export const registerUserAPI = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData, { headers: JSON_HEADERS });
};

export const loginUserAPI = async (credentials) => {
    return await axios.post(`${API_URL}/login`, credentials, { headers: JSON_HEADERS });
};

export const updateUserAPI = async (userData, token) => {
    return await axios.put(`${API_URL}/profile`, userData, {
        headers: {
            ...JSON_HEADERS,
            Authorization: `Bearer ${token}`
        }
    });
};

export const deleteUserAPI = async (token) => {
    return await axios.delete(`${API_URL}/profile`, {
        headers: {
            ...JSON_HEADERS,
            Authorization: `Bearer ${token}`
        }
    });
};