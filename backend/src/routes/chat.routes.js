import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { 
    getUserChatsController, 
    getChatHistoryController, 
    generateChatResponseController 
} from '../controllers/chat.controller.js';

const router = Router();

// Apply the JWT verification middleware to all routes in this file
router.use(verifyJWT);

// @route   GET /api/v1/chats
// @desc    Gets the list of all chat sessions for the user
router.get('/', getUserChatsController);

// @route   GET /api/v1/chats/:chatId
// @desc    Gets the full history of a specific chat session
router.get('/:chatId', getChatHistoryController);

// @route   POST /api/v1/chats/send
// @desc    Sends a new message and gets a response from the AI
router.post('/send', generateChatResponseController);

export default router;