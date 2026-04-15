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
    },

    getAllProjects: async () => {
        try {
            const url = getApiUrl(API_ENDPOINTS.GET_PROJECT.endpoint);
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching all projects:', error);
            throw error;
        }
    },

    updateProject: async (projectData) => {
        try {
            const url = getApiUrl(API_ENDPOINTS.UPDATE_PROJECT?.endpoint);
            const response = await api.put(url, projectData);
            return response.data;
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    }
};

export default projectService;
