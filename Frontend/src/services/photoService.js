import api, { API_ENDPOINTS } from '../utils/api';

const photoService = {
    getPhotos: async (filters = {}) => {
        const response = await api({
            method: API_ENDPOINTS.GET_PHOTOS.method,
            url: API_ENDPOINTS.GET_PHOTOS.endpoint,
            params: filters
        });
        return response.data.data;
    }
};

export default photoService;
