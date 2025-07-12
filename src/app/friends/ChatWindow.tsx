import React, { useRef, useEffect } from 'react';

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
}

export default function ChatWindow({ messages, currentUserId }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map(msg => (
        <div key={msg.id} className={`mb-2 flex ${msg.from === currentUserId ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${msg.from === currentUserId ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border'}`}>
            {msg.content}
            <div className="text-[10px] text-right text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
} 