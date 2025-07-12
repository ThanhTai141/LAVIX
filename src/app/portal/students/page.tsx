"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical } from 'lucide-react';
import Button from '../../components/Button';

// Định nghĩa interface cho Student
interface Student {
  id: number;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
}

// Sử dụng React.FC để định nghĩa component
const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // TODO: Fetch students from API
    const mockStudents: Student[] = [
      { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', progress: 85, lastActive: '2024-03-15' },
      { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', progress: 92, lastActive: '2024-03-14' },
      { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', progress: 78, lastActive: '2024-03-13' },
    ];
    setStudents(mockStudents);
    setLoading(false);
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hiển thị trạng thái tải
  if (loading) {
    return <div className="p-6 text-gray-600">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý học sinh</h1>
        <Button variant="primary" size="sm">
          Thêm học sinh
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm học sinh..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
            Lọc
          </Button>
        </div>

        <div className="overflow-x-auto">
          {filteredStudents.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              Không tìm thấy học sinh nào.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 font-semibold text-gray-600">Tên học sinh</th>
                  <th className="pb-3 font-semibold text-gray-600">Email</th>
                  <th className="pb-3 font-semibold text-gray-600">Tiến độ</th>
                  <th className="pb-3 font-semibold text-gray-600">Hoạt động gần nhất</th>
                  <th className="pb-3 font-semibold text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">{student.email}</td>
                    <td className="py-4">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 mt-1">{student.progress}%</span>
                    </td>
                    <td className="py-4 text-gray-600">{student.lastActive}</td>
                    <td className="py-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;