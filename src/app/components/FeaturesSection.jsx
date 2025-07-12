import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: '🎮',
      title: 'Game Hóa Kiến Thức',
      desc: 'Trải nghiệm học qua các trận chiến lịch sử, thí nghiệm khoa học và mô phỏng toán học 3D chân thực.',
    },
    {
      icon: '🤖',
      title: 'Trợ Lý AI Thông Minh',
      desc: 'Hỗ trợ giải đáp, ôn tập và đưa ra hướng dẫn cá nhân hóa theo từng môn học.',
    },
    {
      icon: '🕶️',
      title: 'Công Nghệ VR/AR',
      desc: 'Đắm mình trong bối cảnh lịch sử, phòng thí nghiệm và mô hình sinh học bằng thực tế ảo.',
    },
    {
      icon: '📈',
      title: 'Theo Dõi Tiến Trình',
      desc: 'Ghi nhận thành tích học tập, bảng xếp hạng và huy hiệu khen thưởng nâng cao động lực.',
    },
  ];
  const router = useRouter();
  const inputRef = useRef();

  return (
    <section id="features" className="py-20 px-6 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block mx-2">🚀</span>
            Tính Năng Nổi Bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá cách chúng tôi kết hợp công nghệ tiên tiến để tạo ra trải nghiệm học tập hoàn toàn mới
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} icon={feature.icon} title={feature.title} desc={feature.desc} />
          ))}
        </div>
        <div className="mt-24 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-3/5">
              <h3 className="text-3xl font-bold mb-4">Trải Nghiệm AI Tutor Cá Nhân Hóa</h3>
              <p className="text-blue-100 mb-6">
                Trợ lý AI thông minh của chúng tôi sẽ theo dõi quá trình học tập của bạn, điều chỉnh nội dung học để phù hợp với điểm mạnh và điểm yếu của bạn, đồng thời cung cấp hỗ trợ 24/7 cho mọi câu hỏi.
              </p>
              <ul className="space-y-3 mb-8">
                {['Học theo tốc độ riêng của bạn', 'Hỗ trợ đa ngôn ngữ', 'Phân tích điểm yếu và gợi ý cải thiện'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-400/30 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                Tìm hiểu thêm
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="md:w-2/5">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
                    🤖
                  </div>
                  <div>
                    <h4 className="font-bold">AI Tutor</h4>
                    <p className="text-blue-200">Đang hoạt động</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-sm">Bạn có thể giải thích nguyên lý của phản ứng oxi hóa khử?</p>
                  </div>
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <p className="text-sm">Tôi sẽ giải thích nguyên lý phản ứng oxi hóa khử với các ví dụ trực quan...</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-sm">Có thể cho tôi xem mô phỏng 3D của phản ứng không?</p>
                  </div>
                </div>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="bg-white/5 rounded-full flex px-4 py-2 items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Nhập câu hỏi của bạn..."
                      className="bg-transparent border-none outline-none flex-1 text-white placeholder-blue-200"
                    />
                    <button
                      className="ml-2 text-blue-200 hover:text-white"
                      onClick={() => {
                        const question = inputRef.current.value;
                        if (question.trim()) {
                          router.push(`/AIChatbox?message=${encodeURIComponent(question)}`);
                        }
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;