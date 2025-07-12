"use client";

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFriends } from './hooks/useFriends';
import { useChat } from './hooks/useChat';
import { useSearch } from './hooks/useSearch';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { ErrorMessage } from './components/ErrorMessage';
// import { DebugInfo } from './components/DebugInfo';
import type { TabType, User } from '../../shared/types/chat';

const FriendsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;
  
  // State management
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  // const [showDebug, setShowDebug] = useState(false);

  // Custom hooks
  const {
    friends,
    friendRequests,
    pendingRequests,
    error: friendsError,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useFriends();

  const {
    isLoading: chatLoading,
    error: chatError,
    sendMessage,
    selectFriend,
    getCurrentChat,
    isFriendTyping,
    sendTypingStart,
    sendTypingStop,
  } = useChat(userId);

  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    error: searchError,
    searchUsers,
    clearSearch,
  } = useSearch();

  // Handle friend selection
  const handleSelectFriend = (friend: User) => {
    setSelectedFriend(friend);
    selectFriend(friend.id);
  };

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'search') {
      clearSearch();
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    await searchUsers(query);
  };

  // Get current chat messages
  const currentMessages = getCurrentChat();

  // Get the first error to display
  const errorMessage = friendsError || chatError || searchError;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        friends={friends}
        friendRequests={friendRequests}
        searchResults={searchResults}
        selectedFriend={selectedFriend}
        onSelectFriend={handleSelectFriend}
        onSendFriendRequest={sendFriendRequest}
        onAcceptRequest={acceptFriendRequest}
        onRejectRequest={rejectFriendRequest}
        pendingRequests={pendingRequests}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
        isLoading={isSearching}
      />

      {/* Chat Window */}
      <ChatWindow
        selectedFriend={selectedFriend}
        messages={currentMessages}
        onSendMessage={sendMessage}
        isLoading={chatLoading}
        isFriendTyping={isFriendTyping}
        sendTypingStart={sendTypingStart}
        sendTypingStop={sendTypingStop}
      />

      {/* Error Display */}
      {errorMessage && (
        <ErrorMessage message={errorMessage} variant="toast" />
      )}

      {/* Debug Info */}
      {/* <DebugInfo
        selectedFriend={selectedFriend?.id || null}
        messages={currentMessages}
        isVisible={showDebug}
      /> */}

      {/* Debug Toggle Button */}
      {/* <button
        onClick={() => setShowDebug(!showDebug)}
        className="fixed top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded text-xs z-50"
      >
        {showDebug ? 'Hide Debug' : 'Show Debug'}
      </button> */}
    </div>
  );
};

export default FriendsPage;