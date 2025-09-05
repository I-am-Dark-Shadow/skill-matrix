import { create } from 'zustand';
import axios from 'axios';

const useTeamStore = create((set) => ({
  // State variables
  generatedTeam: [],
  currentTeam: null,
  projectSuggestions: [],
  isLoading: false,
  isSuggestionsLoading: false,
  error: null,

  /**
   * Calls the AI backend to generate a list of potential teammates.
   */
  generateTeam: async () => {
    set({ isLoading: true, error: null, generatedTeam: [] });
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/teams/generate`, {}, { withCredentials: true });
      set({ generatedTeam: response.data.teammates, isLoading: false });
      return response.data.teammates;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to generate team';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  /**
   * Creates a new team with the specified members and AI-assigned roles.
   */
  createTeam: async (teamData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/teams/create`, teamData, { withCredentials: true });
      set({ generatedTeam: [], isLoading: false });
      return response.data;
    } catch (error) {
       const errorMessage = error.response?.data?.message || 'Failed to create team';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Fetches the details of the currently logged-in user's team.
   */
  fetchTeamDetails: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/teams/details`, { withCredentials: true });
      set({ currentTeam: response.data.team, isLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch team details';
      set({ error: errorMessage, isLoading: false, currentTeam: null });
    }
  },

  /**
   * Fetches AI-powered project suggestions for the user's team.
   */
  fetchProjectSuggestions: async () => {
    set({ isSuggestionsLoading: true, error: null });
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/teams/suggestions`, { withCredentials: true });
      set({ projectSuggestions: response.data.suggestions, isSuggestionsLoading: false });
      return response.data.suggestions;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch suggestions';
      set({ error: errorMessage, isSuggestionsLoading: false });
      throw new Error(errorMessage);
    }
  },
}));

export default useTeamStore;