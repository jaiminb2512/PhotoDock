import api, { API_ENDPOINTS } from '../utils/api';

const photoService = {
    getPhotos: async (filters = {}) => {
        const response = await api({
            method: API_ENDPOINTS.GET_PHOTOS.method,
            url: API_ENDPOINTS.GET_PHOTOS.endpoint,
            params: filters
        });
        return response.data.data;
    },
    savePhotos: async (formData) => {
        const response = await api({
            method: API_ENDPOINTS.CREATE_PHOTO.method,
            url: API_ENDPOINTS.CREATE_PHOTO.endpoint,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};


export default photoService;
