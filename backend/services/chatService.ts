import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';
import { logger } from '../utils/logger.js';
import ChatHistory from '../models/ChatHistory.js';

class ChatService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private chatSessions: Map<string, { chat: ChatSession; lastUsed: number }> = new Map();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error('GEMINI_API_KEY is not defined in environment variables');
      throw new Error('GEMINI_API_KEY is not configured');
    }
    
    try {
      logger.info('Initializing Gemini API with key:', { keyLength: apiKey.length });
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      logger.info('Gemini API initialized successfully with model: gemini-1.5-flash');
    } catch (error) {
      logger.error('Failed to initialize Gemini API', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  private async createChatSession(sessionId: string) {
    try {
      logger.info('Creating new chat session', { sessionId });
      const chat = this.model.startChat({
        history: []
      });
      
      // Store session with timestamp
      this.chatSessions.set(sessionId, {
        chat,
        lastUsed: Date.now()
      });
      
      logger.info('Chat session created successfully', { sessionId });
      return chat;
    } catch (error) {
      logger.error('Failed to create chat session', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        sessionId
      });
      throw error;
    }
  }

  private cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of this.chatSessions.entries()) {
      if (now - session.lastUsed > this.SESSION_TIMEOUT) {
        this.chatSessions.delete(sessionId);
        logger.info('Cleaned up expired session', { sessionId });
      }
    }
  }

  async sendMessage(message: string, userId?: string): Promise<string> {
    try {
      logger.info('Sending message to Gemini', { message, userId });
      
      // Clean up expired sessions
      this.cleanupExpiredSessions();
      
      // Use userId as sessionId for conversation continuity
      const sessionId = userId || 'anonymous';
      let chat = this.chatSessions.get(sessionId)?.chat;
      
      if (!chat) {
        chat = await this.createChatSession(sessionId);
      } else {
        // Update last used timestamp
        const session = this.chatSessions.get(sessionId);
        if (session) {
          session.lastUsed = Date.now();
        }
      }
      
      logger.info('Sending message to chat session', { sessionId });
      const result = await chat.sendMessage(message);
      logger.info('Got response from chat session', { sessionId });
      const response = await result.response;
      const text = response.text();
      logger.info('Extracted text from response', { responseLength: text.length, sessionId });
      
      // Save chat history to database if userId is provided
      if (userId) {
        await this.saveChatHistory(userId, message, text);
      }
      
      return text;
    } catch (error) {
      logger.error('Error in chat service', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        userId
      });
      throw error;
    }
  }

  async sendMessageWithFile(message: string, file: Express.Multer.File): Promise<string> {
    try {
      logger.info('Sending message with file to Gemini', { 
        message, 
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype
      });

      // Tạo content parts với type đúng
      const parts = [
        { text: message }
      ];

      // Thêm file vào content
      if (file.mimetype.startsWith('image/')) {
        // Xử lý hình ảnh
        parts.push({
          inlineData: {
            data: file.buffer.toString('base64'),
            mimeType: file.mimetype
          }
        } as any);
      } else {
        // Xử lý text files (PDF, TXT)
        const fileContent = file.buffer.toString('utf-8');
        parts.push({
          text: `\n\nNội dung file "${file.originalname}":\n${fileContent}`
        });
      }

      const result = await this.model.generateContent(parts);
      const response = await result.response;
      const text = response.text();
      logger.info('Extracted text from response with file', { responseLength: text.length });
      return text;
    } catch (error) {
      logger.error('Error in chat service with file', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        fileName: file.originalname
      });
      throw error;
    }
  }

  private async saveChatHistory(userId: string, userMessage: string, assistantMessage: string) {
    try {
      // Find existing chat history or create new one
      let chatHistory = await ChatHistory.findOne({ userId });
      
      if (!chatHistory) {
        chatHistory = new ChatHistory({
          userId,
          messages: [],
          lastMessage: userMessage
        });
      }
      
      // Add new messages
      chatHistory.messages.push(
        { role: 'user', content: userMessage, timestamp: new Date() },
        { role: 'assistant', content: assistantMessage, timestamp: new Date() }
      );
      
      // Keep only last 50 messages to avoid too large documents
      if (chatHistory.messages.length > 50) {
        chatHistory.messages = chatHistory.messages.slice(-50);
      }
      
      chatHistory.lastMessage = userMessage;
      await chatHistory.save();
      
      logger.info('Chat history saved', { userId, messageCount: chatHistory.messages.length });
    } catch (error) {
      logger.error('Error saving chat history', { error, userId });
    }
  }

  async getChatHistory(userId: string): Promise<Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>> {
    try {
      const chatHistory = await ChatHistory.findOne({ userId });
      return chatHistory?.messages || [];
    } catch (error) {
      logger.error('Error getting chat history', { error, userId });
      return [];
    }
  }

  async createNewChat(userId: string): Promise<void> {
    try {
      logger.info('Creating new chat session for user', { userId });
      
      // Clear existing chat session
      this.chatSessions.delete(userId);
      
      // Clear chat history from database
      await ChatHistory.deleteOne({ userId });
      
      // Create new chat session
      await this.createChatSession(userId);
      
      logger.info('New chat session created successfully', { userId });
    } catch (error) {
      logger.error('Error creating new chat', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        userId
      });
      throw error;
    }
  }
}

export default new ChatService();