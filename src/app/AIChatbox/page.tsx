'use client';

import React, { useState, useContext, useCallback, useMemo, useRef } from 'react';
import { PaperClipIcon, CheckCircleIcon, SwatchIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useSearchParams } from 'next/navigation';

interface RecentItem {
  id: string;
  type: 'text' | 'image' | 'code';
  title: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
}

interface ChatBotProps {
  onSendMessage?: (message: string) => void;
  onRecentItemClick?: (item: RecentItem) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onSendMessage, onRecentItemClick }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; timestamp: Date }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false);
  const [fileError, setFileError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auth = useContext(AuthContext);
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message');

  React.useEffect(() => {
    if (initialMessage && auth?.isAuthenticated && !isLoading && messages.length === 0) {
      setInputValue(initialMessage);
      // Gửi tự động
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
    // eslint-disable-next-line
  }, [initialMessage, auth]);

  // Load chat history when component mounts
  React.useEffect(() => {
    const loadChatHistory = async () => {
      if (auth?.isAuthenticated && messages.length === 0) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/gemini/history`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.data && response.data.history) {
            const historyMessages = response.data.history.map((msg: { role: string; content: string; timestamp: string }) => ({
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(historyMessages);
          }
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      }
    };

    loadChatHistory();
  }, [auth?.isAuthenticated]);

  // Generate recent items from actual chat history
  const recentItems: RecentItem[] = useMemo(() => {
    const items: RecentItem[] = [];
    
    // Get last 4 user messages from history
    const userMessages = messages.filter(msg => msg.role === 'user').slice(-4);
    
    userMessages.forEach((msg, index) => {
      items.push({
        id: `history-${index}`,
        type: 'text',
        title: msg.content.length > 50 ? `${msg.content.substring(0, 50)}...` : msg.content,
        description: `Câu hỏi từ lịch sử chat`,
        icon: <CheckCircleIcon className="w-6 h-6" />,
        color: 'bg-green-100 text-green-600',
      });
    });

    // Fill remaining slots with default items
    while (items.length < 4) {
      const defaultIndex = items.length;
      items.push({
        id: `default-${defaultIndex}`,
        type: 'text',
        title: 'Bắt đầu cuộc trò chuyện mới...',
        description: 'Hỏi tôi bất kỳ điều gì về học tập!',
        icon: <CheckCircleIcon className="w-6 h-6" />,
        color: 'bg-blue-100 text-blue-600',
      });
    }

    return items;
  }, [messages]);

  // Validate file upload
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = ['.pdf', '.txt', '.jpg', '.png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    // Kiểm tra định dạng
    if (!allowedTypes.includes(fileExtension)) {
      return {
        isValid: false,
        error: `Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`
      };
    }
    
    // Kiểm tra kích thước
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File quá lớn. Kích thước tối đa: 5MB`
      };
    }
    
    return { isValid: true };
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      setFileError(validation.error || 'File không hợp lệ');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setFileError('');
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (!auth?.isAuthenticated) {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: 'Vui lòng đăng nhập để sử dụng tính năng này!',
        timestamp: new Date()
      }]);
      return;
    }

    const newMessage = { role: 'user' as const, content: inputValue, timestamp: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let response;
      
      if (selectedFile) {
        // Gửi message với file
        const formData = new FormData();
        formData.append('message', inputValue);
        formData.append('file', selectedFile);
        
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/gemini/chat-with-file`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Xóa file sau khi gửi
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        // Gửi message thường
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/gemini/chat`, {
        message: inputValue
      }, {
        withCredentials: true
      });
      }

      if (response.data && response.data.response) {
        const assistantMessage = { role: 'assistant' as const, content: response.data.response, timestamp: new Date() };
        setMessages((prev) => [...prev, assistantMessage]);
        onSendMessage?.(inputValue);
      } else {
        throw new Error('Không nhận được phản hồi hợp lệ từ server');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      let errorMessage = 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau!';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
        } else if (error.request) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!';
        }
      }
      
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMessage, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, auth?.isAuthenticated, onSendMessage, selectedFile]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  }, [handleSubmit]);

  const handleRecentItemClick = useCallback((item: RecentItem) => {
    onRecentItemClick?.(item);
  }, [onRecentItemClick]);

  const handleNewChat = async () => {
    if (!auth?.isAuthenticated) return;
    
    try {
      setIsCreatingNewChat(true);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/gemini/new-chat`, {}, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status === 200) {
        // Clear messages
        setMessages([]);
        setInputValue('');
        setSelectedFile(null);
        
        // Show success message
        setMessages([{
          role: 'assistant',
          content: 'Chào bạn! Tôi là trợ lý AI của MindX. Bạn có thể hỏi tôi bất kỳ câu hỏi nào về học tập nhé!',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      setMessages([{
        role: 'assistant',
        content: 'Có lỗi xảy ra khi tạo chat mới. Vui lòng thử lại.',
        timestamp: new Date()
      }]);
    } finally {
      setIsCreatingNewChat(false);
    }
  };

  // const handleVoiceInput = () => {
  //   const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  //   recognition.lang = 'vi-VN';
  //   recognition.onresult = (event) => {
  //     setInputValue(event.results[0][0].transcript);
  //   };
  //   recognition.start();
  // };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <SwatchIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">MindX AI Assistant</h2>
            <p className="text-sm text-gray-500">Trợ lý học tập thông minh</p>
          </div>
        </div>
        
        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          disabled={isCreatingNewChat}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingNewChat ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
          <span>{isCreatingNewChat ? 'Đang tạo...' : 'Chat mới'}</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {msg.content}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-center text-gray-500">Đang xử lý...</div>}
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-10">
        <form onSubmit={handleSubmit}>
          {/* File Preview */}
          {selectedFile && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PaperClipIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">{selectedFile.name}</span>
                  <span className="text-xs text-blue-600">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          )}

          {/* File Error */}
          {fileError && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-sm text-red-600">{fileError}</span>
            </div>
          )}

          <div className="flex items-center space-x-6">
            <input
              type="text"
              placeholder="Nhập câu hỏi của bạn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-xl text-gray-700 placeholder-gray-400 bg-gray-50 rounded-lg px-6 py-4 border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            
            {/* File Upload Button */}
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 hover:bg-gray-100 rounded-xl transition-colors"
              title="Tải lên file (PDF, TXT, JPG, PNG - tối đa 5MB)"
            >
              <PaperClipIcon className="w-7 h-7 text-gray-400" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </form>
      </div>

      {/* Recent Section */}
      <div className="mb-12">
        <h3 className="text-gray-700 text-xl font-semibold mb-8 uppercase tracking-wide">Gần đây</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {recentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleRecentItemClick(item)}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer"
            >
              {item.type === 'image' && item.id === '2' ? (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
                  <div className="h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg"></div>
                  <div className="h-32 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg"></div>
                  <div className="h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg"></div>
                </div>
              ) : (
                <div className="flex items-start space-x-5">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-2 text-xl leading-tight">{item.title}</h4>
                    {item.description && (
                      <p className="text-base text-gray-600 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;