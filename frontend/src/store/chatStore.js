import { create } from 'zustand';
import axios from 'axios';

const useChatStore = create((set, get) => ({
  chatList: [],
  activeChat: null,
  isListLoading: false,
  isResponseLoading: false,

  /**
   * Fetches the list of chat titles for the side panel.
   */
  fetchChatList: async () => {
    set({ isListLoading: true });
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chats`, { withCredentials: true });
      set({ chatList: response.data.chats, isListLoading: false });
    } catch (error) {
      console.error("Failed to fetch chat list", error);
      set({ isListLoading: false });
    }
  },

  /**
   * Fetches the full message history for a specific chat ID.
   * @param {string} chatId - The ID of the chat to fetch.
   */
  fetchChatHistory: async (chatId) => {
    set({ activeChat: null, isResponseLoading: true });
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chats/${chatId}`, { withCredentials: true });
      set({ activeChat: response.data.chat, isResponseLoading: false });
    } catch (error) {
      console.error("Failed to fetch chat history", error);
      set({ isResponseLoading: false });
    }
  },
  
  /**
   * Sends a message to the AI and updates the active chat.
   * @param {string} prompt - The user's message.
   */
  sendMessage: async (prompt) => {
    set({ isResponseLoading: true });
    const currentChat = get().activeChat;
    
    // Optimistically update the UI with the user's message immediately
    if (currentChat) {
      set(state => ({ activeChat: { ...state.activeChat, history: [...state.activeChat.history, { role: 'user', parts: prompt }] }}));
    } else {
      set({ activeChat: { history: [{ role: 'user', parts: prompt }] } });
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chats/send`, 
        { prompt, chatId: currentChat?._id },
        { withCredentials: true }
      );
      // Update the state with the final history from the backend
      set({ activeChat: response.data.chat, isResponseLoading: false });
      
      // If it was a new chat, refresh the list of chats
      if (!currentChat) {
        get().fetchChatList();
      }
    } catch (error) {
        console.error("Failed to send message", error);
        // Revert the optimistic update on error if needed
        set({ isResponseLoading: false });
    }
  },
  
  /**
   * Resets the active chat to start a new conversation.
   */
  createNewChat: () => {
    set({ activeChat: null });
  },

}));

export default useChatStore;