import { useState, useCallback } from 'react';
import { searchAPI } from '../../../shared/services/api';
import type { User } from '../../../shared/types/chat';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const response = await searchAPI.searchUsers(query);
      const apiUsers = response.data.users;
      
      const formattedUsers: User[] = apiUsers.map(u => ({
        id: u._id || u.id || '',
        name: u.fullName,
        avatar: u.avatar || '👤',
        isOnline: u.isOnline ?? false,
        lastSeen: u.lastSeen,
      }));
      
      setSearchResults(formattedUsers);
    } catch {
      setError('Không thể tìm kiếm người dùng');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    error,
    searchUsers,
    clearSearch,
  };
}; 