import { useState, useCallback } from 'react';
import type { Message } from '../../../shared/types/chat';

interface OptimisticMessage extends Message {
  isOptimistic: boolean;
  clientMessageId: string;
}

interface ServerMessage {
  _id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  clientMessageId?: string;
}

export const useOptimisticUpdates = () => {
  const [optimisticMessages, setOptimisticMessages] = useState<Map<string, OptimisticMessage>>(new Map());

  // Generate unique client message ID
  const generateClientMessageId = useCallback(() => {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add optimistic message with clientMessageId
  const addOptimisticMessage = useCallback((content: string, sender: 'me' | 'friend', clientMessageId?: string) => {
    const id = clientMessageId || generateClientMessageId();
    const optimisticMessage: OptimisticMessage = {
      id,
      text: content,
      sender,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isOptimistic: true,
      clientMessageId: id
    };
    
    setOptimisticMessages(prev => new Map(prev).set(id, optimisticMessage));
    return id;
  }, [generateClientMessageId]);

  // Replace optimistic message with server message
  const replaceOptimisticMessage = useCallback((clientMessageId: string, serverMessage: ServerMessage) => {
    setOptimisticMessages(prev => {
      const newMap = new Map(prev);
      newMap.delete(clientMessageId);
      return newMap;
    });
    return serverMessage;
  }, []);

  // Check if message is optimistic
  const isOptimisticMessage = useCallback((messageId: string) => {
    return optimisticMessages.has(messageId);
  }, [optimisticMessages]);

  // Get optimistic message
  const getOptimisticMessage = useCallback((messageId: string) => {
    return optimisticMessages.get(messageId);
  }, [optimisticMessages]);

  return {
    addOptimisticMessage,
    replaceOptimisticMessage,
    isOptimisticMessage,
    getOptimisticMessage,
    generateClientMessageId,
    optimisticMessages
  };
}; 