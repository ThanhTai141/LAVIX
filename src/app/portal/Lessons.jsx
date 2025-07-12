import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import Button from '../../components/common/Button';

const Lessons = () => {
  const [lessons] = useState([
    {
      id: 1,
      title: 'Trận Bạch Đằng',
      subject: 'Lịch sử',
      type: 'VR',
      duration: '45 phút',
      students: 120,
      status: 'active'
    },
    {
      id: 2,
      title: 'Cấu trúc tế bào',
      subject: 'Sinh học',
      type: 'AR',
      duration: '30 phút',
      students: 85,
      status: 'draft'
    },
    {
      id: 3,
      title: 'Phương trình bậc 2',
      subject: 'Toán học',
      type: 'Game',
      duration: '60 phút',
      students: 150,
      status: 'active'
    }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý bài học</h1>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Tạo bài học mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{lesson.title}</h3>
                  <p className="text-sm text-gray-500">{lesson.subject}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  lesson.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {lesson.status === 'active' ? 'Đang hoạt động' : 'Bản nháp'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Loại bài học</p>
                  <p className="font-medium">{lesson.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Thời lượng</p>
                  <p className="font-medium">{lesson.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Học sinh</p>
                  <p className="font-medium">{lesson.students}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" leftIcon={<Eye className="w-4 h-4" />}>
                  Xem
                </Button>
                <Button variant="outline" size="sm" className="flex-1" leftIcon={<Edit2 className="w-4 h-4" />}>
                  Sửa
                </Button>
                <Button variant="outline" size="sm" className="flex-1" leftIcon={<Trash2 className="w-4 h-4" />}>
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons; 