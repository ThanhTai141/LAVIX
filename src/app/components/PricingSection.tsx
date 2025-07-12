
import React from 'react';
import PricingCard from './PricingCard';


interface PricingProps {
  OpenPricingModal: () => void;
}

const PricingSection: React.FC<PricingProps> = ({OpenPricingModal}) => {
  const pricingPlans = [
    {
      name: 'Cơ bản',
      price: '99K',
      period: '/tháng',
      description: 'Dành cho học sinh mới bắt đầu',
      features: [
        'Truy cập đến 3 môn học',
        'Thư viện video cơ bản',
        'Trợ lý AI (giới hạn 20 câu hỏi/ngày)',
        'Bài kiểm tra trắc nghiệm',
      ],
      color: 'from-blue-500 to-blue-600',
      popular: false,
    },
    {
      name: 'Premium',
      price: '199K',
      period: '/tháng',
      description: 'Gói phổ biến nhất của chúng tôi',
      features: [
        'Không giới hạn môn học',
        'Thư viện video mở rộng',
        'Trợ lý AI không giới hạn',
        'Mô phỏng 3D và VR',
        'Bài kiểm tra tự động đánh giá',
        'Hỗ trợ kỹ thuật ưu tiên',
      ],
      color: 'from-purple-500 to-purple-600',
      popular: true,
    },
    {
      name: 'Gia đình',
      price: '399K',
      period: '/tháng',
      description: 'Dành cho gia đình (tối đa 5 người)',
      features: [
        'Tất cả tính năng của Premium',
        'Tối đa 5 tài khoản người dùng',
        'Theo dõi tiến trình cho phụ huynh',
        'Báo cáo học tập hàng tuần',
        'Tư vấn học tập 1-1 mỗi tháng',
      ],
      color: 'from-green-500 to-green-600',
      popular: false,
    },
  ];



  return (
    <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block mx-2">💎</span>
            Gói dịch vụ
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lựa chọn gói phù hợp với nhu cầu học tập của bạn
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => (
            <PricingCard key={idx} plan={plan} />
          ))}
        </div>
        <div className="text-center mt-12 bg-blue-50 rounded-xl p-8 shadow-inner">
          <h3 className="text-xl font-bold mb-3">Bạn là trường học hoặc tổ chức giáo dục?</h3>
          <p className="text-gray-600 mb-6">
            Chúng tôi cung cấp gói giải pháp đặc biệt dành cho các trường học với giá ưu đãi và tính năng quản lý lớp học.
          </p>
          <button 
            onClick={OpenPricingModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700">
            Liên hệ phòng kinh doanh
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;