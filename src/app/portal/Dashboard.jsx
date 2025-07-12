import React from 'react';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Tổng số học sinh',
      value: '1,234',
      icon: <Users className="w-6 h-6" />,
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Bài học đã tạo',
      value: '45',
      icon: <BookOpen className="w-6 h-6" />,
      change: '+5',
      changeType: 'increase'
    },
    {
      title: 'Điểm trung bình',
      value: '8.5',
      icon: <Award className="w-6 h-6" />,
      change: '+0.3',
      changeType: 'increase'
    },
    {
      title: 'Tỷ lệ hoàn thành',
      value: '78%',
      icon: <TrendingUp className="w-6 h-6" />,
      change: '+5%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h2>
          <div className="space-y-4">
            {/* Activity items will go here */}
            <p className="text-gray-500 text-center py-4">Chưa có hoạt động nào</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Học sinh cần hỗ trợ</h2>
          <div className="space-y-4">
            {/* Student support items will go here */}
            <p className="text-gray-500 text-center py-4">Không có học sinh nào cần hỗ trợ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 