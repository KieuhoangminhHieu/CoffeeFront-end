import React, { useState } from 'react';
import MenuManagement from './MenuManagement';
import UserManagement from './UserManagement';
// Location and AboutUs Management removed as they are not supported by the current API

type AdminTab = 'menu' | 'users';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('menu');

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return <MenuManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <div className="text-center p-8">Vui lòng chọn một mục để quản lý.</div>;
    }
  };

  const getTabClass = (tab: AdminTab) => {
    return `px-4 py-2 font-medium text-sm rounded-md transition-colors duration-200 ${
      activeTab === tab 
      ? 'bg-theme-primary text-white' 
      : 'text-gray-600 hover:bg-gray-200'
    }`;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-theme-primary mb-6">Bảng điều khiển Quản trị</h1>
      <div className="flex flex-wrap gap-2 border-b-2 border-gray-200 mb-6 pb-2">
        <button onClick={() => setActiveTab('menu')} className={getTabClass('menu')}>
          Quản lý Thực đơn
        </button>
        <button onClick={() => setActiveTab('users')} className={getTabClass('users')}>
          Quản lý Người dùng
        </button>
        {/* Removed Location and About Us tabs */}
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
