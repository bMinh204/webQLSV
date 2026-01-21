
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import GradesPage from './pages/student/Grades';
import Profile from './pages/student/Profile';
import SchedulePage from './pages/student/Schedule';
import ProgressPage from './pages/student/Progress';
import TeacherClasses from './pages/teacher/Classes';
import ClassDetails from './pages/teacher/ClassDetails';
import GradeEntry from './pages/teacher/GradeEntry';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import Announcements from './pages/Announcements'; // Import Announcements mới
import TestDataEntry from './pages/TestDataEntry'; // Import TestDataEntry
import TestChatBot from './components/TestChatBot'; // Import TestChatBot

const DashboardSwitch = () => {
  const { user } = useAuth();
  
  if (user?.role === UserRole.STUDENT) return <StudentDashboard />;
  if (user?.role === UserRole.TEACHER) return <TeacherClasses />;
  if (user?.role === UserRole.ADMIN) return <UserManagement />;
  
  return <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardSwitch />
              </ProtectedRoute>
            } />

            {/* Common Routes */}
            <Route path="/announcements" element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/grades" element={
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <GradesPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <ProgressPage />
              </ProtectedRoute>
            } />
             <Route path="/schedule" element={
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <SchedulePage />
              </ProtectedRoute>
            } />

            {/* Teacher Routes */}
            <Route path="/classes" element={
              <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                <TeacherClasses />
              </ProtectedRoute>
            } />
            <Route path="/classes/:courseId" element={
              <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                <ClassDetails />
              </ProtectedRoute>
            } />
            <Route path="/grade-entry" element={
              <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                <GradeEntry />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <CourseManagement />
              </ProtectedRoute>
            } />
            
            {/* Test Route - Accessible without authentication */}
            <Route path="/test" element={<TestDataEntry />} />
            <Route path="/test-chat" element={<TestChatBot />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
