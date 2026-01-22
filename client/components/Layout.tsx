import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bot,
  UserCircle,
  Bell,
  Check,
  Trash2,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle
} from 'lucide-react';
import Chatbot from './Chatbot';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  const getNotifIcon = (type: string) => {
    switch(type) {
        case 'warning': return <AlertTriangle size={18} className="text-yellow-500" />;
        case 'danger': return <AlertCircle size={18} className="text-red-500" />;
        case 'success': return <CheckCircle size={18} className="text-green-500" />;
        default: return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-xl z-20">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            EduSmart AI
          </h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý Đào tạo</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {user?.role === UserRole.ADMIN && (
            <>
              <NavItem to="/admin" icon={LayoutDashboard} label="Tổng quan" />
              <NavItem to="/admin/users" icon={Users} label="Quản lý Người dùng" />
              <NavItem to="/admin/settings" icon={Settings} label="Cài đặt Hệ thống" />
            </>
          )}

          {user?.role === UserRole.LECTURER && (
            <>
              <NavItem to="/lecturer" icon={LayoutDashboard} label="Tổng quan" />
              <NavItem to="/lecturer/classes" icon={BookOpen} label="Lớp học của tôi" />
            </>
          )}

          {user?.role === UserRole.STUDENT && (
            <>
              <NavItem to="/student" icon={LayoutDashboard} label="Tổng quan" />
              <NavItem to="/student/grades" icon={GraduationCap} label="Bảng điểm" />
            </>
          )}
          
          <div className="pt-4 border-t border-slate-800 mt-4">
            <NavItem to="/profile" icon={UserCircle} label="Hồ sơ cá nhân" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Link to="/profile" className="flex items-center gap-3 mb-4 px-2 hover:opacity-80 transition-opacity">
            <img src={user?.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-slate-600" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role === UserRole.ADMIN ? 'Quản trị viên' : user?.role === UserRole.LECTURER ? 'Giảng viên' : 'Sinh viên'}</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header - Mobile & Desktop Enhancements */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-8 z-30 relative">
          <div className="flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 md:hidden">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-xl font-bold text-slate-800 md:hidden">EduSmart AI</h1>
              {/* Optional: Add a title for the current page here for desktop */}
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
                <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative"
                >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                </button>

                {/* Notification Dropdown */}
                {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-semibold text-slate-800">Thông báo</h3>
                            {notifications.length > 0 && (
                                <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                    <Check size={12} /> Đánh dấu đã đọc
                                </button>
                            )}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    <Bell size={32} className="mx-auto mb-2 text-slate-300" />
                                    Không có thông báo mới
                                </div>
                            ) : (
                                <ul>
                                    {notifications.map((notif) => (
                                        <li 
                                            key={notif.id} 
                                            onClick={() => markAsRead(notif.id)}
                                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                                        >
                                            <div className="mt-1 flex-shrink-0">
                                                {getNotifIcon(notif.type)}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-medium ${!notif.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                                                    {notif.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-2">
                                                    {new Date(notif.date).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                            {!notif.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {notifications.length > 0 && (
                             <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                                <button onClick={clearNotifications} className="text-xs text-slate-500 hover:text-red-500 flex items-center justify-center gap-1 w-full py-1">
                                    <Trash2 size={12} /> Xóa tất cả
                                </button>
                             </div>
                        )}
                    </div>
                )}
            </div>

            {/* User Avatar (Mobile only, since desktop has it in sidebar) */}
            <Link to="/profile" className="md:hidden">
                <img src={user?.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
            </Link>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full h-[calc(100vh-64px)] bg-slate-900 z-30 p-4">
            <nav className="space-y-2">
              {user?.role === UserRole.ADMIN && <NavItem to="/admin" icon={LayoutDashboard} label="Tổng quan" />}
              {user?.role === UserRole.LECTURER && <NavItem to="/lecturer" icon={LayoutDashboard} label="Tổng quan" />}
              {user?.role === UserRole.STUDENT && <NavItem to="/student" icon={LayoutDashboard} label="Tổng quan" />}
              <NavItem to="/profile" icon={UserCircle} label="Hồ sơ cá nhân" />
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 mt-4 text-red-400 hover:bg-slate-800 rounded-lg"
              >
                <LogOut size={20} />
                Đăng xuất
              </button>
            </nav>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50 relative">
          <Outlet />
        </div>

        {/* Floating Chatbot Button */}
        <div className="absolute bottom-6 right-6 z-40">
           {!isChatOpen && (
             <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center"
             >
               <Bot size={28} />
             </button>
           )}
           {isChatOpen && (
             <Chatbot onClose={() => setIsChatOpen(false)} />
           )}
        </div>
      </main>
    </div>
  );
};

export default Layout;