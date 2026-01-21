
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck,
  Edit3,
  Check
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const student = user?.details as any;
  const [isEditing, setIsEditing] = useState(false);

  if (!user || !student) return null;

  const infoGroups = [
    {
      title: 'Thông tin cơ bản',
      icon: User,
      items: [
        { label: 'Họ và tên', value: user.fullName },
        { label: 'Mã sinh viên', value: student.studentId },
        { label: 'Ngày sinh', value: new Date(student.dob).toLocaleDateString('vi-VN') },
        { label: 'Giới tính', value: student.gender },
      ]
    },
    {
      title: 'Thông tin học tập',
      icon: GraduationCap,
      items: [
        { label: 'Lớp sinh hoạt', value: student.class },
        { label: 'Khoa', value: student.faculty },
        { label: 'Chuyên ngành', value: student.major },
        { label: 'Trạng thái', value: student.status, isStatus: true },
      ]
    },
    {
      title: 'Liên hệ',
      icon: Mail,
      items: [
        { label: 'Email học viên', value: user.email },
        { label: 'Số điện thoại', value: student.phone },
        { label: 'Địa chỉ', value: 'Quận Cầu Giấy, Hà Nội' }, // Ví dụ thêm
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hồ sơ cá nhân</h1>
          <p className="text-slate-500">Quản lý và cập nhật thông tin tài khoản của bạn.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            isEditing 
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700' 
            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isEditing ? (
            <><Check className="w-5 h-5" /> Lưu thay đổi</>
          ) : (
            <><Edit3 className="w-5 h-5" /> Chỉnh sửa liên hệ</>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar and Summary */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="relative inline-block">
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl mx-auto object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-6">{user.fullName}</h2>
            <p className="text-slate-500 font-medium">Sinh viên • {student.studentId}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">GPA</p>
                <p className="text-xl font-black text-blue-600">{student.gpa}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Tín chỉ</p>
                <p className="text-xl font-black text-slate-800">{student.totalCredits}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-lg shadow-blue-100">
            <ShieldCheck className="w-10 h-10 text-blue-200 mb-6" />
            <h3 className="text-xl font-bold mb-2">Bảo mật tài khoản</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Bạn nên thay đổi mật khẩu định kỳ 3 tháng một lần để đảm bảo an toàn cho tài khoản học thuật.
            </p>
            <button className="w-full py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {infoGroups.map((group, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <group.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-800">{group.title}</h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                {group.items.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                    {item.isStatus ? (
                      <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-full mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                        {item.value === 'Active' ? 'Đang theo học' : item.value}
                      </span>
                    ) : isEditing && (item.label === 'Số điện thoại' || item.label === 'Địa chỉ') ? (
                      <input 
                        type="text" 
                        defaultValue={item.value}
                        className="w-full py-1 text-slate-800 font-semibold border-b-2 border-blue-500 focus:outline-none bg-blue-50/30 px-2 rounded-t"
                      />
                    ) : (
                      <p className="text-slate-800 font-semibold text-lg">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
