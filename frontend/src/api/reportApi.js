import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/reports`;

export const previewReportAPI = async (shopId, token) => {
    return await axios.get(`${API_URL}/preview/${shopId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const createReportAPI = async (shopId, formData, token) => {
    // using fetch for multipart form data
    const response = await fetch(`${API_URL}/${shopId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return { data };
};

export const getMyReportsAPI = async (token) => {
    return await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
