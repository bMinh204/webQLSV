
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Calendar, 
  Lock, 
  Bell, 
  Save, 
  Database, 
  ShieldCheck, 
  Clock,
  Check,
  RotateCcw
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'academic' | 'security'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cấu hình hệ thống</h1>
          <p className="text-slate-500">Thiết lập các tham số vận hành và chính sách bảo mật toàn trường.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all">
            <RotateCcw className="w-5 h-5" /> Khôi phục mặc định
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            Lưu thay đổi
          </button>
        </div>
      </header>

      {showSuccess && (
        <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <Check className="w-5 h-5" />
          <span className="font-bold">Hệ thống đã được cập nhật thành công!</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-2">
          {[
            { id: 'general', label: 'Cấu hình chung', icon: SettingsIcon },
            { id: 'academic', label: 'Quản lý đào tạo', icon: Calendar },
            { id: 'security', label: 'Bảo mật & Quy chế', icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><SettingsIcon className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-slate-800">Thông tin hệ thống</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tên nền tảng</label>
                  <input type="text" defaultValue="EduChain - Smart Education" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email quản trị</label>
                  <input type="email" defaultValue="admin@educhain.edu.vn" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                </div>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl flex items-start gap-4 border border-blue-100">
                <Bell className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-blue-800">Thông báo bảo trì</p>
                  <p className="text-xs text-blue-600 mt-1">Thiết lập thời gian hệ thống tự động tạm ngưng để sao lưu dữ liệu (mặc định 02:00 sáng Chủ Nhật).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Calendar className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-slate-800">Quản lý Học kỳ & Đào tạo</h3>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Học kỳ hiện tại</label>
                    <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none cursor-pointer">
                      <option value="2023.2">Học kỳ 2 (2023 - 2024)</option>
                      <option value="2024.1">Học kỳ 1 (2024 - 2025)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Trạng thái đăng ký tín chỉ</label>
                    <div className="flex items-center gap-4 py-3">
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in bg-emerald-500 rounded-full">
                        <div className="absolute right-1 top-1 w-4 h-4 transition duration-200 ease-in bg-white rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">Đang mở cổng đăng ký</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 border border-slate-100 rounded-3xl space-y-4">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2"><Clock className="w-4 h-4" /> Thời gian nhập điểm</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ngày bắt đầu</p>
                      <input type="date" defaultValue="2024-05-15" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ngày kết thúc</p>
                      <input type="date" defaultValue="2024-06-30" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><ShieldCheck className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-slate-800">Bảo mật & Quy chế</h3>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Độ dài mật khẩu tối thiểu</label>
                    <input type="number" defaultValue="8" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phiên đăng nhập (Phút)</label>
                    <input type="number" defaultValue="120" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700">Tùy chọn xác thực</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Yêu cầu đổi mật khẩu lần đầu đăng nhập', checked: true },
                      { label: 'Bật xác thực 2 lớp (2FA) cho Admin', checked: true },
                      { label: 'Ghi nhật ký thao tác (Audit Log) toàn hệ thống', checked: true },
                    ].map((item, i) => (
                      <label key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                          {item.checked && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                        </div>
                        <span className="text-sm font-bold text-slate-600">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
