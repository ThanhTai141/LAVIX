// src/app/profile/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from "../components/Navbar";
import { User, Trophy, Star, Calendar, Award, TrendingUp, Play, Gamepad2 } from 'lucide-react';

// Định nghĩa các interface
interface UserProfile {
  id: string;
  name: string;
  role: 'student' | 'parent';
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  streak: number;
  badges: Badge[];
  subjects: Subject[];
  recentActivities: Activity[];
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  progress: number;
  level: number;
  xp: number;
  color: string;
  games: Game[];
}

interface Game {
  id: string;
  name: string;
  type: 'AR' | 'VR' | 'AI' | 'Normal';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  stars: number;
  lastPlayed?: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  xpGained: number;
  timestamp: string;
  subject: string;
}

// Mock data
const mockProfile: UserProfile = {
  id: '1',
  name: 'Nguyễn Văn A',
  role: 'student',
  avatar: '👨‍🎓',
  level: 5,
  xp: 750,
  nextLevelXp: 1000,
  coins: 120,
  streak: 7,
  badges: [
    {
      id: 'b1',
      name: 'Học sinh xuất sắc',
      icon: '🏅',
      description: 'Hoàn thành 10 bài học liên tiếp',
      rarity: 'epic',
      unlockedAt: '2025-05-20',
    },
    {
      id: 'b2',
      name: 'Thử thách đầu tiên',
      icon: '🎯',
      description: 'Hoàn thành trò chơi đầu tiên',
      rarity: 'common',
      unlockedAt: '2025-05-18',
    },
  ],
  subjects: [
    {
      id: 's1',
      name: 'Toán học',
      icon: '📐',
      progress: 80,
      level: 3,
      xp: 600,
      color: 'bg-blue-500',
      games: [
        {
          id: 'g1',
          name: 'Phép toán cơ bản',
          type: 'Normal',
          difficulty: 'Easy',
          completed: true,
          stars: 3,
          lastPlayed: '2025-05-25',
        },
        {
          id: 'g2',
          name: 'Giải đố AR',
          type: 'AR',
          difficulty: 'Medium',
          completed: false,
          stars: 0,
        },
      ],
    },
    {
      id: 's2',
      name: 'Vật lý',
      icon: '⚛️',
      progress: 50,
      level: 2,
      xp: 300,
      color: 'bg-green-500',
      games: [
        {
          id: 'g3',
          name: 'Chuyển động VR',
          type: 'VR',
          difficulty: 'Hard',
          completed: true,
          stars: 2,
          lastPlayed: '2025-05-22',
        },
      ],
    },
  ],
  recentActivities: [
    {
      id: 'a1',
      type: 'game',
      description: 'Hoàn thành trò chơi Phép toán cơ bản',
      xpGained: 50,
      timestamp: '2025-05-25',
      subject: 'Toán học',
    },
    {
      id: 'a2',
      type: 'badge',
      description: 'Nhận huy hiệu Học sinh xuất sắc',
      xpGained: 100,
      timestamp: '2025-05-20',
      subject: 'Toán học',
    },
  ],
};

// Mock user for AuthContext (nếu chưa có AuthContext)
const mockUser = { id: 'mock-user', email: 'test@example.com' };

const STYLES = {
  gradientBg: 'bg-gradient-to-br from-indigo-50 via-white to-purple-50',
  card: 'bg-white rounded-xl shadow-lg p-6 border border-gray-100',
  tabActive: 'bg-indigo-500 text-white shadow-lg',
  tabInactive: 'text-gray-600 hover:bg-gray-100',
  statCard: (color: string) => `bg-gradient-to-br from-${color}-50 to-${color}-100 p-4 rounded-xl text-center`,
};



