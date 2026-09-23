import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { isAuthenticated } from '../../utils/auth';

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} />
      <div className="app-main">
        <TopHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
