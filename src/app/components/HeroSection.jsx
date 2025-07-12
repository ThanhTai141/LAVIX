import React from 'react';
import { Play, ChevronRight } from 'lucide-react';
import StatCard from './StatCard';

const HeroSection = ({ isVisible }) => {
  const stats = [
    { value: '5k+', label: 'Học Sinh' },
    { value: '10+', label: 'Quốc Gia' },
    { value: '97%', label: 'Đánh Giá Tích Cực' },
    { value: '2+', label: 'Giải Thưởng' },
  ];

  return (
    <section className="relative pt-32 pb-24 px-6">
      <div className={`max-w-7xl mx-auto relative z-10 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Học Tập Đa Môn - Game Hóa & Công Nghệ VR/AI
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Khám phá kiến thức lịch sử, toán học, khoa học và nhiều môn học khác qua trải nghiệm game 3D sống động cùng trợ lý AI và thực tế ảo VR.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                Bắt đầu học ngay
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300 font-semibold px-8 py-4 rounded-full flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Xem trailer
              </button>
            </div>
          </div>
          <div className="md:w-1/2 rounded-xl shadow-2xl shadow-blue-100">
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-12 px-8 rounded-xl">
              <div className="relative flex flex-col items-center text-white">
                <div className="w-24 h-24 mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                  <span className="text-4xl">VR</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Chế độ VR đang hoạt động</h3>
                <div className="w-full bg-white/20 backdrop-blur rounded-lg p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Bài học: Lịch Sử Việt Nam</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full">
                  {['Thư viện', 'Trợ giúp', 'Cài đặt'].map((item, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur rounded-lg p-3 text-center hover:bg-white/20 cursor-pointer">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;