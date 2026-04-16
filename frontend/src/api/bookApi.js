import axios from 'axios';

const API_URL = 'http://192.168.56.1:5000/api/books';

export const getBooksAPI = async () => {
    return await axios.get(API_URL);
};

export const getBookByIdAPI = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};

export const getBooksByShopAPI = async (shopId) => {
    return await axios.get(`${API_URL}/shop/${shopId}`);
};
