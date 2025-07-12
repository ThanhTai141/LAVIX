import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { validateFileUpload } from '../middlewares/fileUploadMiddleware.js';
import chatService from '../services/chatService.js';
import { logger } from '../utils/logger.js';
const router = Router();
router.post('/chat', protect, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user?._id;
        if (!message) {
            logger.warn('Chat request missing message');
            res.status(400).json({ error: 'Message is required' });
            return;
        }
        logger.info('Processing chat request', { message, userId });
        const response = await chatService.sendMessage(message);
        logger.info('Chat response received', { responseLength: response.length, userId });
        res.json({ response });
    }
    catch (error) {
        logger.error('Gemini API Error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        res.status(500).json({
            error: 'Failed to get response from Gemini',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Route mới cho chat với file upload
router.post('/chat-with-file', protect, validateFileUpload, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user?._id;
        const file = req.file;
        if (!message) {
            logger.warn('Chat with file request missing message');
            res.status(400).json({ error: 'Message is required' });
            return;
        }
        if (!file) {
            logger.warn('Chat with file request missing file');
            res.status(400).json({ error: 'File is required' });
            return;
        }
        logger.info('Processing chat with file request', { message, userId, fileName: file.originalname });
        const response = await chatService.sendMessageWithFile(message, file);
        res.json({ response });
    }
    catch (error) {
        logger.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Route tạo chat mới
router.post('/new-chat', protect, async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            logger.warn('New chat request missing user ID');
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        logger.info('Creating new chat session', { userId });
        await chatService.createNewChat(userId);
        res.json({ message: 'New chat session created successfully' });
    }
    catch (error) {
        logger.error('Error creating new chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/history', protect, async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const history = await chatService.getChatHistory(userId);
        res.json({ history });
    }
    catch (error) {
        logger.error('Error getting chat history:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            userId: req.user?._id
        });
        res.status(500).json({
            error: 'Failed to get chat history',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default router;
