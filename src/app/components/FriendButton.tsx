import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface FriendButtonProps {
  userId: string;
  className?: string;
  isIncomingRequest?: boolean;
  onActionDone?: () => void;
  onFriendChange?: () => void;
  disabled?: boolean;
}

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface FriendRequest {
  id: string;
  sender: User;
  receiver: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface PendingFriendRequest {
  _id: string;
  from: { _id?: string; id?: string };
}

type FriendStatus = 'none' | 'pending' | 'accepted' | 'loading';

const FriendButton: React.FC<FriendButtonProps> = ({ userId, className = '', isIncomingRequest = false, onActionDone, onFriendChange, disabled = false }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<FriendStatus>('loading');
  const [isLoading, setIsLoading] = useState(false);

  const checkFriendStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/friends`,
        { withCredentials: true }
      );
      const friends = response.data.friends as User[];
      const isFriend = friends.some((friend) => friend.id === userId);
      if (isFriend) {
        setStatus('accepted');
      } else {
        // Kiểm tra lời mời đang chờ
        const pendingResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/friends/pending`,
          { withCredentials: true }
        );
        const pendingRequests = pendingResponse.data.requests as PendingFriendRequest[];
        const hasPendingRequest = pendingRequests.some(
          (request) => request.from.id === userId
        );
        setStatus(hasPendingRequest ? 'pending' : 'none');
      }
    } catch (error) {
      console.error('Error checking friend status:', error);
      setStatus('none');
    }
  };

  useEffect(() => {
    if (!userId) return;
    checkFriendStatus();
  }, [userId]);

  if (!userId) return null;

  const handleSendRequest = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/friends/request`,
        { to: userId },
        { withCredentials: true }
      );
      setStatus('pending');
    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const pendingResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/friends/pending`,
        { withCredentials: true }
      );
      const pendingRequests = pendingResponse.data.requests as PendingFriendRequest[];
      const request = pendingRequests.find(
        (request) => (request.from._id || request.from.id) === userId
      );
      if (request) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/friends/accept`,
          { requestId: request._id },
          { withCredentials: true }
        );
        setStatus('accepted');
        if (onActionDone) onActionDone();
        if (onFriendChange) onFriendChange();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const pendingResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/friends/pending`,
        { withCredentials: true }
      );
      const pendingRequests = pendingResponse.data.requests as PendingFriendRequest[];
      const request = pendingRequests.find(
        (request) => (request.from._id || request.from.id) === userId
      );
      if (request) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/friends/reject/${request._id}`,
          {},
          { withCredentials: true }
        );
        setStatus('none');
        if (onActionDone) onActionDone();
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/friends/${userId}`,
        { withCredentials: true }
      );
      setStatus('none');
    } catch (error) {
      console.error('Error unfriending:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <button
        disabled
        className={`px-4 py-2 rounded-lg bg-gray-200 text-gray-500 ${className}`}
      >
        Đang tải...
      </button>
    );
  }

  if (userId === user?.id) {
    return null;
  }

  if (isIncomingRequest) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleAcceptRequest}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors ${className}`}
        >
          {isLoading ? 'Đang xử lý...' : 'Đồng ý'}
        </button>
        <button
          onClick={handleRejectRequest}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors ${className}`}
        >
          {isLoading ? 'Đang xử lý...' : 'Từ chối'}
        </button>
      </div>
    );
  }

  switch (status) {
    case 'none':
      return (
        <button
          onClick={handleSendRequest}
          disabled={isLoading || disabled}
          className={`px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors ${className}`}
        >
          {isLoading ? 'Đang gửi...' : 'Kết bạn'}
        </button>
      );
    case 'pending':
      return (
        <div className="flex gap-2">
          <button
            onClick={handleAcceptRequest}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors ${className}`}
          >
            {isLoading ? 'Đang xử lý...' : 'Đồng ý'}
          </button>
          <button
            onClick={handleRejectRequest}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors ${className}`}
          >
            {isLoading ? 'Đang xử lý...' : 'Từ chối'}
          </button>
        </div>
      );
    case 'accepted':
      return (
        <button
          onClick={handleUnfriend}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors ${className}`}
        >
          {isLoading ? 'Đang xử lý...' : 'Hủy kết bạn'}
        </button>
      );
    default:
      return null;
  }
};

export default FriendButton; 