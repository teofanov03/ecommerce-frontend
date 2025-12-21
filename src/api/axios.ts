import axios, { InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// Dodavanje tokena iz localStorage-a na svaki zahtev
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Koristimo 'token' jer si ga tako nazvao u AuthContext-u
        const token = localStorage.getItem('token');
        
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;