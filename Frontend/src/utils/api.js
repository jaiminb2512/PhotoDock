import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
    // Auth
    LOGIN: { method: 'POST', endpoint: '/users/login' },
    REGISTER: { method: 'POST', endpoint: '/users/register' },
    GET_ME: { method: 'GET', endpoint: '/users/me' },

    // Photos
    GET_PHOTOS: { method: 'GET', endpoint: '/photos' },
    CREATE_PHOTO: { method: 'POST', endpoint: '/photos' },
    BULK_PHOTOS: { method: 'POST', endpoint: '/photos/bulk' },

    // Services
    GET_SERVICES: { method: 'GET', endpoint: '/services' },
    CREATE_SERVICE: { method: 'POST', endpoint: '/services' },
    UPDATE_SERVICE: { method: 'PUT', endpoint: '/services' },
    DELETE_SERVICE: { method: 'DELETE', endpoint: '/services' },
    UPDATE_PROJECT: { method: 'PUT', endpoint: '/projects' },

    // Admin
    ADMIN_CREATE: { method: 'POST', endpoint: '/projects/admin-create' },

    // Project
    GET_PROJECT: { method: 'GET', endpoint: '/projects' },
    SUBSCRIPTION_PLANS: { method: 'GET', endpoint: '/subscription-plans' }
};

export const getApiUrl = (endpoint) => `${baseURL}${endpoint}`;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

export default api;
