import React from 'react';

export interface Friend {
  id: string;
  fullName: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface FriendListProps {
  friends: Friend[];
  selectedFriendId?: string;
  onSelect: (friend: Friend) => void;
}

export default function FriendList({ friends, selectedFriendId, onSelect }: FriendListProps) {
  return (
    <ul className="space-y-2">
      {friends.map(friend => (
        <li
          key={friend.id}
          className={`flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-blue-50 ${selectedFriendId === friend.id ? 'bg-blue-100' : ''}`}
          onClick={() => onSelect(friend)}
        >
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
        </li>
      ))}
    </ul>
  );
} 