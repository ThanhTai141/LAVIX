import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { messagesAPI } from '../../../shared/services/api';
import { useOptimisticUpdates } from './useOptimisticUpdates';
import type { Message, Chat, SendMessageData } from '../../../shared/types/chat';

export const useChat = (userId: string | undefined) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const { addOptimisticMessage, generateClientMessageId } = useOptimisticUpdates();

  // Socket connection
  useEffect(() => {
    if (!userId) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      query: { userId },
      transports: ['websocket'],
      withCredentials: true,
    });
    socketRef.current = socket;

    // Handle incoming messages (chỉ cho người nhận)
    socket.on('receive_message', (msg: { _id: string; from: string; to: string; content: string; timestamp: string; clientMessageId?: string }) => {
      console.log('Received message:', msg);
      // Chỉ xử lý tin nhắn từ người khác, không phải từ chính mình
      if (msg.from !== userId) {
        console.log('Processing received message from other user');
        setChats(prev => {
          const friendId = msg.from;
          const idx = prev.findIndex(chat => chat.friendId === friendId);
          const newMsg: Message = {
            id: msg._id,
            text: msg.content,
            sender: 'friend',
            timestamp: new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          };

          if (idx !== -1) {
            const newChats = [...prev];
            // Check if message already exists to avoid duplicates
            const messageExists = newChats[idx].messages.some(m => m.id === msg._id);
            if (!messageExists) {
              console.log('Adding new message to existing chat');
              newChats[idx].messages = [...newChats[idx].messages, newMsg];
            } else {
              console.log('Message already exists, skipping');
            }
            return newChats;
          } else {
            console.log('Creating new chat with message');
            return [...prev, { friendId, messages: [newMsg] }];
          }
        });
      } else {
        console.log('Ignoring own message in receive_message');
      }
    });

    // Handle online/offline status - will be handled by useFriends hook
    socket.on('user_online', () => {
      // This will be handled by useFriends hook
    });

    socket.on('user_offline', () => {
      // This will be handled by useFriends hook
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Fetch chat history
  const fetchChatHistory = useCallback(async (friendId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await messagesAPI.getMessages(friendId);
      const apiMessages = response.data.messages;
      
      const formattedMessages: Message[] = apiMessages.map(m => ({
        id: m._id,
        text: m.content,
        sender: (m.from === userId ? 'me' : 'friend') as 'me' | 'friend',
        timestamp: new Date(m.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      }));

      setChats(prev => {
        const filtered = prev.filter(c => c.friendId !== friendId);
        return [...filtered, { friendId, messages: formattedMessages }];
      });
    } catch {
      setError('Không thể tải tin nhắn');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !selectedFriend || !socketRef.current) return false;

    const clientMessageId = generateClientMessageId();
    const messageData: SendMessageData = {
      from: userId!,
      to: selectedFriend,
      content: content.trim(),
      clientMessageId
    };

    try {
      console.log('Sending message:', messageData);
      
      // Add optimistic message with clientMessageId
      const optimisticId = addOptimisticMessage(content.trim(), 'me', clientMessageId);
      console.log('Added optimistic message with ID:', optimisticId);
      
      // Update UI immediately
      setChats(prev => {
        const idx = prev.findIndex(chat => chat.friendId === selectedFriend);
        const optimisticMsg: Message = {
          id: optimisticId,
          text: content.trim(),
          sender: 'me',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };

        if (idx !== -1) {
          const newChats = [...prev];
          // Check if message already exists to avoid duplicates
          const messageExists = newChats[idx].messages.some(m => m.id === optimisticId);
          if (!messageExists) {
            newChats[idx].messages = [...newChats[idx].messages, optimisticMsg];
            console.log('Added optimistic message to UI');
          } else {
            console.log('Message already exists, skipping');
          }
          return newChats;
        } else {
          console.log('Creating new chat with optimistic message');
          return [...prev, { friendId: selectedFriend, messages: [optimisticMsg] }];
        }
      });

      // Send to server
      socketRef.current.emit('send_message', messageData);
      console.log('Emitted send_message to server');

      return true;
    } catch {
      setError('Không thể gửi tin nhắn');
      return false;
    }
  }, [selectedFriend, userId, addOptimisticMessage, generateClientMessageId]);

  // Select friend to chat
  const selectFriend = useCallback((friendId: string) => {
    setSelectedFriend(friendId);
    fetchChatHistory(friendId);
  }, [fetchChatHistory]);

  // Get current chat messages
  const getCurrentChat = useCallback((): Message[] => {
    if (!selectedFriend) return [];
    const chat = chats.find(c => c.friendId === selectedFriend);
    return chat?.messages || [];
  }, [selectedFriend, chats]);

  return {
    chats,
    selectedFriend,
    isLoading,
    error,
    sendMessage,
    selectFriend,
    getCurrentChat,
    setSelectedFriend,
  };
}; 