// src/components/Navbar.tsx
import React from 'react';
import { Sparkles, ChevronRight, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  openAuthModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ openAuthModal }) => {
  const { isAuthenticated } = useAuth(); 
  const router = useRouter();

  const handleUserClick = () => {
    router.push('/profile'); 
  };
  const handleLogoClick = () => {
    router.push('/'); 
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <Sparkles className="w-8 h-8" />
          <span onClick={handleLogoClick} className="cursor-pointer" >MindX</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-600">
          <a href="#features" className="hover:text-blue-600">
            Tính năng
          </a>
          <a href="#subjects" className="hover:text-blue-600">
            Môn học
          </a>
          <a href="#testimonials" className="hover:text-blue-600">
            Đánh giá
          </a>
          <a href="#pricing" className="hover:text-blue-600">
            Gói dịch vụ
          </a>
        </div>
        {isAuthenticated ? (
          <button
            onClick={handleUserClick}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full flex items-center justify-center shadow-lg shadow-blue-200"
            title="Xem hồ sơ"
          >
            <User className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={openAuthModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            Đăng ký miễn phí
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;