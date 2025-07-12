import React from 'react';

const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl">
      <div className="p-1">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-t-lg flex items-center justify-center">
          <span className="text-5xl">{icon}</span>
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600">{desc}</p>
      </div>
    </div>
  );
};

export default FeatureCard;