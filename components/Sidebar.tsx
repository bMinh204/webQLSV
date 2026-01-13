
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCircle, 
  GraduationCap, 
  Calendar, 
  Bell, 
  Users, 
  BookOpen, 
  LogOut,
  Settings,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = {
    [UserRole.STUDENT]: [
      { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
      { path: '/profile', label: 'Thông tin cá nhân', icon: UserCircle },
      { path: '/grades', label: 'Kết quả học tập', icon: GraduationCap },
      { path: '/progress', label: 'Tiến độ học tập', icon: TrendingUp },
      { path: '/schedule', label: 'Lịch học & Thi', icon: Calendar },
      { path: '/announcements', label: 'Thông báo', icon: Bell },
    ],
    [UserRole.TEACHER]: [
      { path: '/', label: 'Quản lý lớp dạy', icon: Users },
      { path: '/grade-entry', label: 'Nhập điểm', icon: GraduationCap },
      { path: '/announcements', label: 'Thông báo', icon: Bell },
    ],
    [UserRole.ADMIN]: [
      { path: '/', label: 'Quản lý người dùng', icon: Users },
      { path: '/courses', label: 'Quản lý môn học', icon: BookOpen },
      { path: '/announcements', label: 'Thông báo', icon: Bell },
      { path: '/settings', label: 'Cấu hình hệ thống', icon: Settings },
    ]
  };

  const currentMenu = user ? menuItems[user.role] : [];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl text-slate-800">EduChain</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {currentMenu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-slate-50">
          <img src={user?.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-200" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
