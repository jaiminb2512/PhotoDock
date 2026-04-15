import api, { API_ENDPOINTS, getApiUrl } from '../utils/api';

const projectService = {
    getProjectByProjectName: async (projectName) => {
        try {
            const url = `${getApiUrl(API_ENDPOINTS.GET_PROJECT.endpoint)}/${projectName}`;
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching project data:', error);
            throw error;
        }
    }
};

export default projectService;
