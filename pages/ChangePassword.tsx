
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let strength = 0;
    if (pw.length >= 8) strength += 25;
    if (/[A-Z]/.test(pw)) strength += 25;
    if (/[0-9]/.test(pw)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pw)) strength += 25;
    return strength;
  };

  const strengthValue = passwordStrength(formData.new);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Giả lập xử lý API
    setTimeout(() => {
      if (formData.current !== '123456') {
        setStatus('error');
        setErrorMsg('Mật khẩu hiện tại không chính xác.');
      } else if (formData.new !== formData.confirm) {
        setStatus('error');
        setErrorMsg('Mật khẩu xác nhận không khớp.');
      } else {
        setStatus('success');
      }
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[3rem] border border-slate-100 shadow-2xl text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Đổi mật khẩu thành công!</h2>
        <p className="text-slate-500 mb-8">Tài khoản của bạn đã được bảo vệ bởi mật khẩu mới.</p>
        <button 
          onClick={() => navigate('/profile')}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          Quay lại hồ sơ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Quay lại
      </button>

      <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Bảo mật tài khoản</h1>
            <p className="text-slate-500">Thay đổi mật khẩu để tăng cường tính an toàn.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3 animate-in shake duration-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-bold">{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type={showCurrent ? 'text' : 'password'}
                required
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold"
                value={formData.current}
                onChange={(e) => setFormData({...formData, current: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type={showNew ? 'text' : 'password'}
                required
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold"
                value={formData.new}
                onChange={(e) => setFormData({...formData, new: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Password Strength Meter */}
            {formData.new && (
              <div className="px-1 pt-2 space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-400">Độ mạnh mật khẩu</span>
                  <span className={strengthValue < 50 ? 'text-red-500' : strengthValue < 100 ? 'text-amber-500' : 'text-emerald-500'}>
                    {strengthValue < 50 ? 'Yếu' : strengthValue < 100 ? 'Trung bình' : 'Mạnh'}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full flex gap-1">
                  <div className={`h-full rounded-full transition-all duration-500 ${strengthValue >= 25 ? (strengthValue < 50 ? 'bg-red-500' : strengthValue < 100 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'}`} style={{ width: `${Math.min(strengthValue, 100)}%` }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
            <div className="relative group">
              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type={showConfirm ? 'text' : 'password'}
                required
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold"
                value={formData.confirm}
                onChange={(e) => setFormData({...formData, confirm: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={status === 'loading' || !formData.new || formData.new !== formData.confirm}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang xử lý...
                </>
              ) : 'Xác nhận thay đổi'}
            </button>
          </div>
        </form>

        <div className="mt-10 p-5 bg-slate-50 rounded-2xl flex gap-4 items-start border border-slate-100">
           <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
           <p className="text-xs text-slate-500 leading-relaxed italic">
             <strong>Lời khuyên:</strong> Mật khẩu mạnh nên bao gồm chữ hoa, chữ thường, chữ số và ít nhất một ký tự đặc biệt (!@#...). Không nên sử dụng lại mật khẩu cũ.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
