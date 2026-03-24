import api, { API_ENDPOINTS } from '../utils/api';

const authService = {
    // Register a new user
    register: async (userData) => {
        try {
            const response = await api({
                method: API_ENDPOINTS.REGISTER.method,
                url: API_ENDPOINTS.REGISTER.endpoint,
                data: userData
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await api({
                method: API_ENDPOINTS.LOGIN.method,
                url: API_ENDPOINTS.LOGIN.endpoint,
                data: credentials
            });
            const { token, ...user } = response.data.data; // Assuming backends sends { success: true, message: "...", data: { token, ...user } }
            
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Logout user
    logout: async () => {
        try {
            // Optional: call backend logout endpoint
            // await api.post('/users/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { success: true };
        } catch (error) {
            console.error('Logout failed:', error);
            // Still remove from localStorage even if API fails
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw error;
        }
    },

    // Verify token and get current user
    verifyToken: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return { valid: false };
            }

            const response = await api({
                method: API_ENDPOINTS.GET_ME.method,
                url: API_ENDPOINTS.GET_ME.endpoint
            });
            if (response.status === 200) {
                // Update user data in storage if it changed
                const user = response.data.data;
                localStorage.setItem('user', JSON.stringify(user));
                return { valid: true, user };
            }
            return { valid: false };
        } catch (error) {
            console.error('Verify token failed:', error);
            // If token is invalid or expired, clear storage
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            return { valid: false };
        }
    },

    // Helper to get current stored user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;
