
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { authAPI } from '../services/api';

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
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
      // Try API login first
      const userData = await authAPI.login(username, pass);
      // Map _id to id for frontend compatibility
      const user = {
        ...userData,
        id: userData._id || userData.id,
        avatar: `https://picsum.photos/seed/${username}/200`
      };
      setUser(user as User);
      localStorage.setItem('edu_user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      // Fallback to mock users for demo accounts
      const foundUser = MOCK_USERS.find(u => u.username === username);
      if (foundUser && pass === '123456') {
        setUser(foundUser);
        localStorage.setItem('edu_user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edu_user');
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
