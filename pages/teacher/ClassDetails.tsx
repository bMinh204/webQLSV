
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_COURSES, MOCK_ENROLLMENTS, MOCK_USERS, MOCK_GRADES } from '../../constants';
import { 
  Users, 
  ChevronLeft, 
  Mail, 
  Phone, 
  ArrowRight, 
  GraduationCap, 
  FileText, 
  BarChart3,
  Search,
  Download,
  MoreVertical
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const ClassDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const course = MOCK_COURSES.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
        <p className="text-slate-500 mb-4 font-medium text-lg">Không tìm thấy thông tin lớp học.</p>
        <button onClick={() => navigate('/classes')} className="text-blue-600 font-bold flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" /> Quay lại danh sách
        </button>
      </div>
    );
  }

  // Lấy dữ liệu sinh viên trong lớp
  const studentIds = MOCK_ENROLLMENTS.filter(e => e.courseId === course.id).map(e => e.studentId);
  const studentsInClass = MOCK_USERS.filter(u => studentIds.includes(u.id));
  const gradesInClass = MOCK_GRADES.filter(g => g.courseId === course.id);

  // Thống kê phân loại học lực
  const gradeDistribution = [
    { name: 'Loại A', value: gradesInClass.filter(g => g.letterGrade === 'A').length, color: '#10b981' },
    { name: 'Loại B', value: gradesInClass.filter(g => g.letterGrade.startsWith('B')).length, color: '#3b82f6' },
    { name: 'Loại C', value: gradesInClass.filter(g => g.letterGrade.startsWith('C')).length, color: '#f59e0b' },
    { name: 'Loại D/F', value: gradesInClass.filter(g => ['D', 'F'].includes(g.letterGrade)).length, color: '#ef4444' },
  ];

  const totalGraded = gradesInClass.length;
  const averageGPA = totalGraded > 0 
    ? (gradesInClass.reduce((sum, g) => sum + g.totalGrade, 0) / totalGraded).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <nav className="flex items-center gap-2 text-sm">
        <button onClick={() => navigate('/classes')} className="text-slate-500 hover:text-blue-600 transition-colors">Danh sách lớp</button>
        <span className="text-slate-300">/</span>
        <span className="font-bold text-slate-800">{course.name}</span>
      </nav>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-start gap-6">
           <div className="p-5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
              <GraduationCap className="w-10 h-10" />
           </div>
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-3xl font-black text-slate-900">{course.name}</h1>
                 <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">{course.code}</span>
              </div>
              <p className="text-slate-500 font-medium">Học kỳ: {course.semester} • Tín chỉ: {course.credits} • Phòng: B1-402</p>
           </div>
        </div>
        <div className="flex gap-3">
           <button className="flex-1 lg:flex-none px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all text-sm flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Xuất DS Lớp
           </button>
           <Link 
            to="/grade-entry"
            className="flex-1 lg:flex-none px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
           >
              <FileText className="w-4 h-4" /> Quản lý điểm
           </Link>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <BarChart3 className="w-5 h-5 text-emerald-500" /> Thống kê học lực
              </h3>
              <div className="h-48 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={gradeDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {gradeDistribution.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-2xl font-black text-slate-800">{averageGPA}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GPA Trung bình</p>
                 </div>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-2 mt-4">
              {gradeDistribution.map((item, i) => (
                 <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span className="text-slate-500 font-medium">{item.name}: <strong>{item.value}</strong></span>
                 </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <Users className="w-5 h-5 text-blue-500" /> Danh sách sinh viên
              </h3>
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                  type="text" 
                  placeholder="Tìm sinh viên..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-48" 
                 />
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                       <th className="px-4 py-3">Mã SV</th>
                       <th className="px-4 py-3">Họ và tên</th>
                       <th className="px-4 py-3 text-center">Điểm TK</th>
                       <th className="px-4 py-3 text-center">Xếp loại</th>
                       <th className="px-4 py-3 text-right">Liên hệ</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {studentsInClass.map((student) => {
                       const grade = gradesInClass.find(g => g.studentId === student.id);
                       const details = student.details as any;
                       return (
                          <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-4 py-4 text-xs font-mono font-bold text-slate-500">{details.studentId}</td>
                             <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                   <img src={student.avatar} className="w-8 h-8 rounded-full object-cover" />
                                   <span className="text-sm font-bold text-slate-800">{student.fullName}</span>
                                </div>
                             </td>
                             <td className="px-4 py-4 text-center">
                                <span className={`text-sm font-black ${grade ? 'text-blue-600' : 'text-slate-300'}`}>
                                   {grade ? grade.totalGrade : '-'}
                                </span>
                             </td>
                             <td className="px-4 py-4 text-center">
                                {grade ? (
                                   <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black text-slate-700">{grade.letterGrade}</span>
                                ) : (
                                   <span className="text-[10px] text-slate-300 font-bold uppercase italic">Chưa nhập</span>
                                )}
                             </td>
                             <td className="px-4 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                   <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors bg-white rounded-lg border border-slate-100 shadow-sm"><Mail className="w-3.5 h-3.5" /></button>
                                   <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors bg-white rounded-lg border border-slate-100 shadow-sm"><MoreVertical className="w-3.5 h-3.5" /></button>
                                </div>
                             </td>
                          </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
