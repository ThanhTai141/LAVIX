import React from 'react';
import { Friend } from './FriendList';

interface ChatHeaderProps {
  friend: Friend;
}

export default function ChatHeader({ friend }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b bg-white">
      <div className="relative w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        {friend.avatar ? (
          <img src={friend.avatar} alt={friend.fullName} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-lg font-semibold text-gray-500">{friend.fullName.charAt(0).toUpperCase()}</span>
        )}
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
      </div>
      <div className="flex-1">
        <div className="font-medium">{friend.fullName}</div>
        <div className="text-xs text-gray-500">
          {friend.isOnline ? 'Online' : friend.lastSeen ? `Offline • ${new Date(friend.lastSeen).toLocaleTimeString()}` : 'Offline'}
        </div>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded" title="Gọi thoại"><span role="img" aria-label="call">📞</span></button>
      <button className="p-2 hover:bg-gray-100 rounded" title="Video call"><span role="img" aria-label="video">🎥</span></button>
      <button className="p-2 hover:bg-gray-100 rounded" title="Thông tin"><span role="img" aria-label="info">ℹ️</span></button>
    </div>
  );
} 