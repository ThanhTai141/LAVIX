// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Calling /me with URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        console.log('Response from /me:', response.data);
        // Ánh xạ _id thành id
        const userData: User = {
          id: response.data.user._id,
          email: response.data.user.email,
          fullName: response.data.user.fullName,
          role: response.data.user.role,
        };
        setUser(userData);
        setIsAuthenticated(true);
        console.log('Updated user:', userData, 'isAuthenticated:', true);
      } catch (error: any) {
        console.error('Check auth error:', error.response?.data || error.message);
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
      console.log('Logged out, isAuthenticated:', false);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng trong AuthProvider');
  }
  return context;
};