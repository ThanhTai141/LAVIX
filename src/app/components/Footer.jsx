import React from 'react';
import { Sparkles } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const footerColumns = [
    {
      title: 'Sản phẩm',
      links: ['Tính năng', 'Gói dịch vụ', 'Dùng thử miễn phí', 'Giới thiệu bạn bè', 'Cập nhật mới'],
    },
    {
      title: 'Môn học',
      links: ['Lịch sử', 'Toán học', 'Khoa học', 'Địa lý', 'Ngôn ngữ', 'Công nghệ'],
    },
    {
      title: 'Trợ giúp',
      links: ['Trung tâm hỗ trợ', 'Hướng dẫn', 'Yêu cầu tính năng', 'Liên hệ', 'Chính sách bảo mật'],
    },
  ];
  const socialLinks = {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    youtube: "https://www.youtube.com/watch?v=SeWt7IpZ0CA&list=RDO2ZfBvJAt94&index=3"
  };
  const icons = {
    facebook: <FaFacebookF />,
    twitter: <FaTwitter />,
    instagram: <FaInstagram />,
    youtube: <FaYoutube />
  };
  
  

  return (
    <footer className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <span>MindX</span>
            </div>
            <p className="text-gray-400 mb-6">
              Thay đổi cách học tập truyền thống với công nghệ game hóa, AI và VR tiên tiến.
            </p>
            <div className="flex gap-4">
  {['facebook', 'twitter', 'instagram', 'youtube'].map((social, idx) => (
    <a 
      key={idx} 
      href={socialLinks[social]} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600"
    >
      <span className="sr-only">{social}</span>
      <div className="w-5 flex items-center justify-center h-5" >{icons[social]}</div>
    </a>
  ))}
</div>

          </div>
          {footerColumns.map((column, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-lg mb-6">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, lidx) => (
                  <li key={lidx}>
                    <a href="#" className="text-gray-400 hover:text-blue-400">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">© 2025 MindX. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white">Điều khoản</a>
            <a href="#" className="text-gray-500 hover:text-white">Bảo mật</a>
            <a href="#" className="text-gray-500 hover:text-white">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;