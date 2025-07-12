// src/components/AuthModal.tsx
import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, Zap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; 

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setUser } = useAuth(); 
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user); 
      setSuccess('Đăng nhập thành công!');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
  
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;
  
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      setIsLoading(false);
      return;
    }
  
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Email không hợp lệ');
      setIsLoading(false);
      return;
    }
  
    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      setIsLoading(false);
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setIsLoading(false);
      return;
    }
  
    try {
      console.log('Sending register request with data:', { fullName, email, password });
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        { fullName, email, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Register response:', response.data);
      setUser(response.data.user);
      setSuccess('Đăng ký thành công!');
      onClose();
    } catch (err: any) {
      console.error('Register error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      if (err.response?.status === 409) {
        setError('Email đã được sử dụng');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 500) {
        setError('Lỗi server, vui lòng thử lại sau');
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleForgotPassword = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const email = prompt('Nhập email của bạn:');
    if (!email) {
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );
      setSuccess('Email đặt lại mật khẩu đã được gửi!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi gửi email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div
        className="relative bg-black/20 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-sm border border-white/10 transform transition-all duration-300 shadow-2xl"
        style={{
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%),
            linear-gradient(45deg, rgba(0,191,255,0.1) 0%, rgba(255,20,147,0.1) 100%)
          `,
          boxShadow: `
            0 10px 20px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-md group"
        >
          <X className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>

        <div className="text-center mb-4">
          <div className="relative inline-flex p-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 mb-6 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-20 blur-md transition-all duration-500" />
            <Sparkles className="w-8 h-8 text-cyan-400 animate-spin group-hover:text-purple-400 transition-colors duration-500" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          </div>

          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            MindX
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-500/20 text-red-300 rounded-xl text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-2 bg-green-500/20 text-green-300 rounded-xl text-sm text-center">
            {success}
          </div>
        )}

        <div className="relative mb-4">
          <div className="flex bg-black/30 rounded-2xl p-1 backdrop-blur-sm border border-white/10 relative overflow-hidden">
            <div
              className={`absolute top-1 bottom-1 w-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl transition-all duration-500 shadow-lg ${
                activeTab === 'login' ? 'left-1' : 'left-1/2'
              }`}
              style={{ boxShadow: '0 0 20px rgba(0, 191, 255, 0.5)' }}
            />
            <button
              className={`relative flex-1 py-4 text-center font-semibold text-sm rounded-xl transition-all duration-500 z-10 ${
                activeTab === 'login' ? 'text-white' : 'text-white/60 hover:text-white/80'
              }`}
              onClick={() => setActiveTab('login')}
            >
              🔐 Đăng nhập
            </button>
            <button
              className={`relative flex-1 py-4 text-center font-semibold text-sm rounded-xl transition-all duration-500 z-10 ${
                activeTab === 'register' ? 'text-white' : 'text-white/60 hover:text-white/80'
              }`}
              onClick={() => setActiveTab('register')}
            >
              ⭐ Đăng ký
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      className="w-full pl-12 pr-4 py-4 bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all duration-300 hover:bg-black/30 hover:border-cyan-400/30"
                      placeholder="Email của bạn"
                      required
                    />
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="w-full pl-12 pr-12 py-4 bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all duration-300 hover:bg-black/30 hover:border-purple-400/30"
                      placeholder="Mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-purple-400 transition-all duration-300 hover:scale-110"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                <span className="relative flex items-center justify-center text-lg">
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Đăng nhập
                    </>
                  )}
                </span>
              </button>
              <div className="text-center">
                <a
                  href="#"
                  onClick={handleForgotPassword}
                  className="text-white/70 hover:text-cyan-400 text-sm hover:underline transition-all duration-300 hover:scale-105 inline-block"
                >
                  Quên mật khẩu?
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      className="w-full pl-12 pr-4 py-4 bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none transition-all duration-300 hover:bg-black/30 hover:border-yellow-400/30"
                      placeholder="Họ và tên"
                      required
                    />
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      className="w-full pl-12 pr-4 py-4 bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all duration-300 hover:bg-black/30 hover:border-cyan-400/30"
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="w-full pl-12 pr-12 py-4 bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all duration-300 hover:bg-black/30 hover:border-purple-400/30"
                      placeholder="Mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-purple-400 transition-all duration-300 hover:scale-110"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-pink-400 group-hover:text-pink-300 transition-colors duration-300" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm-password"
                      className="w-full pl-12 pr-12 py-4 bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 outline-none transition-all duration-300 hover:bg-black/30 hover:border-pink-400/30"
                      placeholder="Xác nhận mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-pink-400 transition-all duration-300 hover:scale-110"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                <span className="relative flex items-center justify-center text-lg">
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Đang đăng ký...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-3 mr-2" />
                      Đăng ký
                    </>
                  )}
                </span>
              </button>
            </form>
          )}
        </div>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          <span className="px-4 text-white/70 text-sm">hoặc đăng nhập với</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            className="relative flex items-center justify-center py-3 px-4 bg-black/20 hover:bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl text-white/80 hover:text-white transition-all duration-300 hover:scale-105 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg className="w-5 h-5 mr-2 relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="relative z-10">Google</span>
          </button>
          <button
            className="relative flex items-center justify-center py-3 px-4 bg-black/20 hover:bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl text-white/80 hover:text-white transition-all duration-300 hover:scale-105 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg className="w-5 h-5 mr-2 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="relative z-10">Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;