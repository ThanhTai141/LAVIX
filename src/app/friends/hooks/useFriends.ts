import { useState, useEffect, useCallback } from 'react';
import { friendsAPI } from '../../../shared/services/api';
import type { User, FriendRequest } from '../../../shared/types/chat';

export const useFriends = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await friendsAPI.getFriends();
      const apiFriends = response.data.friends;
      
      const formattedFriends: User[] = apiFriends.map(f => ({
        id: f._id || f.id || '',
        name: f.fullName,
        avatar: f.avatar || '👤',
        isOnline: f.isOnline ?? false,
        lastSeen: f.lastSeen,
      }));
      
      setFriends(formattedFriends);
    } catch {
      setError('Không thể tải danh sách bạn bè');
      setFriends([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const response = await friendsAPI.getPendingRequests();
      const apiRequests = response.data.requests;
      
      const formattedRequests: FriendRequest[] = apiRequests.map(r => ({
        id: r.from._id,
        name: r.from.fullName,
        avatar: r.from.avatar || '👤',
        requestId: r._id,
      }));
      
      setFriendRequests(formattedRequests);
    } catch {
      setFriendRequests([]);
    }
  }, []);

  const fetchSentRequests = useCallback(async () => {
    try {
      const response = await friendsAPI.getSentRequests();
      const sentRequests = response.data.sent.map(r => r.to);
      setPendingRequests(sentRequests);
    } catch {
      setPendingRequests([]);
    }
  }, []);

  const sendFriendRequest = useCallback(async (userId: string) => {
    try {
      await friendsAPI.sendRequest(userId);
      setPendingRequests(prev => [...prev, userId]);
      return true;
    } catch {
      setError('Không thể gửi lời mời kết bạn');
      return false;
    }
  }, []);

  const acceptFriendRequest = useCallback(async (requestId: string) => {
    try {
      await friendsAPI.acceptRequest(requestId);
      await fetchPendingRequests();
      await fetchFriends();
      return true;
    } catch {
      setError('Không thể chấp nhận lời mời');
      return false;
    }
  }, [fetchPendingRequests, fetchFriends]);

  const rejectFriendRequest = useCallback(async (requestId: string) => {
    try {
      await friendsAPI.rejectRequest(requestId);
      await fetchPendingRequests();
      return true;
    } catch {
      setError('Không thể từ chối lời mời');
      return false;
    }
  }, [fetchPendingRequests]);

  const updateFriendOnlineStatus = useCallback((userId: string, isOnline: boolean, lastSeen?: string) => {
    setFriends(prev => prev.map(f => 
      f.id === userId 
        ? { ...f, isOnline, lastSeen } 
        : f
    ));
  }, []);

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
    fetchSentRequests();
  }, [fetchFriends, fetchPendingRequests, fetchSentRequests]);

  return {
    friends,
    friendRequests,
    pendingRequests,
    isLoading,
    error,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    updateFriendOnlineStatus,
    refetch: fetchFriends,
  };
}; 