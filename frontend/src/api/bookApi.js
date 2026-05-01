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
