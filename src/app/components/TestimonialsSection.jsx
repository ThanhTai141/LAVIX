import React from 'react';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection = ({ scrollY }) => {
  const timeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    return `${diffDays} ngày trước`;
  };

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, day, month] = dateStr.split('-');
    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  };

  const testimonials = [
    {
      name: 'Ngọc Anh',
      role: 'Học sinh lớp 9',
      quote: 'Trợ lý AI giúp tôi rất nhiều khi học Toán. Nó giải thích từng bước rất rõ ràng và luôn kiên nhẫn khi tôi gặp khó khăn. Điểm số của tôi đã cải thiện rõ rệt chỉ sau 2 tháng.',
      stars: 5,
      createdAt: '2025-21-5',
    },
    {
      name: 'Thanh Hà',
      role: 'Phụ huynh',
      quote: 'Con tôi rất thích học lịch sử qua các trò chơi và mô phỏng. Thay vì chỉ đọc sách, giờ đây con có thể thực sự "tham gia" vào các sự kiện lịch sử. Đây là cách học hiệu quả nhất mà tôi từng thấy.',
      stars: 4,
      createdAt: '2025-20-5',
    },
    {
      name: 'Quốc Bảo',
      role: 'Học sinh lớp 12',
      quote: 'EduVerse đã thay đổi cách tôi học. Tôi không chỉ học thuộc lòng mà còn hiểu sâu về các môn học. Các bài kiểm tra tự động đánh giá giúp tôi biết được điểm yếu của mình để cải thiện.',
      stars: 5,
      createdAt: '2025-20-5',
    },
    {
      name: 'Thúy An',
      role: 'Phụ huynh',
      quote: 'Tôi rất hài lòng với sự tiến bộ của con gái mình. Nó đã trở nên tự tin hơn trong việc học và yêu thích việc khám phá kiến thức mới. Tôi cảm thấy yên tâm khi cho con học trên EduVerse.',
      stars: 5,
      createdAt: '2025-23-5',
    },
    {
      name: 'Đức Minh',
      role: 'Học sinh lớp 10',
      quote: 'Các bài kiểm tra trắc nghiệm rất thú vị và giúp tôi ôn tập hiệu quả. Tôi cảm thấy tự tin hơn khi bước vào kỳ thi cuối kỳ sắp tới.',
      stars: 4,
      createdAt: '2025-22-5',
    },
    {
      name: 'Kim Ngân',
      role: 'Học sinh lớp 8',
      quote: 'Tôi rất thích cách học trên EduVerse. Các bài học rất sinh động và dễ hiểu. Tôi đã có thể cải thiện điểm số của mình trong môn Sinh học chỉ sau một tháng.',
      stars: 5,
      createdAt: '2025-22-5',
    },
  ];

  const sortedTestimonials = testimonials
    .slice()
    .sort((a, b) => {
      const dateA = normalizeDate(a.createdAt) || new Date(0);
      const dateB = normalizeDate(b.createdAt) || new Date(0);
      return dateB - dateA;
    });

  return (
    <section id="testimonials" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block mx-2">💬</span>
            Học sinh nói gì về chúng tôi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Phản hồi từ các học sinh và phụ huynh sử dụng nền tảng EduVerse
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {sortedTestimonials.map((testimonial, idx) => (
            <TestimonialCard
              key={idx}
              testimonial={testimonial}
              timeAgoText={testimonial.createdAt ? timeAgo(normalizeDate(testimonial.createdAt)) : null}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
