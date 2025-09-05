import { create } from 'zustand';
import axios from 'axios';

const useProjectStore = create((set) => ({
  projects: [],
  isLoading: false,
  error: null,

  /**
   * Fetches all projects for the logged-in user from the backend.
   */
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/projects`, { withCredentials: true });
      set({ projects: response.data.projects, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch projects', isLoading: false });
    }
  },

  /**
   * Adds a new project by sending form data (including an image) to the backend.
   * @param {FormData} formData - The project data from the form.
   */
  addProject: async (formData) => {
    set({ isLoading: true });
    // Note: We wrap this in a promise to handle errors in the component
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/projects`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              withCredentials: true,
            });
            set((state) => ({
              projects: [response.data.project, ...state.projects],
              isLoading: false,
            }));
            resolve(response.data);
        } catch(error) {
            set({ isLoading: false, error: error.response?.data?.message });
            reject(error);
        }
    });
  },
  
  /**
   * Deletes a project by its ID.
   * @param {string} projectId - The ID of the project to delete.
   */
  deleteProject: async (projectId) => {
    // Optimistic UI update can be complex, so we'll just refetch for simplicity
    // A more advanced implementation could remove the project from state immediately.
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/projects/${projectId}`, { withCredentials: true });
    set((state) => ({
        projects: state.projects.filter((p) => p._id !== projectId),
    }));
  },
}));

export default useProjectStore;