import React, { useState } from 'react';
import { userAPI, courseAPI, gradeAPI } from '../services/api';
import { UserRole } from '../types';

const TestDataEntry: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [userForm, setUserForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '123456',
    role: UserRole.STUDENT
  });

  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    description: '',
    credits: 3
  });

  const [gradeForm, setGradeForm] = useState({
    student: '',
    course: '',
    score: 0,
    semester: 'HK1 2024-2025'
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        ...userForm,
        role: userForm.role.toLowerCase() // Convert to lowercase for MongoDB
      };
      const result = await userAPI.create(userData);
      setMessage(`✅ Thêm người dùng thành công! ID: ${result._id}`);
      setUserForm({
        fullName: '',
        username: '',
        email: '',
        password: '123456',
        role: UserRole.STUDENT
      });
    } catch (error: any) {
      setMessage(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await courseAPI.create(courseForm);
      setMessage(`✅ Thêm môn học thành công! ID: ${result._id}`);
      setCourseForm({
        name: '',
        code: '',
        description: '',
        credits: 3
      });
    } catch (error: any) {
      setMessage(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await gradeAPI.create(gradeForm);
      setMessage(`✅ Thêm điểm thành công! ID: ${result._id}`);
      setGradeForm({
        student: '',
        course: '',
        score: 0,
        semester: 'HK1 2024-2025'
      });
    } catch (error: any) {
      setMessage(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Test Nhập Dữ Liệu</h1>
          <p className="text-slate-600">Trang này để test việc lưu dữ liệu vào database MongoDB</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl font-bold ${
            message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form Thêm Người Dùng */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4">📝 Thêm Người Dùng</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Họ tên</label>
                <input
                  type="text"
                  required
                  value={userForm.fullName}
                  onChange={(e) => setUserForm({...userForm, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={userForm.username}
                  onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SV001"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Vai trò</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value as UserRole})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={UserRole.STUDENT}>Sinh viên</option>
                  <option value={UserRole.TEACHER}>Giảng viên</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-all"
              >
                {loading ? 'Đang xử lý...' : 'Thêm Người Dùng'}
              </button>
            </form>
          </div>

          {/* Form Thêm Môn Học */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4">📚 Thêm Môn Học</h2>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tên môn học</label>
                <input
                  type="text"
                  required
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Lập trình Web"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mã môn</label>
                <input
                  type="text"
                  required
                  value={courseForm.code}
                  onChange={(e) => setCourseForm({...courseForm, code: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="WEB101"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Mô tả môn học..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Số tín chỉ</label>
                <input
                  type="number"
                  required
                  value={courseForm.credits}
                  onChange={(e) => setCourseForm({...courseForm, credits: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="10"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-slate-400 transition-all"
              >
                {loading ? 'Đang xử lý...' : 'Thêm Môn Học'}
              </button>
            </form>
          </div>

          {/* Form Thêm Điểm */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4">📊 Thêm Điểm</h2>
            <form onSubmit={handleAddGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Student ID</label>
                <input
                  type="text"
                  required
                  value={gradeForm.student}
                  onChange={(e) => setGradeForm({...gradeForm, student: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste Student _id từ MongoDB"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Course ID</label>
                <input
                  type="text"
                  required
                  value={gradeForm.course}
                  onChange={(e) => setGradeForm({...gradeForm, course: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste Course _id từ MongoDB"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Điểm số (0-10)</label>
                <input
                  type="number"
                  required
                  step="0.1"
                  value={gradeForm.score}
                  onChange={(e) => setGradeForm({...gradeForm, score: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Học kỳ</label>
                <input
                  type="text"
                  required
                  value={gradeForm.semester}
                  onChange={(e) => setGradeForm({...gradeForm, semester: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="HK1 2024-2025"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-slate-400 transition-all"
              >
                {loading ? 'Đang xử lý...' : 'Thêm Điểm'}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
          <p className="text-sm text-slate-700">
            <strong>Hướng dẫn:</strong> Điền thông tin vào các form trên và nhấn nút tương ứng. 
            Dữ liệu sẽ được lưu vào MongoDB. Kiểm tra console và MongoDB Compass để xem kết quả.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestDataEntry;
