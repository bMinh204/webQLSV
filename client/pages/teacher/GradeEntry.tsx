
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_COURSES, MOCK_USERS, MOCK_ENROLLMENTS, MOCK_GRADES } from '../../constants';
import { Course, User, Grade } from '../../types';
import { 
  ChevronLeft, 
  Save, 
  FileSpreadsheet, 
  Settings,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';

const GradeEntry: React.FC = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [weights, setWeights] = useState({ process: 0.1, midterm: 0.4, final: 0.5 });
  const [successMessage, setSuccessMessage] = useState(false);

  const teacherCourses = MOCK_COURSES.filter(c => c.teacherId === user?.id);
  const enrolledStudentIds = MOCK_ENROLLMENTS.filter(e => e.courseId === selectedCourse?.id).map(e => e.studentId);
  const students = MOCK_USERS.filter(u => enrolledStudentIds.includes(u.id));

  const [tempGrades, setTempGrades] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    MOCK_GRADES.forEach(g => {
      initial[`${g.studentId}_${g.courseId}`] = g;
    });
    return initial;
  });

  const calculateGrade = (qt: number, gk: number, ck: number) => {
    const total = parseFloat((qt * weights.process + gk * weights.midterm + ck * weights.final).toFixed(1));
    let letter = 'F';
    let gpa4 = 0;
    
    if (total >= 8.5) { letter = 'A'; gpa4 = 4.0; }
    else if (total >= 8.0) { letter = 'B+'; gpa4 = 3.5; }
    else if (total >= 7.0) { letter = 'B'; gpa4 = 3.0; }
    else if (total >= 6.5) { letter = 'C+'; gpa4 = 2.5; }
    else if (total >= 5.5) { letter = 'C'; gpa4 = 2.0; }
    else if (total >= 5.0) { letter = 'D+'; gpa4 = 1.5; }
    else if (total >= 4.0) { letter = 'D'; gpa4 = 1.0; }
    
    return { total, letter, gpa4, status: total >= 4.0 ? 'Pass' : 'Fail' };
  };

  const handleGradeChange = (studentId: string, field: string, value: string) => {
    const num = Math.min(10, Math.max(0, parseFloat(value) || 0));
    setTempGrades(prev => {
      const key = `${studentId}_${selectedCourse?.id}`;
      const current = prev[key] || { processGrade: 0, midtermGrade: 0, finalGrade: 0 };
      const updated = { ...current, [field]: num };
      const { total, letter, gpa4, status } = calculateGrade(
        updated.processGrade || 0,
        updated.midtermGrade || 0,
        updated.finalGrade || 0
      );
      return { ...prev, [key]: { ...updated, totalGrade: total, letterGrade: letter, gpa4, status } };
    });
  };

  if (!selectedCourse) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý nhập điểm</h1>
          <p className="text-slate-500">Chọn lớp học phần để thiết lập tỷ trọng và nhập điểm.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherCourses.map(c => (
            <button key={c.id} onClick={() => setSelectedCourse(c)} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left group">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{c.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{c.code}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-bold">
        <ChevronLeft className="w-4 h-4" /> Quay lại
      </button>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800">{selectedCourse.name}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><Settings className="w-3.5 h-3.5" /> Tỷ trọng điểm:</span>
              <div className="flex gap-2">
                {['CC 10%', 'GK 40%', 'CK 50%'].map(t => <span key={t} className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] font-black">{t}</span>)}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={() => { setSuccessMessage(true); setTimeout(() => setSuccessMessage(false), 3000); }} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                <Save className="w-4 h-4" /> Lưu bảng điểm
             </button>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" /> <span className="font-bold">Hệ thống đã cập nhật bảng điểm mới nhất.</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-2">Sinh viên</th>
                <th className="px-4 py-2 text-center">QT</th>
                <th className="px-4 py-2 text-center">GK</th>
                <th className="px-4 py-2 text-center">CK</th>
                <th className="px-4 py-2 text-center">Tổng</th>
                <th className="px-4 py-2 text-center">Điểm Chữ</th>
                <th className="px-6 py-2 text-center">Kết quả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-transparent">
              {students.map(s => {
                const grade = tempGrades[`${s.id}_${selectedCourse.id}`] || {};
                const isFail = grade.status === 'Fail';
                
                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-4 bg-white first:rounded-l-2xl border-y border-l border-slate-50 group-hover:border-slate-200">
                      <p className="font-bold text-slate-800 text-sm">{s.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">{(s.details as any).studentId}</p>
                    </td>
                    <td className="px-4 py-4 text-center bg-white border-y border-slate-50 group-hover:border-slate-200">
                      <input type="number" step="0.1" className="w-12 h-9 text-center bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        value={grade.processGrade || 0} onChange={e => handleGradeChange(s.id, 'processGrade', e.target.value)} />
                    </td>
                    <td className="px-4 py-4 text-center bg-white border-y border-slate-50 group-hover:border-slate-200">
                      <input type="number" step="0.1" className="w-12 h-9 text-center bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        value={grade.midtermGrade || 0} onChange={e => handleGradeChange(s.id, 'midtermGrade', e.target.value)} />
                    </td>
                    <td className="px-4 py-4 text-center bg-white border-y border-slate-50 group-hover:border-slate-200">
                      <input type="number" step="0.1" className="w-12 h-9 text-center bg-blue-50/50 border border-blue-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        value={grade.finalGrade || 0} onChange={e => handleGradeChange(s.id, 'finalGrade', e.target.value)} />
                    </td>
                    <td className="px-4 py-4 text-center bg-white border-y border-slate-50 group-hover:border-slate-200">
                      <span className={`text-sm font-black ${isFail ? 'text-red-500' : 'text-blue-600'}`}>{grade.totalGrade || '0.0'}</span>
                    </td>
                    <td className="px-4 py-4 text-center bg-white border-y border-slate-50 group-hover:border-slate-200">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-black ${isFail ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
                        {grade.letterGrade || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center bg-white last:rounded-r-2xl border-y border-r border-slate-50 group-hover:border-slate-200">
                      {grade.status ? (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                          isFail 
                          ? 'bg-red-50/80 border-red-100 text-red-600 shadow-sm shadow-red-50' 
                          : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isFail ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {isFail ? 'Chưa đạt' : 'Đạt'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold uppercase">Trống</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-5 bg-slate-50/80 rounded-[2rem] border border-slate-100 flex items-start gap-4">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Info className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            <p className="font-bold text-slate-700 mb-1">Quy định xét kết quả:</p>
            <p>
              Hệ thống tự động đánh giá <span className="text-red-600 font-black px-1.5 py-0.5 bg-red-50 rounded mx-1">CHƯA ĐẠT</span> đối với học phần có điểm tổng kết dưới 4.0. Giảng viên vui lòng kiểm tra kỹ các cột điểm thành phần trước khi lưu chính thức.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeEntry;
