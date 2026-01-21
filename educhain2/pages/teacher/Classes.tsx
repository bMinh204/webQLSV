
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_COURSES, MOCK_ENROLLMENTS, MOCK_GRADES } from '../../constants';
import { BookOpen, Users, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

const TeacherClasses: React.FC = () => {
  const { user } = useAuth();
  
  // Lọc các khóa học do giảng viên này giảng dạy
  const teacherCourses = MOCK_COURSES.filter(c => c.teacherId === user?.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý lớp dạy</h1>
          <p className="text-slate-500 mt-1">Học kỳ hiện tại: 2023.2 • Tổng số {teacherCourses.length} lớp học</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-slate-700">Tuần học thứ 12</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teacherCourses.map((course) => {
          // Tính toán số lượng sinh viên và tiến độ nhập điểm cho từng lớp
          const studentCount = MOCK_ENROLLMENTS.filter(e => e.courseId === course.id).length;
          const gradedCount = MOCK_GRADES.filter(g => g.courseId === course.id).length;
          const progress = studentCount > 0 ? Math.round((gradedCount / studentCount) * 100) : 0;

          return (
            <div key={course.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-3 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    {course.code}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{course.semester}</span>
                </div>
                
                <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition-colors leading-tight min-h-[3.5rem] line-clamp-2">
                  {course.name}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Users className="w-4 h-4" />
                      Sĩ số:
                    </div>
                    <span className="font-bold text-slate-800">{studentCount} sinh viên</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                      <span className="text-slate-400">Tiến độ nhập điểm</span>
                      <span className={progress === 100 ? 'text-emerald-500' : 'text-blue-500'}>{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3">
                  <Link 
                    to={`/classes/${course.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all"
                  >
                    Chi tiết lớp
                  </Link>
                  <Link 
                    to="/grade-entry"
                    className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    title="Nhập điểm nhanh"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {teacherCourses.length === 0 && (
          <div className="col-span-full py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-6">
            <div className="p-6 bg-slate-50 rounded-full mb-6">
               <BookOpen className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có lớp học nào</h3>
            <p className="text-slate-500 max-w-sm">Danh sách lớp dạy của bạn đang trống. Vui lòng liên hệ phòng đào tạo nếu có sai sót.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherClasses;
