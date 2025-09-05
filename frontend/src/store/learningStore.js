import { create } from 'zustand';
import axios from 'axios';

const useLearningStore = create((set) => ({
  recommendations: [],
  isLoading: false,
  error: null,

  /**
   * Fetches AI-curated learning recommendations from the backend.
   * @param {string} projectIdea - The user's project idea to get recommendations for.
   * @returns {Promise<Array>} A promise that resolves with the recommendation data.
   */
  fetchRecommendations: async (projectIdea) => {
    set({ isLoading: true, error: null, recommendations: [] });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/learning/recommendations`,
        { projectIdea },
        { withCredentials: true }
      );
      set({ recommendations: response.data.recommendations, isLoading: false });
      return response.data.recommendations;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch recommendations';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));

export default useLearningStore;