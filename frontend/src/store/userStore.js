import { create } from 'zustand';
import axios from 'axios';

const useUserStore = create((set) => ({
  matchedUsers: [],
  isLoading: false,
  error: null,

  /**
   * Fetches users for the Domain Match page based on search and filter criteria.
   * @param {object} params - The query parameters for the API call (e.g., { search: 'react', domain: 'Web Development' }).
   */
  fetchMatchedUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/domain-match`, {
        params,
        withCredentials: true,
      });
      set({ matchedUsers: response.data.users, isLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      set({ error: errorMessage, isLoading: false });
    }
  },
}));

export default useUserStore;