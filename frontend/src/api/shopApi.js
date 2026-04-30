import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/shops`;

export const getShopsAPI = async () => {
    return await axios.get(API_URL);
};

export const getShopByIdAPI = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};
