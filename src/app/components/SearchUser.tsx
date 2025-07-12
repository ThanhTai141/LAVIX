import React, { useState } from 'react';
import axios from 'axios';
import FriendButton from './FriendButton';

interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

interface SearchUserProps {
  friends: { _id?: string; id?: string }[];
}

const SearchUser: React.FC<SearchUserProps> = ({ friends }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2) {
      setError('Nhập ít nhất 2 ký tự để tìm kiếm');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/search?q=${encodeURIComponent(query)}`, { withCredentials: true });
      setResults(res.data.users);
    } catch {
      setError('Không thể tìm kiếm user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Tìm kiếm bạn bè theo tên hoặc email..."
          className="border rounded px-3 py-2 flex-1"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Tìm kiếm</button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {isLoading && <div className="mt-2">Đang tìm kiếm...</div>}
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map(user => {
            const isFriend = friends.some(f => (f._id) === (user._id));
            if (isFriend) return (
              <div key={user._id} className="flex items-center justify-between p-2 bg-gray-50 rounded shadow">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-base font-semibold text-gray-500">{user.fullName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              </div>
            );
            return (
              <div key={user._id} className="flex items-center justify-between p-2 bg-gray-50 rounded shadow">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-base font-semibold text-gray-500">{user.fullName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                <FriendButton userId={user._id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchUser; 