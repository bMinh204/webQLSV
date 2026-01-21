
import React, { useState, useEffect } from 'react';
import { MOCK_COURSES, FACULTIES, MOCK_USERS } from '../../constants';
import { Course, UserRole } from '../../types';
import { courseAPI, userAPI } from '../../services/api';
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
  X
} from 'lucide-react';

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [courseForm, setCourseForm] = useState({
    code: '',
    name: '',
    credits: 3,
    teacher: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, usersData] = await Promise.all([
        courseAPI.getAll(),
        userAPI.getAll()
      ]);
      setCourses(coursesData);
      setTeachers(usersData.filter((u: any) => u.role === 'teacher'));
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      setCourses(MOCK_COURSES);
      setTeachers(MOCK_USERS.filter(u => u.role === UserRole.TEACHER));
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSaveCourse = async () => {
    try {
      if (editingCourse) {
        await courseAPI.update(editingCourse.id, courseForm);
      } else {
        await courseAPI.create(courseForm);
      }
      await loadData();
      setIsModalOpen(false);
      setCourseForm({ code: '', name: '', credits: 3, teacher: '', description: '' });
      alert('Lưu môn học thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu môn học:', error);
      alert('Lỗi khi lưu môn học. Vui lòng thử lại!');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này không?')) {
      try {
        await courseAPI.delete(id);
        await loadData();
        alert('Xóa môn học thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa môn học:', error);
        alert('Lỗi khi xóa môn học. Vui lòng thử lại!');
      }
    }
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      code: course.code,
      name: course.name,
      credits: course.credits,
      teacher: course.teacherId || '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setCourseForm({ code: '', name: '', credits: 3, teacher: '', description: '' });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý môn học</h1>
          <p className="text-slate-500">Danh mục chương trình đào tạo và phân công giảng dạy.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" />
          Thêm môn học mới
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng số môn</p>
            <p className="text-2xl font-black text-slate-900">{courses.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Số tín chỉ TB</p>
            <p className="text-2xl font-black text-slate-900">
              {(courses.reduce((acc, c) => acc + c.credits, 0) / courses.length).toFixed(1)}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Giảng viên phụ trách</p>
            <p className="text-2xl font-black text-slate-900">{teachers.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm mã môn hoặc tên môn học..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <Filter className="w-5 h-5 text-slate-400" />
             <select 
              className="bg-slate-50 px-4 py-3 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
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
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4 rounded-l-xl">Mã môn</th>
                <th className="px-6 py-4">Tên môn học</th>
                <th className="px-6 py-4 text-center">Tín chỉ</th>
                <th className="px-6 py-4">Giảng viên mặc định</th>
                <th className="px-6 py-4">Học kỳ</th>
                <th className="px-6 py-4 rounded-r-xl text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((course) => {
                const teacher = teachers.find(t => t.id === course.teacherId);
                return (
                  <tr key={course.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                       <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                         {course.code}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <p className="font-bold text-slate-800">{course.name}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <span className="font-black text-slate-600">{course.credits}</span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <img src={teacher?.avatar} className="w-6 h-6 rounded-full" />
                          <span className="text-sm font-medium text-slate-600">{teacher?.fullName || 'Chưa phân công'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-xs font-bold text-slate-400">{course.semester}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => openEditModal(course)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-all">
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

        <div className="mt-8 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-400 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed italic">
            <strong>Ghi chú:</strong> Việc xóa môn học có thể ảnh hưởng đến kết quả học tập của các sinh viên đang đăng ký môn học này. 
            Hệ thống sẽ lưu vết các thay đổi trong nhật ký hệ thống.
          </p>
        </div>
      </div>

      {/* Modal Thêm/Sửa môn học (UI Mockup) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <h3 className="text-xl font-bold text-slate-800">{editingCourse ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
               </button>
            </div>
            <div className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mã môn học</label>
                    <input 
                      type="text" 
                      value={courseForm.code} 
                      onChange={(e) => setCourseForm({...courseForm, code: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                      placeholder="VD: CS101" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Số tín chỉ</label>
                    <input 
                      type="number" 
                      value={courseForm.credits} 
                      onChange={(e) => setCourseForm({...courseForm, credits: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tên môn học</label>
                  <input 
                    type="text" 
                    value={courseForm.name} 
                    onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                    placeholder="Nhập tên đầy đủ" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Giảng viên phụ trách</label>
                  <select 
                    value={courseForm.teacher}
                    onChange={(e) => setCourseForm({...courseForm, teacher: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  >
                    <option value="">Chọn giảng viên</option>
                    {teachers.map(t => <option key={t._id || t.id} value={t._id || t.id}>{t.fullName}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mô tả</label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    rows={3}
                    placeholder="Mô tả môn học..."
                  />
               </div>
               <div className="pt-6 border-t border-slate-50 flex gap-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Hủy</button>
                  <button onClick={handleSaveCourse} className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Lưu thông tin</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
