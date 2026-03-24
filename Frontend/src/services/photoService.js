import api, { API_ENDPOINTS } from '../utils/api';

const photoService = {
    getPhotos: async () => {
        const response = await api({
            method: API_ENDPOINTS.GET_PHOTOS.method,
            url: API_ENDPOINTS.GET_PHOTOS.endpoint
        });
        return response.data.data;
    }
};

export default photoService;
