import React, { useState, useEffect } from 'react';
import { MOCK_USERS, FACULTIES } from '../../constants';
import { UserRole, User } from '../../types';
import { 
  Search, 
  UserPlus, 
  Filter, 
  Shield, 
  Trash2, 
  Edit, 
  X,
  Lock,
  Unlock,
  History,
  Check,
  MoreVertical,
  Mail,
  Smartphone,
  Eye,
  AlertTriangle,
  GraduationCap,
  Calendar,
  MapPin
} from 'lucide-react';
import axios from 'axios'; // Import axios for API calls

interface ExtendedUser extends User {
  status: 'Active' | 'Locked';
  studentId: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>(MOCK_USERS.map(u => ({ ...u, status: 'Active' })));
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(false); // New loading state
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [showLog, setShowLog] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    role: UserRole.STUDENT,
    faculty: FACULTIES[0],
  });

  useEffect(() => {
    // Fetch students on component mount
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students');
        const fetchedStudents = response.data.map((student: any) => ({
          id: student._id,
          username: student.studentId, // Map studentId to username for display
          fullName: student.fullName,
          email: student.email,
          role: 'student',
          avatar: `https://picsum.photos/seed/${student._id}/200`,
          status: 'Active',
        }));
        setUsers(fetchedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []); // Empty dependency array ensures this runs only once

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        studentId: user.username, // Map username back to studentId
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        faculty: (user.details as any)?.faculty || FACULTIES[0],
      });
    } else {
      setEditingUser(null);
      setFormData({
        studentId: '',
        fullName: '',
        email: '',
        role: UserRole.STUDENT,
        faculty: FACULTIES[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      if (editingUser) {
        // Update existing user
        const updatedUser = {
          studentId: formData.studentId,
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          faculty: formData.faculty,
        };
        const response = await axios.put(`http://localhost:5000/api/students/${editingUser.id}`, updatedUser);

        if (response.status === 200) {
          setUsers(users.map(u => (u.id === editingUser.id ? { ...u, ...updatedUser } : u)));
          showSuccess();
        }
      } else {
        // Add new user
        const newStudent = {
          studentId: formData.studentId,
          fullName: formData.fullName,
          email: formData.email,
        };
        const response = await axios.post('http://localhost:5000/api/students', newStudent);

        if (response.status === 201) {
          const savedStudent = response.data;
          setUsers([
            {
              id: savedStudent._id,
              username: savedStudent.studentId,
              fullName: savedStudent.fullName,
              email: savedStudent.email,
              role: 'student',
              avatar: `https://picsum.photos/seed/${savedStudent._id}/200`,
              status: 'Active',
            },
            ...users,
          ]);
          showSuccess();
        }
      }
      setFormData({
        studentId: '',
        fullName: '',
        email: '',
        role: UserRole.STUDENT,
        faculty: FACULTIES[0],
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting user:', error);
      alert(error.response?.data?.message || 'Failed to process the request. Please check the input data.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      showSuccess();
    }
  };

  const showSuccess = () => {
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: (u as any).status === 'Active' ? 'Locked' : 'Active' } as any;
      }
      return u;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {successToast && (
        <div className="fixed top-8 right-8 z-[300] bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8">
          <Check className="w-5 h-5" />
          <span className="font-bold">Cập nhật hệ thống thành công!</span>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý người dùng</h1>
          <p className="text-slate-500">Thiết lập tài khoản, phân quyền (RBAC) và quản lý trạng thái truy cập.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowLog(true)} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all">
            <History className="w-5 h-5" /> Nhật ký
          </button>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
            <UserPlus className="w-5 h-5" /> Thêm người dùng
          </button>
        </div>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc MSSV/ID..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            className="bg-slate-50 px-6 py-3 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition-colors" 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value as any)}
          >
             <option value="ALL">Tất cả vai trò</option>
             <option value={UserRole.STUDENT}>Sinh viên</option>
             <option value={UserRole.TEACHER}>Giảng viên</option>
             <option value={UserRole.ADMIN}>Quản trị</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4 rounded-l-2xl">Thành viên</th>
                <th className="px-6 py-4 text-center">Vai trò</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right rounded-r-2xl">Thao tác nghiệp vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.filter(u => (roleFilter === 'ALL' || u.role === roleFilter) && u.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 group transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} className="w-10 h-10 rounded-full border border-slate-100 object-cover" alt="" />
                      <div>
                        <p className={`font-bold ${(u as any).status === 'Locked' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{u.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${u.role === UserRole.ADMIN ? 'bg-amber-100 text-amber-700' : u.role === UserRole.TEACHER ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${(u as any).status === 'Active' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                      {(u as any).status === 'Active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => setViewingUser(u)} title="Xem chi tiết" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Eye className="w-4 h-4" />
                       </button>
                       <button onClick={() => toggleStatus(u.id)} title={(u as any).status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa'} className={`p-2 rounded-xl transition-all ${(u as any).status === 'Active' ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}>
                          {(u as any).status === 'Active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                       </button>
                       <button onClick={() => handleOpenModal(u)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={() => setUserToDelete(u)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 text-center space-y-6 animate-in zoom-in-95">
             <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10" />
             </div>
             <div className="space-y-2">
               <h3 className="text-2xl font-black text-slate-800">Xóa người dùng?</h3>
               <p className="text-slate-500">
                 Bạn có chắc chắn muốn xóa <strong>{userToDelete.fullName}</strong>? Hành động này không thể hoàn tác và sẽ xóa mọi dữ liệu liên quan.
               </p>
             </div>
             <div className="flex gap-4">
                <button onClick={() => setUserToDelete(null)} className="flex-1 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all">Hủy bỏ</button>
                <button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100">Xóa vĩnh viễn</button>
             </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-[320] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700">
               <button onClick={() => setViewingUser(null)} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <div className="px-8 pb-8 -mt-12">
               <div className="flex items-end gap-6 mb-8">
                  <img src={viewingUser.avatar} className="w-32 h-32 rounded-[2rem] border-4 border-white shadow-xl object-cover bg-white" alt="" />
                  <div className="pb-2">
                     <h3 className="text-2xl font-black text-slate-900">{viewingUser.fullName}</h3>
                     <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">{viewingUser.role} • {viewingUser.username}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-50 rounded-lg"><Mail className="w-4 h-4" /></div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase">Email</p>
                           <p className="text-sm font-bold">{viewingUser.email}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-50 rounded-lg"><Smartphone className="w-4 h-4" /></div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase">Số điện thoại</p>
                           <p className="text-sm font-bold">{(viewingUser.details as any)?.phone || 'Chưa cập nhật'}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-50 rounded-lg"><GraduationCap className="w-4 h-4" /></div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase">Khoa/Đơn vị</p>
                           <p className="text-sm font-bold">{(viewingUser.details as any)?.faculty || 'Phòng quản trị'}</p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-50 rounded-lg"><Calendar className="w-4 h-4" /></div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase">Ngày sinh</p>
                           <p className="text-sm font-bold">{(viewingUser.details as any)?.dob || '15/05/1990'}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-50 rounded-lg"><MapPin className="w-4 h-4" /></div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase">Địa chỉ</p>
                           <p className="text-sm font-bold">Hà Nội, Việt Nam</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-50 rounded-lg"><Shield className="w-4 h-4" /></div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase">Trạng thái hệ thống</p>
                           <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${(viewingUser as any).status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                              {(viewingUser as any).status === 'Active' ? 'Đang hoạt động' : 'Đã khóa'}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="mt-8 pt-8 border-t border-slate-100 flex gap-3">
                  <button onClick={() => { setViewingUser(null); handleOpenModal(viewingUser); }} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                     <Edit className="w-4 h-4" /> Chỉnh sửa hồ sơ
                  </button>
                  <button onClick={() => setViewingUser(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Đóng</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[310] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  {editingUser ? <Edit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{editingUser ? 'Cập nhật thông tin' : 'Thêm sinh viên mới'}</h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mã sinh viên</label>
                <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700" value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })} placeholder="SV001" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="Nguyễn Văn A" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input required type="email" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="example@university.edu.vn" />
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 flex gap-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all">Hủy</button>
              <button
                type="submit"
                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? <span className="loader"></span> : 'Lưu thông tin'} {/* Show loader */}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Audit Log Modal */}
      {showLog && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2"><History className="text-blue-600" /> Nhật ký hệ thống</h3>
              <button onClick={() => setShowLog(false)}><X className="text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">Admin đã cập nhật SV00{i}</span>
                    <span className="text-slate-400">14:2{i} - 24/05</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed italic">Thao tác: Sửa đổi thông tin khoa/phòng ban</p>
                  <p className="text-blue-600 font-bold">Trình duyệt: Chrome/Win10</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowLog(false)} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors">Đóng nhật ký</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
