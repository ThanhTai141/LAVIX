"use client";
import React, { useState } from 'react';
import { Download, Calendar, Filter } from 'lucide-react';
import Button from '../../components/Button';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');

  const reports = [
    {
      id: 'overview',
      title: 'Tổng quan',
      description: 'Thống kê tổng quan về hoạt động học tập',
      metrics: [
        { label: 'Tổng số học sinh', value: '1,234' },
        { label: 'Tổng số bài học', value: '45' },
        { label: 'Tỷ lệ hoàn thành', value: '78%' },
        { label: 'Điểm trung bình', value: '8.5' }
      ]
    },
    {
      id: 'students',
      title: 'Báo cáo học sinh',
      description: 'Chi tiết về tiến độ học tập của từng học sinh',
      metrics: [
        { label: 'Học sinh tích cực', value: '850' },
        { label: 'Học sinh cần hỗ trợ', value: '45' },
        { label: 'Tỷ lệ tham gia', value: '92%' },
        { label: 'Thời gian học trung bình', value: '2.5h/ngày' }
      ]
    },
    {
      id: 'lessons',
      title: 'Báo cáo bài học',
      description: 'Phân tích hiệu quả của các bài học',
      metrics: [
        { label: 'Bài học phổ biến', value: 'Trận Bạch Đằng' },
        { label: 'Tỷ lệ hoàn thành', value: '85%' },
        { label: 'Đánh giá trung bình', value: '4.8/5' },
        { label: 'Thời gian học trung bình', value: '45 phút' }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Báo cáo & Thống kê</h1>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
            Chọn khoảng thời gian
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
            Lọc
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Tải xuống
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold text-gray-800 mb-4">Loại báo cáo</h2>
            <div className="space-y-2">
              {reports.map((report) => (
                <button
                  key={report.id}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedReport === report.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <h3 className="font-medium">{report.title}</h3>
                  <p className="text-sm text-gray-500">{report.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {reports.find(r => r.id === selectedReport)?.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reports
                .find(r => r.id === selectedReport)
                ?.metrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                  </div>
                ))}
            </div>

            <div className="mt-8">
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Biểu đồ sẽ được hiển thị ở đây</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 