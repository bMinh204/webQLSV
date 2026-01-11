
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import ChatBot from './ChatBot'; // Import ChatBot

const Layout: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Outlet />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-x-hidden relative">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
        {/* EduBot AI Assistant */}
        <ChatBot />
      </main>
    </div>
  );
};

export default Layout;
