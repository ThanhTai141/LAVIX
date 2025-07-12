import React from 'react';
import type { Message } from '../../../shared/types/chat';

interface DebugMessage extends Message {
  isOptimistic?: boolean;
  clientMessageId?: string;
}

interface DebugInfoProps {
  selectedFriend: string | null;
  messages: DebugMessage[];
  isVisible: boolean;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ selectedFriend, messages, isVisible }) => {
  if (!isVisible) return null;

  const recentMessages = messages.slice(-5).map(msg => ({
    id: msg.id,
    text: msg.text,
    sender: msg.sender,
    isOptimistic: msg.isOptimistic || false,
    clientMessageId: msg.clientMessageId || 'N/A'
  }));

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="mb-2">
        <strong>Selected Friend:</strong> {selectedFriend || 'None'}
      </div>
      <div className="mb-2">
        <strong>Messages Count:</strong> {messages.length}
      </div>
      <div className="mb-2">
        <strong>Recent Messages:</strong>
        <div className="mt-1 space-y-1">
          {recentMessages.map((msg, index) => (
            <div key={index} className="pl-2 border-l-2 border-gray-600">
              <div><strong>ID:</strong> {msg.id}</div>
              <div><strong>Client ID:</strong> {msg.clientMessageId}</div>
              <div><strong>Sender:</strong> {msg.sender}</div>
              <div><strong>Text:</strong> {msg.text}</div>
              <div><strong>Optimistic:</strong> {msg.isOptimistic ? 'Yes' : 'No'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 