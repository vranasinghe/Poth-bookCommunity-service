import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/blogs`;

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
// Uses fetch (not axios) because React Native's fetch handles FormData
// multipart boundaries correctly — axios strips them and breaks file upload.
export const createBlog = async (formData) => {
    const stored = await AsyncStorage.getItem('userData');
    const token = stored ? JSON.parse(stored)?.token : '';

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            // ⚠️ Do NOT set Content-Type here — fetch sets it automatically
            //    with the correct multipart boundary for FormData
        },
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
};

export const updateBlog = async (id, formData) => {
    const stored = await AsyncStorage.getItem('userData');
    const token = stored ? JSON.parse(stored)?.token : '';

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            // ⚠️ Do NOT set Content-Type here
        },
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
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
