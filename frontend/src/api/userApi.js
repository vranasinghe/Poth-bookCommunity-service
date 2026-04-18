import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5001/api/users';

export const registerUserAPI = async (userData: object) => {
    return await axios.post(`${API_URL}/register`, userData);
};

export const loginUserAPI = async (userData: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.data));
    }
    return response;
};

export const logoutUserAPI = async () => {
    await AsyncStorage.removeItem('userData');
};