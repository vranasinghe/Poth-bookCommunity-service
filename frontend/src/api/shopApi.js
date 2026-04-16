import axios from 'axios';

const API_URL = 'http://192.168.56.1:5000/api/shops';

export const getShopsAPI = async () => {
    return await axios.get(API_URL);
};

export const getShopByIdAPI = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};
