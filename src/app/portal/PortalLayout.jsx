"use client";
import React, { useState } from 'react';
import Link from 'next/link'; 
import { usePathname } from 'next/navigation'; 
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart2,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';

const PortalLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname(); 

  const menuItems = [
    {
      title: 'Tổng quan',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/portal'
    },
    {
      title: 'Học sinh',
      icon: <Users className="w-5 h-5" />,
      path: '/portal/students'
    },
    {
      title: 'Báo cáo',
      icon: <BarChart2 className="w-5 h-5" />,
      path: '/portal/reports'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white border-r border-gray-200 w-64`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/portal" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-800">MindX</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className={`${isSidebarOpen ? 'lg:ml-64' : ''} transition-all duration-300`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Nguyễn Văn A</p>
                  <p className="text-xs text-gray-500">Giáo viên</p>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <LogOut className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;