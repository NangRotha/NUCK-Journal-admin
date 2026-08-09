import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../common/AdminSidebar';
import AdminHeader from '../common/AdminHeader';

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet key={location.pathname} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;