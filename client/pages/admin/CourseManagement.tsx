
import React, { useState } from 'react';
import { MOCK_COURSES, FACULTIES, MOCK_USERS } from '../../constants';
import { Course, UserRole } from '../../types';
import { 
  Search, 
  Plus, 
  BookOpen, 
  Filter, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Info,
  Layers,
  Award,
  Users as UsersIcon,
  X,
  Check,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [successToast, setSuccessToast] = useState(false);
  
  // State for Delete Confirmation
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const teachers = MOCK_USERS.filter(u => u.role === UserRole.TEACHER);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: 3,
    teacherId: teachers[0]?.id || '',
    semester: '2023-2024.1'
  });

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        code: course.code,
        name: course.name,
        credits: course.credits,
        teacherId: course.teacherId,
        semester: course.semester
      });
    } else {
      setEditingCourse(null);
      setFormData({
        code: '',
        name: '',
        credits: 3,
        teacherId: teachers[0]?.id || '',
        semester: '2023-2024.1'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c));
    } else {
      const newCourse: Course = {
        id: `c${Date.now()}`,
        ...formData
      };
      setCourses([newCourse, ...courses]);
    }
    setIsModalOpen(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      setCourses(courses.filter(c => c.id !== courseToDelete.id));
      setCourseToDelete(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {successToast && (
        <div className="fixed top-8 right-8 z-[300] bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8">
          <Check className="w-5 h-5" />
          <span className="font-bold">Cơ sở dữ liệu môn học đã được cập nhật!</span>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý môn học</h1>
          <p className="text-slate-500">Danh mục chương trình đào tạo và phân công giảng dạy toàn trường.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" />
          Thêm môn học mới
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng số môn</p>
            <p className="text-3xl font-black text-slate-900">{courses.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Số tín chỉ TB</p>
            <p className="text-3xl font-black text-slate-900">
              {(courses.reduce((acc, c) => acc + c.credits, 0) / (courses.length || 1)).toFixed(1)}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <UsersIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phân công dạy</p>
            <p className="text-3xl font-black text-slate-900">{teachers.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm mã môn hoặc tên môn học..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <Filter className="w-5 h-5 text-slate-400" />
             <select 
              className="bg-slate-50 px-4 py-3 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 cursor-pointer"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
             >
               <option value="ALL">Tất cả các khoa</option>
               {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4 rounded-l-2xl">Mã môn</th>
                <th className="px-6 py-4">Tên môn học</th>
                <th className="px-6 py-4 text-center">Tín chỉ</th>
                <th className="px-6 py-4">Giảng viên phụ trách</th>
                <th className="px-6 py-4 text-center">Học kỳ</th>
                <th className="px-6 py-4 rounded-r-2xl text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCourses.map((course) => {
                const teacher = teachers.find(t => t.id === course.teacherId);
                return (
                  <tr key={course.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                       <span className="font-mono text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                         {course.code}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <p className="font-bold text-slate-800">{course.name}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <span className="font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs">{course.credits} TC</span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <img src={teacher?.avatar} className="w-8 h-8 rounded-full border border-slate-200" />
                          <span className="text-sm font-bold text-slate-600">{teacher?.fullName || 'Chưa phân công'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{course.semester}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(course)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setCourseToDelete(course)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Xóa môn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-8 text-center space-y-6">
             <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10" />
             </div>
             <div className="space-y-2">
               <h3 className="text-2xl font-black text-slate-800">Xác nhận xóa môn?</h3>
               <p className="text-slate-500 leading-relaxed">
                 Bạn đang thực hiện xóa môn học <strong>{courseToDelete.name} ({courseToDelete.code})</strong>. 
                 Hành động này có thể gây mất dữ liệu điểm của sinh viên liên quan.
               </p>
             </div>
             <div className="flex gap-4">
                <button onClick={() => setCourseToDelete(null)} className="flex-1 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all">Hủy bỏ</button>
                <button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100">Xác nhận xóa</button>
             </div>
          </div>
        </div>
      )}

      {/* Course Modal (Create/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-blue-600 text-white rounded-2xl">
                    {editingCourse ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                 </div>
                 <h3 className="text-2xl font-black text-slate-800">{editingCourse ? 'Chỉnh sửa môn học' : 'Môn học mới'}</h3>
               </div>
               <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-7 h-7" />
               </button>
            </div>
            
            <div className="p-10 space-y-6">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mã môn học</label>
                    <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="VD: CS101" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Số tín chỉ</label>
                    <input required type="number" min="1" max="10" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-center" value={formData.credits} onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})} />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tên môn học đầy đủ</label>
                  <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Lập trình hướng đối tượng" />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <UsersIcon className="w-3 h-3" /> Giảng viên phụ trách mặc định
                  </label>
                  <select required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold cursor-pointer" value={formData.teacherId} onChange={e => setFormData({...formData, teacherId: e.target.value})}>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.fullName} ({(t.details as any)?.employeeId})</option>
                    ))}
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Học kỳ áp dụng
                  </label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold cursor-pointer" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})}>
                    <option value="2023-2024.1">Học kỳ 1 (2023 - 2024)</option>
                    <option value="2023-2024.2">Học kỳ 2 (2023 - 2024)</option>
                    <option value="2024-2025.1">Học kỳ 1 (2024 - 2025)</option>
                  </select>
               </div>
            </div>

            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex gap-4">
               <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-sm">Hủy bỏ</button>
               <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">Xác nhận lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
