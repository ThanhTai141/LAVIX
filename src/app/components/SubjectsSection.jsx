import React from 'react';
import { Book, Beaker, Brain, Globe, Calculator, Zap } from 'lucide-react';
import SubjectCard from './SubjectCard';
import SubjectPreview from './SubjectPreview';

const SubjectsSection = ({ activeSubject, setActiveSubject }) => {
  const subjects = [
    {
      icon: <Book className="w-12 h-12 text-yellow-500" />,
      title: '📜 Lịch Sử',
      desc: 'Hành trình qua các triều đại, chiến công và nhân vật lịch sử vĩ đại.',
      color: 'from-yellow-400 to-amber-300',
      textColor: 'text-yellow-900',
    },
    {
      icon: <Beaker className="w-12 h-12 text-blue-500" />,
      title: '🔬 Hóa Học',
      desc: 'Thí nghiệm ảo, phản ứng sinh động, kiến thức hóa học hấp dẫn.',
      color: 'from-blue-400 to-cyan-300',
      textColor: 'text-blue-900',
    },
    {
      icon: <Brain className="w-12 h-12 text-green-500" />,
      title: '🧬 Sinh Học',
      desc: 'Mô hình 3D tế bào, hệ tuần hoàn và giải phẫu cơ thể chi tiết.',
      color: 'from-green-400 to-emerald-300',
      textColor: 'text-green-900',
    },
    {
      icon: <Globe className="w-12 h-12 text-indigo-500" />,
      title: '🌍 Địa Lý',
      desc: 'Khám phá bản đồ tương tác và hiện tượng thiên nhiên qua trải nghiệm VR.',
      color: 'from-indigo-400 to-purple-300',
      textColor: 'text-indigo-900',
    },
    {
      icon: <Calculator className="w-12 h-12 text-red-500" />,
      title: '📐 Toán Học',
      desc: 'Giải bài tập tương tác, thử thách logic và mô phỏng hình học 3D.',
      color: 'from-red-400 to-pink-300',
      textColor: 'text-red-900',
    },
    {
      icon: <Zap className="w-12 h-12 text-orange-500" />,
      title: '⚡ Vật Lý',
      desc: 'Mô phỏng cơ học, điện, quang học bằng công nghệ thực tế ảo tiên tiến.',
      color: 'from-orange-400 to-amber-300',
      textColor: 'text-orange-900',
    },
  ];

  return (
    <section id="subjects" className="py-24 px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block mx-2">📚</span>
            Khám Phá Các Môn Học
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hơn 50 khóa học với nội dung tương tác, video 3D và bài kiểm tra được thiết kế riêng
          </p>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 mb-8 snap-x scrollbar-hide">
          {subjects.map((subject, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSubject(idx)}
              className={`snap-start flex-shrink-0 rounded-full px-6 py-3 font-medium ${
                activeSubject === idx
                  ? `bg-gradient-to-r ${subject.color} ${subject.textColor}`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {subject.title}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <SubjectCard subject={subjects[activeSubject]} isActive={true} onClick={() => {}} />
          <SubjectPreview subject={subjects[activeSubject]} />
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;