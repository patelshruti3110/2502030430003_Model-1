import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// User APIs
export const userAPI = {
    signup: (data) => axiosInstance.post('/users/signup', data),
    login: (data) => axiosInstance.post('/users/login', data),
    getProfile: () => axiosInstance.get('/users/profile'),
};

// Portfolio APIs
export const portfolioAPI = {
    create: (data) => axiosInstance.post('/portfolio/create', data),
    get: () => axiosInstance.get('/portfolio/get'),
    getByUserId: (userId) => axiosInstance.get(`/portfolio/user/${userId}`),
};

// Project APIs
export const projectAPI = {
    add: (data) => axiosInstance.post('/projects/add', data),
    get: () => axiosInstance.get('/projects/get'),
    getAll: () => axiosInstance.get('/projects/all'),
    getByUserId: (userId) => axiosInstance.get(`/projects/user/${userId}`),
    update: (id, data) => axiosInstance.put(`/projects/${id}`, data),
    delete: (id) => axiosInstance.delete(`/projects/${id}`),
};

export default axiosInstance;
