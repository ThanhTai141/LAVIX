import React from 'react';

const StatCard = ({ value, label }) => {
  return (
    <div className="bg-blue-50 rounded-xl shadow-sm p-6 text-center">
      <div className="text-4xl font-bold text-blue-600">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

export default StatCard;