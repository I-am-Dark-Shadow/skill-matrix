import { Chat } from '../models/chat.model.js';
import { geminiModel } from '../config/gemini.js';

/**
 * @desc    Get all chat sessions for the logged-in user
 * @route   GET /api/v1/chats
 */
export const getUserChatsController = async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user._id })
            .select('title createdAt updatedAt')
            .sort({ updatedAt: -1 });
        res.status(200).json({ chats });
    } catch (error) {
        console.error('Error in getUserChatsController:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get the history of a specific chat
 * @route   GET /api/v1/chats/:chatId
 */
export const getChatHistoryController = async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user._id });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json({ chat });
    } catch (error) {
        console.error('Error in getChatHistoryController:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Send a message and get AI response
 * @route   POST /api/v1/chats/send
 */
export const generateChatResponseController = async (req, res) => {
    try {
        const { prompt, chatId } = req.body;
        let chat;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        if (chatId) {
            chat = await Chat.findOne({ _id: chatId, user: req.user._id });
            if (!chat) return res.status(404).json({ message: 'Chat not found' });
        } else {
            // Create a new chat session
            const shortTitle = prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '');
            chat = await Chat.create({ user: req.user._id, title: shortTitle, history: [] });
        }

        // Add user's new prompt to the chat history
        chat.history.push({ role: 'user', parts: prompt });

        const geminiChat = geminiModel.startChat({
            history: chat.history.map(msg => ({ 
                role: msg.role, 
                parts: [{ text: msg.parts }] 
            })),
        });
        
        const result = await geminiChat.sendMessage(prompt);
        const modelResponse = await result.response.text();

        // Add model's response to the chat history
        chat.history.push({ role: 'model', parts: modelResponse });

        await chat.save();
        
        res.status(200).json({ response: modelResponse, chat });

    } catch (error) {
        console.error('Error in generateChatResponseController:', error);
        res.status(500).json({ message: 'Failed to get response from AI' });
    }
};