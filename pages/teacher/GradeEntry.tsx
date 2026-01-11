
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_COURSES, MOCK_USERS, MOCK_ENROLLMENTS, MOCK_GRADES } from '../../constants';
import { Course, User, Grade } from '../../types';
import { 
  Users, 
  ChevronLeft, 
  Search, 
  Save, 
  FileSpreadsheet, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react';

const GradeEntry: React.FC = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  // Lấy các khóa học của giảng viên này
  const teacherCourses = MOCK_COURSES.filter(c => c.teacherId === user?.id);

  // Khi đã chọn khóa học, lấy danh sách sinh viên
  const enrolledStudentIds = MOCK_ENROLLMENTS
    .filter(e => e.courseId === selectedCourse?.id)
    .map(e => e.studentId);
  
  const students = MOCK_USERS.filter(u => enrolledStudentIds.includes(u.id));

  // State quản lý điểm tạm thời (mock)
  const [tempGrades, setTempGrades] = useState<Record<string, Partial<Grade>>>(() => {
    const initial: Record<string, Partial<Grade>> = {};
    MOCK_GRADES.forEach(g => {
      initial[`${g.studentId}_${g.courseId}`] = g;
    });
    return initial;
  });

  const handleGradeChange = (studentId: string, field: keyof Grade, value: string) => {
    const numValue = parseFloat(value) || 0;
    const limitedValue = Math.min(10, Math.max(0, numValue));
    
    setTempGrades(prev => {
      const key = `${studentId}_${selectedCourse?.id}`;
      const current = prev[key] || { studentId, courseId: selectedCourse?.id };
      
      const updated = { ...current, [field]: limitedValue };
      
      // Tự động tính điểm tổng kết (Công thức demo: QT 20% + GK 20% + CK 60%)
      const qt = updated.processGrade || 0;
      const gk = updated.midtermGrade || 0;
      const ck = updated.finalGrade || 0;
      const total = parseFloat((qt * 0.2 + gk * 0.2 + ck * 0.6).toFixed(1));
      
      let letter = 'F';
      if (total >= 8.5) letter = 'A';
      else if (total >= 8.0) letter = 'B+';
      else if (total >= 7.0) letter = 'B';
      else if (total >= 6.5) letter = 'C+';
      else if (total >= 5.5) letter = 'C';
      else if (total >= 5.0) letter = 'D+';
      else if (total >= 4.0) letter = 'D';

      return {
        ...prev,
        [key]: {
          ...updated,
          totalGrade: total,
          letterGrade: letter,
          status: total >= 4.0 ? 'Pass' : 'Fail'
        }
      };
    });
  };

  const handleSave = () => {
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  if (!selectedCourse) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Nhập điểm sinh viên</h1>
          <p className="text-slate-500 mt-1">Chọn một lớp học để bắt đầu quá trình nhập điểm.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherCourses.map((course) => (
            <button 
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all text-left group flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {course.semester}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{course.name}</h3>
              <p className="text-slate-500 text-sm font-medium mb-auto">{course.code} • {course.credits} Tín chỉ</p>
              
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
                     ))}
                   </div>
                   <span className="text-xs font-bold text-slate-400">45 SV</span>
                </div>
                <div className="text-blue-600 font-bold text-sm flex items-center gap-1">
                   Bắt đầu nhập
                   <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <nav className="flex items-center gap-2 text-sm">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </button>
        <span className="text-slate-300">/</span>
        <span className="font-bold text-slate-800">Nhập điểm: {selectedCourse.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
              <FileSpreadsheet className="w-8 h-8" />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-900">{selectedCourse.name}</h1>
              <p className="text-slate-500 font-medium">Lớp: {selectedCourse.code} • HK: {selectedCourse.semester}</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm flex items-center gap-2">
              Xuất File mẫu
           </button>
           <button 
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm flex items-center gap-2 shadow-lg shadow-blue-100"
           >
              <Save className="w-4 h-4" />
              Lưu bảng điểm
           </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-2">
           <CheckCircle2 className="w-5 h-5" />
           <p className="font-bold">Dữ liệu đã được lưu tạm thời thành công!</p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm tên hoặc mã sinh viên..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl text-amber-700 border border-amber-100">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold">Chưa chốt điểm</span>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-4">Sinh viên</th>
                <th className="px-6 py-4 text-center">Quá trình (20%)</th>
                <th className="px-6 py-4 text-center">Giữa kỳ (20%)</th>
                <th className="px-6 py-4 text-center">Cuối kỳ (60%)</th>
                <th className="px-6 py-4 text-center">Tổng kết</th>
                <th className="px-6 py-4 text-center">Điểm chữ</th>
                <th className="px-8 py-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students
                .filter(s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || (s.details as any).studentId.includes(searchTerm))
                .map((student) => {
                  const key = `${student.id}_${selectedCourse.id}`;
                  const grade = tempGrades[key] || {};
                  
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <img src={student.avatar} className="w-10 h-10 rounded-full bg-slate-100 object-cover" />
                           <div>
                              <p className="font-bold text-slate-800">{student.fullName}</p>
                              <p className="text-xs font-semibold text-slate-400">{(student.details as any).studentId}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <input 
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          className="w-16 h-10 text-center bg-slate-50 border border-slate-100 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                          value={grade.processGrade || ''}
                          onChange={(e) => handleGradeChange(student.id, 'processGrade', e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-6 text-center">
                        <input 
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          className="w-16 h-10 text-center bg-slate-50 border border-slate-100 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                          value={grade.midtermGrade || ''}
                          onChange={(e) => handleGradeChange(student.id, 'midtermGrade', e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-6 text-center">
                        <input 
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          className="w-16 h-10 text-center bg-slate-50 border border-slate-100 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all underline decoration-blue-200 underline-offset-4"
                          value={grade.finalGrade || ''}
                          onChange={(e) => handleGradeChange(student.id, 'finalGrade', e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-lg font-black text-blue-600">{grade.totalGrade || '-'}</span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="px-2 py-1 bg-slate-100 rounded font-black text-slate-700">{grade.letterGrade || '-'}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {grade.status ? (
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            grade.status === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {grade.status === 'Pass' ? 'Đạt' : 'Trượt'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 uppercase italic">Chưa có điểm</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-start gap-4">
           <Info className="w-5 h-5 text-blue-500 mt-1" />
           <div className="text-sm text-slate-500 leading-relaxed">
              <p className="font-bold text-slate-700 mb-1">Quy định nhập điểm:</p>
              <ul className="list-disc list-inside space-y-1">
                 <li>Điểm thành phần được tính theo trọng số: Quá trình 20%, Giữa kỳ 20%, Cuối kỳ 60%.</li>
                 <li>Hệ thống tự động tính điểm tổng kết và xếp loại dựa trên thang điểm 4/10.</li>
                 <li>Sau khi "Lưu bảng điểm", giảng viên vẫn có thể chỉnh sửa cho đến khi "Chốt điểm học phần".</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GradeEntry;