const ProfileUI: React.FC = () => {
  const { user } = useAuth() || { user: mockUser };
  const [activeTab, setActiveTab] = useState<'overview' | 'games' | 'achievements' | 'progress'>('overview');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);





  // Sử dụng mock data thay vì gọi API
  React.useEffect(() => {
    if (!user) {
      setError('Vui lòng đăng nhập');
      setLoading(false);
      return;
    }
    setProfile(mockProfile);
    setLoading(false);
  }, [user]);

  const getRarityColor = (rarity: string) => {
    return {
      common: 'border-gray-400 bg-gray-50',
      rare: 'border-blue-400 bg-blue-50',
      epic: 'border-purple-400 bg-purple-50',
      legendary: 'border-yellow-400 bg-yellow-50',
    }[rarity] || 'border-gray-400 bg-gray-50';
  };

  const getRarityStyle = (rarity: string) => {
    return {
      legendary: 'bg-yellow-100 text-yellow-800',
      epic: 'bg-purple-100 text-purple-800',
      rare: 'bg-blue-100 text-blue-800',
      common: 'bg-gray-100 text-gray-800',
    }[rarity] || 'bg-gray-100 text-gray-800';
  };

  const getGameTypeIcon = (type: string) => {
    return { AR: '🥽', VR: '🕶️', AI: '🤖', Normal: '🎮' }[type] || '🎮';
  };

  const getDifficultyColor = (difficulty: string) => {
    return {
      Easy: 'text-green-600 bg-green-100',
      Medium: 'text-yellow-600 bg-yellow-100',
      Hard: 'text-red-600 bg-red-100',
    }[difficulty] || 'text-gray-600 bg-gray-100';
  };

  const stats = useMemo(() => ({
    totalGames: profile?.subjects.reduce((total, subject) => total + subject.games.filter((game) => game.completed).length, 0) || 0,
    totalStars: profile?.subjects.reduce((total, subject) => total + subject.games.reduce((stars, game) => stars + game.stars, 0), 0) || 0,
    arVrGames: profile?.subjects.reduce((total, subject) => total + subject.games.filter((game) => (game.type === 'AR' || game.type === 'VR') && game.completed).length, 0) || 0,
    aiGames: profile?.subjects.reduce((total, subject) => total + subject.games.filter((game) => game.type === 'AI' && game.completed).length, 0) || 0,
  }), [profile]);

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: User },
    { id: 'games', label: 'Trò chơi', icon: Gamepad2 },
    { id: 'achievements', label: 'Thành tích', icon: Trophy },
    { id: 'progress', label: 'Tiến độ', icon: TrendingUp },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  if (error || !profile) return <div className="min-h-screen flex items-center justify-center text-red-600">{error || 'Không tìm thấy dữ liệu hồ sơ'}</div>;

  return (
    <div className={`${STYLES.gradientBg} min-h-screen p-4`}>
              <Navbar openAuthModal={() => console.log('Open auth modal')} />

      <div className="max-w-7xl mx-auto mt-20 space-y-6">

        {/* Header Profile Card */}
        <div className={STYLES.card}>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex flex-col items-center text-center lg:text-left lg:flex-row lg:items-start gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl">
                  {profile.avatar}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-white">
                  {profile.level}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-600 capitalize">{profile.role === 'student' ? 'Học sinh' : 'Phụ huynh'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-orange-600">
                    <Trophy className="w-4 h-4" />
                    <span className="font-semibold">Level {profile.level}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">{profile.coins} coins</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
              <div className={STYLES.statCard('blue')}>
                <div className="text-2xl font-bold text-blue-700">{profile.xp}</div>
                <div className="text-sm text-blue-600">Điểm XP</div>
              </div>
              <div className={STYLES.statCard('green')}>
                <div className="text-2xl font-bold text-green-700">{profile.streak}</div>
                <div className="text-sm text-green-600">Ngày liên tục</div>
              </div>
              <div className={STYLES.statCard('purple')}>
                <div className="text-2xl font-bold text-purple-700">{profile.badges.length}</div>
                <div className="text-sm text-purple-600">Huy hiệu</div>
              </div>
              <div className={STYLES.statCard('orange')}>
                <div className="text-2xl font-bold text-orange-700">{profile.subjects.length}</div>
                <div className="text-sm text-orange-600">Môn học</div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tiến độ Level {profile.level}</span>
              <span>{profile.xp}/{profile.nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(profile.xp / profile.nextLevelXp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={STYLES.card.replace('p-6', 'p-2')}>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id ? STYLES.tabActive : STYLES.tabInactive
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Hoạt động gần đây
              </h3>
              <div className="space-y-4">
                {profile.recentActivities.length ? (
                  profile.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        {activity.type === 'game' && <Play className="w-5 h-5 text-indigo-600" />}
                        {activity.type === 'badge' && <Award className="w-5 h-5 text-yellow-600" />}
                        {activity.type === 'level' && <TrendingUp className="w-5 h-5 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{activity.subject}</span>
                          <span>+{activity.xpGained} XP</span>
                          <span>{new Date(activity.timestamp).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Chưa có hoạt động nào</p>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold">Chuỗi học tập</h4>
                    <p className="text-2xl font-bold">{profile.streak} ngày</p>
                  </div>
                  <div className="text-3xl">🔥</div>
                </div>
                <p className="text-sm opacity-90 mt-2">Tiếp tục để duy trì chuỗi!</p>
              </div>
              <div className={STYLES.card}>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Huy hiệu mới nhất</h4>
                <div className="space-y-3">
                  {profile.badges.slice(0, 3).length ? (
                    profile.badges.slice(0, 3).map((badge) => (
                      <div key={badge.id} className={`p-3 rounded-lg border-2 ${getRarityColor(badge.rarity)}`}>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{badge.icon}</div>
                          <div>
                            <p className="font-medium text-gray-900">{badge.name}</p>
                            <p className="text-sm text-gray-600">{badge.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">Chưa có huy hiệu nào</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="space-y-6">
            <div className={STYLES.card}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chọn môn học</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.subjects.length ? (
                  profile.subjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedSubject === subject.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{subject.icon}</div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900">{subject.name}</p>
                          <p className="text-sm text-gray-600">Level {subject.level}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className={`${subject.color} h-2 rounded-full`}
                              style={{ width: `${subject.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-600">Chưa có môn học nào</p>
                )}
              </div>
            </div>
            {selectedSubject && (
              <div className={STYLES.card}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Trò chơi {profile.subjects.find((s) => s.id === selectedSubject)?.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.subjects
                    .find((s) => s.id === selectedSubject)
                    ?.games.map((game) => (
                      <div
                        key={game.id}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl">{getGameTypeIcon(game.type)}</div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}
                          >
                            {game.difficulty}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{game.name}</h4>
                        <p className="text-sm text-gray-600 mb-4">{game.type} Experience</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= game.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                            {game.completed ? 'Chơi lại' : 'Bắt đầu'}
                          </button>
                        </div>
                      </div>
                    )) || <p className="text-gray-600">Chưa có trò chơi nào</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className={STYLES.card}>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Bộ sưu tập huy hiệu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.badges.length ? (
                profile.badges.map((badge) => (
                  <div key={badge.id} className={`p-6 rounded-xl border-2 ${getRarityColor(badge.rarity)}`}>
                    <div className="text-center">
                      <div className="text-4xl mb-3">{badge.icon}</div>
                      <h4 className="font-bold text-gray-900 mb-2">{badge.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRarityStyle(badge.rarity)}`}
                      >
                        {badge.rarity}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        Đạt được: {new Date(badge.unlockedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Chưa có huy hiệu nào</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className={STYLES.card}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tiến độ tổng quan</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Tiến độ môn học</h4>
                  <div className="space-y-4">
                    {profile.subjects.length ? (
                      profile.subjects.map((subject) => (
                        <div key={subject.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{subject.icon}</span>
                              <span className="font-medium text-gray-900">{subject.name}</span>
                            </div>
                            <span className="text-sm text-gray-600">Level {subject.level}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`${subject.color} h-3 rounded-full transition-all duration-500`}
                              style={{ width: `${subject.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{subject.progress}% hoàn thành</span>
                            <span>{subject.xp} XP</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">Chưa có môn học nào</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Thống kê học tập</h4>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Tổng số game đã chơi</span>
                        <span className="font-bold text-blue-700">{stats.totalGames}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Tổng số sao thu được</span>
                        <span className="font-bold text-green-700">{stats.totalStars}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Game AR/VR đã thử</span>
                        <span className="font-bold text-purple-700">{stats.arVrGames}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">AI Chatbot đã sử dụng</span>
                        <span className="font-bold text-orange-700">{stats.aiGames}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={() => handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUI;