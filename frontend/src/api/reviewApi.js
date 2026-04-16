import axios from 'axios';

const API_URL = 'http://192.168.56.1:5000/api/reviews';

export const getReviewsAPI = async (targetId) => {
    return await axios.get(`${API_URL}/${targetId}`);
};

export const addReviewAPI = async (reviewData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    return await axios.post(API_URL, reviewData, config);
};
