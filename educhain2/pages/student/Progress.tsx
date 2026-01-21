
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  TrendingUp, 
  Award, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const student = user?.details as any;

  // Mock data for GPA Trend
  const gpaTrend = [
    { semester: 'Kỳ 1', gpa: 2.8, average: 2.5 },
    { semester: 'Kỳ 2', gpa: 3.1, average: 2.6 },
    { semester: 'Kỳ 3', gpa: 3.4, average: 2.7 },
    { semester: 'Kỳ 4', gpa: 3.2, average: 2.7 },
    { semester: 'Kỳ 5', gpa: 3.45, average: 2.8 },
  ];

  // Mock data for Credit distribution
  const creditDistribution = [
    { name: 'Cơ bản', value: 30, color: '#3b82f6' },
    { name: 'Chuyên ngành', value: 35, color: '#8b5cf6' },
    { name: 'Tự chọn', value: 10, color: '#10b981' },
    { name: 'Đồ án/TT', value: 0, color: '#f59e0b' },
  ];

  const totalRequired = 145;
  const completed = student?.totalCredits || 75;
  const remaining = totalRequired - completed;
  const progressPercent = Math.round((completed / totalRequired) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Tiến độ học tập</h1>
        <p className="text-slate-500">Theo dõi lộ trình hoàn thành chương trình đào tạo của bạn.</p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tổng tín chỉ</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{completed}</span>
            <span className="text-slate-400 font-medium">/ {totalRequired}</span>
          </div>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-medium text-right">Đã hoàn thành {progressPercent}%</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">GPA Hiện tại</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-slate-900">{student?.gpa}</span>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded uppercase">Tốt</span>
          </div>
          <p className="mt-4 text-xs text-slate-400 leading-relaxed">
            Bạn cần duy trì GPA trên 3.2 để đạt loại Giỏi khi tốt nghiệp.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 rounded-2xl">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Còn lại</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{remaining}</span>
            <span className="text-slate-400 font-medium">tín chỉ</span>
          </div>
          <p className="mt-4 text-xs text-slate-400 leading-relaxed">
            Dự kiến hoàn thành trong 3 học kỳ nữa.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-50 rounded-2xl">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Xếp loại dự kiến</span>
          </div>
          <span className="text-2xl font-black text-orange-600">Khá - Giỏi</span>
          <div className="mt-4 flex items-center gap-1">
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-orange-400' : 'bg-slate-100'}`}></div>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GPA Progression Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Biểu đồ tăng trưởng GPA</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-xs font-medium text-slate-500">Cá nhân</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <span className="text-xs font-medium text-slate-500">Trung bình lớp</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gpaTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGpaProg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="average" stroke="#e2e8f0" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorGpaProg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credit Breakdown */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Cấu trúc tín chỉ</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={creditDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {creditDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-2xl font-black text-slate-800">{completed}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tín chỉ</p>
            </div>
          </div>
          <div className="mt-8 space-y-4 flex-1">
            {creditDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-semibold text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value} TC</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graduation Requirements */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Điều kiện xét tốt nghiệp
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Hoàn thành khối kiến thức đại cương', status: true },
              { label: 'Hoàn thành khối kiến thức chuyên ngành', status: false, current: '35/60' },
              { label: 'Chứng chỉ tiếng Anh (IELTS 6.0+)', status: true },
              { label: 'Chứng chỉ Tin học IC3/MOS', status: true },
              { label: 'Điểm rèn luyện >= 70', status: true },
              { label: 'Hoàn thành thực tập doanh nghiệp', status: false },
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 group hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-1.5 rounded-full ${req.status ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${req.status ? 'text-slate-800' : 'text-slate-500'}`}>{req.label}</p>
                    {req.current && <p className="text-xs text-blue-600 font-semibold mt-0.5">Tiến độ: {req.current}</p>}
                  </div>
                </div>
                {!req.status && (
                  <button className="text-slate-400 group-hover:text-blue-600">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Academic Alerts */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              Cảnh báo & Gợi ý
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <p className="text-sm font-bold text-blue-800 mb-1">Cơ hội cải thiện điểm</p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Bạn có môn <strong>Toán cao cấp A1 (D)</strong>. Đăng ký học cải thiện vào kỳ tới có thể giúp GPA của bạn tăng thêm <strong>0.12</strong> điểm.
                </p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <p className="text-sm font-bold text-emerald-800 mb-1">Duy trì phong độ</p>
                <p className="text-xs text-emerald-600 leading-relaxed">
                  Kết quả học tập kỳ vừa rồi của bạn nằm trong <strong>Top 15%</strong> của khoa. Tiếp tục phát huy nhé!
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl opacity-60">
                <p className="text-sm font-bold text-slate-500 mb-1">Học vụ</p>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  Không có cảnh báo học vụ nào cho kỳ học này.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl">
            <h4 className="text-lg font-bold mb-4">Dự đoán kết quả</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Dựa trên xu hướng hiện tại, AI dự báo bạn sẽ hoàn thành chương trình học vào <strong>Tháng 6/2026</strong> với GPA tích lũy khoảng <strong>3.52</strong>.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-blue-400 w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Xác suất chính xác</p>
                <p className="text-lg font-bold">88.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
