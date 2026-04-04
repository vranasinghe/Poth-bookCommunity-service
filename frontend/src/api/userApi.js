import axios from 'axios';

const API_URL = 'http://192.168.56.1:5000/api/users';

export const registerUserAPI = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
}