import api, { API_ENDPOINTS } from '../utils/api';

const serviceService = {
    getServices: async () => {
        const response = await api({
            method: API_ENDPOINTS.GET_SERVICES.method,
            url: API_ENDPOINTS.GET_SERVICES.endpoint
        });
        return response.data.data;
    }
};

export default serviceService;
