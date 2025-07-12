export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'friend';
  timestamp: string;
}

export interface Chat {
  friendId: string;
  messages: Message[];
}

export interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
  requestId: string;
}

export type TabType = 'friends' | 'requests' | 'search' | 'chats';

// API Response types
export interface ApiUser {
  _id?: string;
  id?: string;
  fullName: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface ApiMessage {
  _id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
}

export interface ApiFriendRequest {
  _id: string;
  from: { _id: string; fullName: string; avatar?: string };
  to: string;
  status: string;
}

export interface SendMessageData {
  from: string;
  to: string;
  content: string;
  clientMessageId?: string;
} 