import axios from 'axios';
import type { ApiUser, ApiMessage, ApiFriendRequest, SendMessageData } from '../types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Axios instance với default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Friends API
export const friendsAPI = {
  getFriends: () => 
    apiClient.get<{ friends: ApiUser[] }>('/api/friends'),
  
  getPendingRequests: () => 
    apiClient.get<{ requests: ApiFriendRequest[] }>('/api/friends/pending'),
  
  getSentRequests: () => 
    apiClient.get<{ sent: { to: string }[] }>('/api/friends/sent'),
  
  sendRequest: (to: string) => 
    apiClient.post('/api/friends/request', { to }),
  
  acceptRequest: (requestId: string) => 
    apiClient.post('/api/friends/accept', { requestId }),
  
  rejectRequest: (requestId: string) => 
    apiClient.post('/api/friends/reject', { requestId }),
};

// Messages API
export const messagesAPI = {
  getMessages: (friendId: string) => 
    apiClient.get<{ messages: ApiMessage[] }>(`/api/messages/${friendId}`),
  
  sendMessage: (data: SendMessageData) => 
    apiClient.post('/api/messages', data),
};

// Search API
export const searchAPI = {
  searchUsers: (query: string) => 
    apiClient.get<{ users: ApiUser[] }>(`/api/users/search?q=${encodeURIComponent(query)}`),
}; 