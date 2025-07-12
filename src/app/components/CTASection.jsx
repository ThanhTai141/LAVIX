import React from 'react';

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Sẵn sàng nâng cao trải nghiệm học tập của bạn?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Hãy tham gia cùng hơn 500.000 học sinh đang khám phá cách học tập thú vị và hiệu quả hơn với công nghệ tiên tiến.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 shadow-lg">
                Dùng thử miễn phí 7 ngày
              </button>
              <button className="border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-full font-semibold">
                Xem demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-2xl shadow-lg">
                  ⭐
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Học tập dựa trên thành tích</h3>
                  <p className="text-blue-100">
                    Hệ thống huy hiệu và phần thưởng giúp duy trì động lực, theo dõi tiến trình và thưởng cho những nỗ lực của bạn.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['Chuyên gia Lịch sử', 'Siêu sao Toán học', 'Nhà khoa học'].map((badge, idx) => (
                  <div key={idx} className="bg-white/5 p-3 rounded-lg text-center hover:bg-white/10 cursor-pointer">
                    <div className="text-2xl mb-1">{['🏆', '🥇', '🔍'][idx]}</div>
                    <div className="text-sm font-medium">{badge}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Tiến trình học tập</span>
                  <span>68%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <div className="text-sm text-blue-100">
                  Tiếp tục học để mở khóa huy hiệu tiếp theo!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;