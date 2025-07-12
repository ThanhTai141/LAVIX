import React from 'react';
import { ChevronRight } from 'lucide-react';

const SubjectCard = ({ subject, isActive, onClick }) => {
  
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        {subject.icon}
        <h3 className="text-2xl font-bold">{subject.title.replace('📜 ', '').replace('🔬 ', '').replace('🧬 ', '').replace('🌍 ', '').replace('📐 ', '').replace('⚡ ', '')}</h3>
      </div>
      <p className="text-gray-600 mb-6">{subject.desc}</p>
      <div className="space-y-4 mb-8">
        {['Bài học tương tác', 'Quiz đánh giá', 'Dự án thực hành', 'Tài liệu bổ sung'].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${subject.color} flex items-center justify-center`}>
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <button className={`bg-gradient-to-r ${subject.color} ${subject.textColor} px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg`} onClick={onClick}>
        Khám phá khóa học
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SubjectCard;