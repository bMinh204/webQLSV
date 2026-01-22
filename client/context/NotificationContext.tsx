import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, UserRole, MOCK_TRANSCRIPT } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Tự động tạo thông báo dựa trên dữ liệu mock khi người dùng đăng nhập
  useEffect(() => {
    if (user && user.role === UserRole.STUDENT) {
      const systemNotifications: Notification[] = [];
      
      // Check transcript for warnings/failures
      MOCK_TRANSCRIPT.forEach(subject => {
        if (subject.status === 'WARNING') {
          systemNotifications.push({
            id: `notif-warn-${subject.subjectCode}`,
            userId: user.id,
            title: 'Cảnh báo học tập',
            message: `Bạn đang ở mức Cảnh báo cho môn ${subject.subjectName} (${subject.subjectCode}). Vui lòng liên hệ giảng viên hoặc cải thiện điểm số.`,
            type: 'warning',
            isRead: false,
            date: new Date().toISOString()
          });
        } else if (subject.status === 'FAIL') {
          systemNotifications.push({
            id: `notif-fail-${subject.subjectCode}`,
            userId: user.id,
            title: 'Thông báo trượt môn',
            message: `Rất tiếc, bạn đã không đạt môn ${subject.subjectName} (${subject.subjectCode}). Bạn cần đăng ký học lại vào kỳ sau.`,
            type: 'danger',
            isRead: false,
            date: new Date().toISOString()
          });
        }
      });

      // Add a welcome message mock
      systemNotifications.push({
        id: 'notif-welcome',
        userId: user.id,
        title: 'Chào mừng năm học mới',
        message: 'Hệ thống EduSmart chúc bạn một kỳ học tập hiệu quả và thành công!',
        type: 'info',
        isRead: false,
        date: new Date(Date.now() - 86400000).toISOString() // Yesterday
      });

      setNotifications(systemNotifications);
    } else if (user) {
        // Mock notifs for other roles
        setNotifications([{
            id: 'notif-admin-1',
            userId: user.id,
            title: 'Hệ thống hoạt động bình thường',
            message: 'Bảo trì định kỳ đã hoàn tất lúc 02:00 sáng nay.',
            type: 'success',
            isRead: true,
            date: new Date().toISOString()
        }]);
    } else {
        setNotifications([]);
    }
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
