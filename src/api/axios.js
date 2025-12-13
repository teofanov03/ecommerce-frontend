// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
});

// Add token from localStorage to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;