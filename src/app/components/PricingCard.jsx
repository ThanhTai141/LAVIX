import React from 'react';

const PricingCard = ({ plan }) => {
  return (
    <div className={`bg-white rounded-xl shadow-xl ${plan.popular ? 'ring-4 ring-purple-400 z-10' : ''}`}>
      {plan.popular && (
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-lg text-white text-center py-2 font-medium">
          Phổ biến nhất
        </div>
      )}
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-6">{plan.description}</p>
        <div className="flex items-end mb-6">
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className="text-gray-500">{plan.period}</span>
        </div>
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, fidx) => (
            <li key={fidx} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              {feature}
            </li>
          ))}
        </ul>
        <button className={`w-full bg-gradient-to-r ${plan.color} text-white font-bold py-3 rounded-full`}>
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
};

export default PricingCard;