
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_COURSES, MOCK_ENROLLMENTS, MOCK_GRADES } from '../../constants';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  BarChart3, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TeacherClasses: React.FC = () => {
  const { user } = useAuth();
  const teacherCourses = MOCK_COURSES.filter(c => c.teacherId === user?.id);

  // Mock data cho biểu đồ phổ điểm tổng quát của giảng viên
  const distributionData = [
    { range: 'A (8.5-10)', count: 12, color: '#10b981' },
    { range: 'B (7.0-8.4)', count: 25, color: '#3b82f6' },
    { range: 'C (5.5-6.9)', count: 18, color: '#f59e0b' },
    { range: 'D (4.0-5.4)', count: 5, color: '#ef4444' },
    { range: 'F (< 4.0)', count: 2, color: '#64748b' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bảng điều khiển Giảng viên</h1>
          <p className="text-slate-500 mt-1">Chào mừng {user?.fullName}. Bạn có {teacherCourses.length} lớp học cần quản lý trong học kỳ này.</p>
        </div>
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 p-3 rounded-2xl">
          <Clock className="w-5 h-5 text-amber-600" />
          <div className="text-xs">
            <p className="font-bold text-amber-900">Hạn nhập điểm cuối kỳ</p>
            <p className="text-amber-700">Còn 05 ngày - Học kỳ 2023.2</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Danh sách lớp */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Danh sách lớp học phần
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teacherCourses.map((course) => {
              const studentCount = MOCK_ENROLLMENTS.filter(e => e.courseId === course.id).length;
              const gradedCount = MOCK_GRADES.filter(g => g.courseId === course.id).length;
              const progress = Math.round((gradedCount / studentCount) * 100);

              return (
                <div key={course.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded uppercase">{course.code}</span>
                    <div className={`p-2 rounded-xl ${progress === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {progress === 100 ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{course.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {studentCount} SV</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Thứ 2 (7:30)</div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                      <span className="text-slate-400">Tiến độ nhập liệu</span>
                      <span className="text-blue-600">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  <Link to={`/classes/${course.id}`} className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                    Quản lý lớp <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cột phụ: Thống kê & Phổ điểm */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Phổ điểm tổng hợp
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} layout="vertical" margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-200" />
              Nhắc nhở học vụ
            </h4>
            <p className="text-sm text-blue-100 leading-relaxed">
              Bạn có <strong>2 yêu cầu phúc khảo</strong> mới từ sinh viên lớp CS202 cần được phản hồi trước ngày 30/05.
            </p>
            <Link to="/announcements" className="mt-4 inline-flex items-center text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all">
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherClasses;
