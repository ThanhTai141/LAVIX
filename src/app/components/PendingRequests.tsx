import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FriendButton from './FriendButton';

interface User {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  avatar?: string;
}

interface FriendRequest {
  id: string;
  from: User;
  to: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface PendingRequestsProps {
  onFriendChange?: () => void;
}

const PendingRequests: React.FC<PendingRequestsProps> = ({ onFriendChange }) => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/friends/pending`,
        { withCredentials: true }
      );
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setError('Không thể tải danh sách lời mời kết bạn. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button
          onClick={fetchPendingRequests}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        <p>Không có lời mời kết bạn nào đang chờ.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request, idx) => (
        <div
          key={request.id || idx}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              {request.from?.avatar ? (
                <img
                  src={request.from.avatar}
                  alt={request.from.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-gray-500">
                  {request.from?.fullName ? request.from.fullName.charAt(0).toUpperCase() : '?'}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{request.from?.fullName || 'Không rõ tên'}</h3>
              <p className="text-sm text-gray-500">{request.from?.email || 'Không rõ email'}</p>
              <p className="text-xs text-gray-400">
                {request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : ''}
              </p>
            </div>
          </div>
          <FriendButton userId={request.from?._id || request.from?.id || ''} isIncomingRequest onActionDone={fetchPendingRequests} onFriendChange={onFriendChange} />
        </div>
      ))}
    </div>
  );
};

export default PendingRequests; 