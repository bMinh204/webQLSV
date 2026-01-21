
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại mã số và mật khẩu.');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side: Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center p-12">
        <div className="relative z-10 text-white max-w-lg">
          <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">Chào mừng bạn đến với EduChain</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Hệ thống quản lý sinh viên thông minh, minh bạch và hiệu quả nhất cho môi trường giáo dục hiện đại.
          </p>
        </div>
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-blue-600 p-3 rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Đăng nhập</h2>
          <p className="text-slate-500 mb-8">Vui lòng nhập tài khoản để truy cập hệ thống</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                <AlertCircle className="shrink-0 w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Tài khoản (Mã số)</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập mã sinh viên / giảng viên"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                <span className="text-sm text-slate-600">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập ngay'}
            </button>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm italic">
                Sử dụng "SV001" (Sinh viên), "GV001" (Giảng viên) hoặc "admin" (Admin) với mật khẩu "123456" để trải nghiệm.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
