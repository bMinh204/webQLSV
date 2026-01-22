
import React from 'react';
import { useAuth } from '../../context/AuthContext';
// Added Bell to the imports from lucide-react to resolve the reference error in the stats array
import { GraduationCap, BookOpen, Clock, Calendar, TrendingUp, AlertCircle, Bell } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { MOCK_GRADES, MOCK_COURSES, MOCK_SCHEDULES } from '../../constants';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const student = user?.details as any;

  // Mock data for chart: GPA over semesters
  const gpaData = [
    { name: 'Kỳ 1', gpa: 2.8 },
    { name: 'Kỳ 2', gpa: 3.1 },
    { name: 'Kỳ 3', gpa: 3.4 },
    { name: 'Kỳ 4', gpa: 3.2 },
    { name: 'Kỳ 5', gpa: 3.45 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Chào mừng trở lại, {user?.fullName}! 👋</h1>
          <p className="text-slate-500 mt-1">Dưới đây là tóm tắt tình hình học tập của bạn cho học kỳ này.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <Calendar className="text-blue-600 w-5 h-5" />
          <span className="font-semibold text-slate-700">Học kỳ 2023.2</span>
        </div>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'GPA Tích lũy', value: student.gpa, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Tín chỉ hoàn thành', value: `${student.totalCredits}/145`, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Lớp học hôm nay', value: '2 môn', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Điểm mới cập nhật', value: '+3', icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Tiến độ GPA qua các học kỳ
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpaData}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="gpa" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Bảng điểm gần đây</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="pb-4 font-semibold text-slate-500 text-sm">Môn học</th>
                    <th className="pb-4 font-semibold text-slate-500 text-sm">Điểm QT</th>
                    <th className="pb-4 font-semibold text-slate-500 text-sm">Điểm Thi</th>
                    <th className="pb-4 font-semibold text-slate-500 text-sm">Tổng kết</th>
                    <th className="pb-4 font-semibold text-slate-500 text-sm">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_GRADES.slice(0, 3).map((grade) => {
                    const course = MOCK_COURSES.find(c => c.id === grade.courseId);
                    return (
                      <tr key={grade.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4">
                          <p className="font-semibold text-slate-800">{course?.name}</p>
                          <p className="text-xs text-slate-400">{course?.code}</p>
                        </td>
                        <td className="py-4 text-slate-600">{grade.processGrade}</td>
                        <td className="py-4 text-slate-600">{grade.finalGrade}</td>
                        <td className="py-4 font-bold text-blue-600">{grade.totalGrade}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                            Đạt
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Lịch học hôm nay
            </h3>
            <div className="space-y-4">
              {MOCK_SCHEDULES.map((item) => (
                <div key={item.id} className="relative pl-6 border-l-2 border-blue-100 py-1">
                  <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.timeSlot}</p>
                  <p className="font-bold text-slate-800">{item.courseName}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    Phòng {item.room} • GV. {item.teacherName}
                  </p>
                </div>
              ))}
              {MOCK_SCHEDULES.length === 0 && <p className="text-slate-400 text-sm italic">Hôm nay không có lịch học.</p>}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <AlertCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Mẹo học tập</span>
            </div>
            <h4 className="text-lg font-bold mb-2">Lời khuyên từ AI</h4>
            <p className="text-sm text-blue-100 leading-relaxed mb-4">
              Bạn đang học tốt môn Toán cao cấp! Hãy thử áp dụng các kiến thức này vào đồ án CS101 để đạt kết quả tốt hơn.
            </p>
            <button className="w-full py-2 bg-white text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-50 transition-colors">
              Xem lộ trình gợi ý
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
