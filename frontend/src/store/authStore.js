import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Will hold the logged-in user's data
      token: null, // Will hold the JWT access token
      
      /**
       * Sets the user and token in the state after a successful login.
       * @param {object} data - The data received from the login API, containing user and token.
       */
      setUser: (data) => set({ user: data.user, token: data.token }),
      
      /**
       * Clears the user and token from the state on logout.
       */
      logoutUser: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // The key used to save the data in localStorage
    }
  )
);

export default useAuthStore;