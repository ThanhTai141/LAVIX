import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ testimonial, timeAgoText }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold">{testimonial.name}</h4>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
            {timeAgoText && (
              <p className="text-xs text-gray-400 italic mt-1">{timeAgoText}</p>
            )}
          </div>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < testimonial.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-600">"{testimonial.quote}"</p>
    </div>
  );
};

export default TestimonialCard;
