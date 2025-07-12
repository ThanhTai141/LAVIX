import React from 'react';
import { Search, Users, UserPlus, MessageCircle } from 'lucide-react';
import type { User, FriendRequest, TabType } from '../../../shared/types/chat';
import { LoadingSpinner } from './LoadingSpinner';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  friends: User[];
  friendRequests: FriendRequest[];
  searchResults: User[];
  selectedFriend: User | null;
  onSelectFriend: (friend: User) => void;
  onSendFriendRequest: (userId: string) => Promise<boolean>;
  onAcceptRequest: (requestId: string) => Promise<boolean>;
  onRejectRequest: (requestId: string) => Promise<boolean>;
  pendingRequests: string[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: (query: string) => Promise<void>;
  isLoading?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  friends,
  friendRequests,
  searchResults,
  selectedFriend,
  onSelectFriend,
  onSendFriendRequest,
  onAcceptRequest,
  onRejectRequest,
  pendingRequests,
  searchTerm,
  onSearchChange,
  onSearch,
  isLoading = false,
}) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const renderFriendsList = () => (
    <div className="space-y-2">
      {friends.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Chưa có bạn bè nào</p>
      ) : (
        friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => onSelectFriend(friend)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
              selectedFriend?.id === friend.id ? 'bg-blue-50 border border-blue-200' : ''
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {friend.avatar}
              </div>
              {friend.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{friend.name}</h4>
              <p className="text-sm text-gray-500">
                {friend.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderRequestsList = () => (
    <div className="space-y-2">
      {friendRequests.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Không có lời mời kết bạn nào</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.requestId} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {request.avatar}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{request.name}</h4>
              <p className="text-sm text-gray-500">Muốn kết bạn với bạn</p>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => onAcceptRequest(request.requestId)}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Chấp nhận
              </button>
              <button
                onClick={() => onRejectRequest(request.requestId)}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Từ chối
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderSearchResults = () => (
    <div className="space-y-2">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" />
        </div>
      ) : searchResults.length === 0 && searchTerm ? (
        <p className="text-gray-500 text-center py-4">Không tìm thấy người dùng</p>
      ) : (
        searchResults.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.avatar}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-500">
                  {user.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                </p>
              </div>
            </div>
            {!pendingRequests.includes(user.id) && !friends.some(f => f.id === user.id) && (
              <button
                onClick={() => onSendFriendRequest(user.id)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Kết bạn
              </button>
            )}
            {pendingRequests.includes(user.id) && (
              <span className="px-3 py-1 bg-gray-300 text-gray-600 text-sm rounded">
                Đã gửi
              </span>
            )}
            {friends.some(f => f.id === user.id) && (
              <span className="px-3 py-1 bg-green-300 text-green-700 text-sm rounded">
                Bạn bè
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderChatsList = () => (
    <div className="space-y-2">
      {friends.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Chưa có cuộc trò chuyện nào</p>
      ) : (
        friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => onSelectFriend(friend)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
              selectedFriend?.id === friend.id ? 'bg-blue-50 border border-blue-200' : ''
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {friend.avatar}
              </div>
              {friend.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{friend.name}</h4>
              <p className="text-sm text-gray-500">
                {friend.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Bạn bè</h1>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </form>

        {/* Tabs */}
        <div className="flex space-x-1">
          <button
            onClick={() => onTabChange('friends')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'friends'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="inline w-4 h-4 mr-1" />
            Bạn bè
          </button>
          <button
            onClick={() => onTabChange('chats')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'chats'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="inline w-4 h-4 mr-1" />
            Đoạn chat
          </button>
          <button
            onClick={() => onTabChange('requests')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'requests'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserPlus className="inline w-4 h-4 mr-1" />
            Lời mời
          </button>
          <button
            onClick={() => onTabChange('search')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'search'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Search className="inline w-4 h-4 mr-1" />
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'friends' && renderFriendsList()}
        {activeTab === 'chats' && renderChatsList()}
        {activeTab === 'requests' && renderRequestsList()}
        {activeTab === 'search' && renderSearchResults()}
      </div>
    </div>
  );
}; 