import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Android Emulator, localhost of host machine = 10.0.2.2
const API_URL = 'http://10.0.2.2:5001/api/blogs';

// Helper to build Authorization header from stored token
const getAuthHeaders = async () => {
    const stored = await AsyncStorage.getItem('userData');
    const user = stored ? JSON.parse(stored) : null;
    return {
        headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : '',
        }
    };
};

// ─── PUBLIC (Anyone can call) ────────────────────────────────────────
export const getBlogs = async () => {
    return await axios.get(API_URL);
};

export const getBlogById = async (id: string) => {
    return await axios.get(`${API_URL}/${id}`);
};

// ─── PROTECTED (Shop Owner JWT required) ─────────────────────────────
export const createBlog = async (blogData: object) => {
    return await axios.post(API_URL, blogData, await getAuthHeaders());
};

export const updateBlog = async (id: string, blogData: object) => {
    return await axios.put(`${API_URL}/${id}`, blogData, await getAuthHeaders());
};

export const deleteBlog = async (id: string) => {
    return await axios.delete(`${API_URL}/${id}`, await getAuthHeaders());
};

// ─── Likes & Comments ─────────────────────────────────────────────────────────
export const toggleLike = async (id: string) => {
    return await axios.post(`${API_URL}/${id}/like`, {}, await getAuthHeaders());
};

export const getComments = async (id: string) => {
    return await axios.get(`${API_URL}/${id}/comments`);
};

export const addComment = async (id: string, text: string) => {
    return await axios.post(`${API_URL}/${id}/comments`, { text }, await getAuthHeaders());
};
