import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Star, Users } from 'lucide-react';




const SubjectPreview = ({ subject }) => {
  const demoVideoUrl = 'https://www.youtube.com/watch?v=KWQqgkpV74k' || 'https://www.youtube.com/watch?v=oV7qaHKPoK0&list=RDO2ZfBvJAt94&index=20';
  const [isPlaying, setIsPlaying] = useState(false); 

  const handlePreviewClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative">
      <div className={`bg-gradient-to-br ${subject.color} rounded-2xl p-1 shadow-xl`}>
        <div className="bg-white rounded-xl p-6">
          <div className="aspect-video rounded-lg mb-4 relative overflow-hidden">
            <ReactPlayer
              url={demoVideoUrl}
              width="100%"
              height="100%"
              controls
              light="https://vietsu.org/wp-content/uploads/2021/05/ngo_quyen.jpg"
              playing={isPlaying}
              onClickPreview={handlePreviewClick} 
            />
          </div>
          <h4 className="font-bold text-lg mb-2">
            Bài học: Khám phá{' '}
            {subject.title
              .replace('📜 ', '')
              .replace('🔬 ', '')
              .replace('🧬 ', '')
              .replace('🌍 ', '')
              .replace('📐 ', '')
              .replace('⚡ ', '')}
          </h4>
          <p className="text-gray-600 text-sm mb-4">12 bài học • 4 bài tập thực hành • 2 bài kiểm tra</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-400 text-sm">Độ khó</div>
              <div className="font-medium flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-gray-300" />
                <Star className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-400 text-sm">Thời gian</div>
              <div className="font-medium">6 giờ</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                >
                  <Users className="w-4 h-4 text-gray-500" />
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600">+2,405 học sinh đã đăng ký</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectPreview;