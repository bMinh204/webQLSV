
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('edu_user');
    const storedToken = localStorage.getItem('edu_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
      // Gọi API đăng nhập backend
      const response = await axios.post(`${API_URL}/students/login`, {
        studentId: username,
        password: pass
      });

      if (response.data && response.data.token) {
        const { user: userData, token } = response.data;
        
        // Chuyển đổi role từ backend (lowercase) sang UserRole enum (uppercase)
        let userRole: UserRole;
        const backendRole = (userData.role || '').toLowerCase();
        
        if (backendRole === 'student') {
          userRole = UserRole.STUDENT;
        } else if (backendRole === 'teacher') {
          userRole = UserRole.TEACHER;
        } else if (backendRole === 'admin') {
          userRole = UserRole.ADMIN;
        } else {
          userRole = UserRole.STUDENT; // Default fallback
        }
        
        // Chuyển đổi dữ liệu từ backend sang format của frontend
        const userFormatted: User = {
          id: userData.id,
          username: userData.studentId,
          fullName: userData.fullName,
          role: userRole,
          email: userData.email || `${userData.studentId}@university.edu.vn`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=random`,
          details: {
            studentId: userData.studentId,
            dob: userData.dob || '',
            gender: userData.gender || 'Nam',
            class: userData.class || '',
            faculty: userData.faculty || '',
            major: userData.major || '',
            phone: userData.phone || '',
            status: 'Active',
            gpa: userData.gpa || 0,
            totalCredits: userData.totalCredits || 0
          }
        };

        setUser(userFormatted);
        localStorage.setItem('edu_user', JSON.stringify(userFormatted));
        localStorage.setItem('edu_token', token);
        
        console.log('✅ Đăng nhập thành công:', userFormatted.fullName, '- Role:', userFormatted.role);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edu_user');
    localStorage.removeItem('edu_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
