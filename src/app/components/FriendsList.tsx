import React, { useState } from 'react';
import axios from 'axios';
import FriendButton from './FriendButton';
import SearchUser from './SearchUser';

interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

interface FriendsListProps {
  friends: User[];
  isLoading: boolean;
  error: string | null;
  onReload: () => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, isLoading, error, onReload }) => {
  const [search, setSearch] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.fullName.toLowerCase().includes(search.toLowerCase()) ||
    friend.email.toLowerCase().includes(search.toLowerCase())
  );

    return (
    <div>
      <SearchUser friends={friends} />
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm trong danh sách bạn bè..."
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      {isLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
      ) : error ? (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button
            onClick={onReload}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
      ) : filteredFriends.length === 0 ? (
      <div className="text-center text-gray-500 p-4">
          <p>Bạn chưa có bạn bè nào phù hợp.</p>
      </div>
      ) : (
        <div className="space-y-4 mt-6">
          {filteredFriends.map((friend) => (
        <div
          key={friend.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {friend?.avatar ? (
                <img
                  src={friend.avatar}
                  alt={friend.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-gray-500">
                      {friend?.fullName ? friend.fullName.charAt(0).toUpperCase() : '?'}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{friend.fullName}</h3>
              <p className="text-sm text-gray-500">{friend.email}</p>
            </div>
          </div>
          <FriendButton userId={friend.id} />
        </div>
      ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList; 