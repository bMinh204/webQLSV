
import React, { useState, useEffect } from 'react';
import { MOCK_USERS, FACULTIES } from '../../constants';
import { UserRole, User } from '../../types';
import { userAPI } from '../../services/api';
import { 
  Search, 
  Plus, 
  UserPlus, 
  Filter, 
  MoreVertical, 
  Shield, 
  Trash2, 
  Edit, 
  X,
  User as UserIcon,
  // Fix: Import Users as UsersIcon to resolve reference error on line 323
  Users as UsersIcon,
  Mail,
  Briefcase,
  Smartphone,
  Check
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [newUser, setNewUser] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '123456',
    role: UserRole.STUDENT,
    faculty: FACULTIES[0],
    class: '',
    phone: ''
  });

  // Load users from database
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAll();
      // Map MongoDB data to frontend format
      const mappedUsers = data.map((u: any) => ({
        ...u,
        id: u._id || u.id,
        avatar: u.avatar || `https://picsum.photos/seed/${u.username}/200`,
        role: u.role?.toUpperCase() || 'STUDENT'
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
      // Fallback to mock data if API fails
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userToAdd = {
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email || `${newUser.username.toLowerCase()}@university.edu.vn`,
        password: '123456',
        role: newUser.role.toLowerCase(), // Convert to lowercase for MongoDB
      };

      const savedUser = await userAPI.create(userToAdd);
      await loadUsers(); // Reload users from database
      setIsModalOpen(false);
      setNewUser({
        fullName: '',
        username: '',
        email: '',
        password: '123456',
        role: UserRole.STUDENT,
        faculty: FACULTIES[0],
        class: '',
        phone: ''
      });
      alert('Thêm người dùng thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error);
      alert('Lỗi khi thêm người dùng. Vui lòng thử lại!');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await userAPI.delete(id);
        await loadUsers(); // Reload users from database
        alert('Xóa người dùng thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        alert('Lỗi khi xóa người dùng. Vui lòng thử lại!');
      }
    }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý người dùng</h1>
          <p className="text-slate-500">Quản lý tài khoản sinh viên, giảng viên và nhân viên toàn hệ thống.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <UserPlus className="w-5 h-5" />
          Thêm người dùng mới
        </button>
      </div>

      {/* Quick Filters & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng số', count: users.length, color: 'bg-slate-900' },
          { label: 'Sinh viên', count: users.filter(u => u.role === UserRole.STUDENT).length, color: 'bg-blue-600' },
          { label: 'Giảng viên', count: users.filter(u => u.role === UserRole.TEACHER).length, color: 'bg-purple-600' },
          { label: 'Quản trị', count: users.filter(u => u.role === UserRole.ADMIN).length, color: 'bg-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
            <span className={`px-3 py-1 ${stat.color} text-white text-sm font-black rounded-lg`}>{stat.count}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc mã số định danh..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <Filter className="w-5 h-5 text-slate-400" />
             <select 
              className="bg-slate-50 px-4 py-3 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
             >
               <option value="ALL">Tất cả vai trò</option>
               <option value={UserRole.STUDENT}>Sinh viên</option>
               <option value={UserRole.TEACHER}>Giảng viên</option>
               <option value={UserRole.ADMIN}>Quản trị viên</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4 rounded-l-xl">Người dùng</th>
                <th className="px-6 py-4">Mã số / ID</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Email liên hệ</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 rounded-r-xl text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} className="w-10 h-10 rounded-full border border-slate-100 shadow-sm object-cover" alt="" />
                      <div>
                        <p className="font-bold text-slate-800">{u.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          {u.role === UserRole.STUDENT ? (u.details as any)?.class : (u.details as any)?.faculty || 'Hệ thống'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                      {u.username}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       {u.role === UserRole.ADMIN && <Shield className="w-3 h-3 text-amber-500" />}
                       <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                         u.role === UserRole.STUDENT ? 'bg-blue-100 text-blue-700' : 
                         u.role === UserRole.TEACHER ? 'bg-purple-100 text-purple-700' : 
                         'bg-amber-100 text-amber-700'
                       }`}>
                         {u.role}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">{u.email}</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
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

      {/* Modal Thêm người dùng mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div>
                 <h3 className="text-2xl font-black text-slate-800">Tạo tài khoản mới</h3>
                 <p className="text-slate-500 text-sm font-medium">Hệ thống sẽ tự động tạo mật khẩu mặc định "123456"</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 hover:shadow-md transition-all">
                  <X className="w-6 h-6" />
               </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <UserIcon className="w-3 h-3" /> Họ và tên người dùng
                    </label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                      placeholder="VD: Nguyễn Văn A"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Shield className="w-3 h-3" /> Mã số định danh (Username)
                    </label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold transition-all"
                      placeholder="VD: SV003, GV002..."
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Briefcase className="w-3 h-3" /> Vai trò hệ thống
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setNewUser({...newUser, role})}
                          className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                            newUser.role === role 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'
                          }`}
                        >
                          {role === UserRole.STUDENT ? 'Sinh viên' : role === UserRole.TEACHER ? 'Giảng viên' : 'Admin'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - Dynamic Fields */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Email (Để trống để tự tạo)
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                      placeholder="example@university.edu.vn"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    />
                  </div>

                  {newUser.role !== UserRole.ADMIN && (
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Filter className="w-3 h-3" /> Khoa / Đơn vị
                      </label>
                      <select 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                        value={newUser.faculty}
                        onChange={(e) => setNewUser({...newUser, faculty: e.target.value})}
                      >
                        {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  )}

                  {newUser.role === UserRole.STUDENT && (
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <UsersIcon className="w-3 h-3" /> Lớp sinh hoạt
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                        placeholder="VD: K66-CNTT-A"
                        value={newUser.class}
                        onChange={(e) => setNewUser({...newUser, class: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Smartphone className="w-3 h-3" /> Số điện thoại
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                      placeholder="09xx xxx xxx"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-xs rounded-[1.5rem] hover:bg-slate-200 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Xác nhận tạo người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
