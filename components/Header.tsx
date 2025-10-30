import React from 'react';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import { useAuth } from '../auth/AuthContext';
import UserIcon from './icons/UserIcon';
import LogoutIcon from './icons/LogoutIcon';
import AdminIcon from './icons/AdminIcon';

// Removed 'locations' and 'about' as customer tabs
type ViewMode = 'customer' | 'admin';
type CustomerTab = 'menu';

interface HeaderProps {
  onCartClick: () => void;
  cartItemCount: number;
  onLoginClick: () => void;
  onLogout: () => void;
  viewMode: ViewMode;
  activeCustomerTab: CustomerTab;
  navigate: (mode: ViewMode, tab?: CustomerTab) => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, cartItemCount, onLoginClick, onLogout, viewMode, activeCustomerTab, navigate }) => {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();

  const navButtonStyle = "hover:text-theme-accent transition duration-300";
  const activeNavButtonStyle = "text-theme-accent font-semibold";

  return (
    <header className="sticky top-0 bg-theme-primary/90 backdrop-blur-sm shadow-md z-50 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <button onClick={() => navigate('customer', 'menu')} className="text-2xl font-serif font-bold text-theme-accent">
              Góc Cà Phê
            </button>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('customer', 'menu')} 
              className={`${navButtonStyle} ${viewMode === 'customer' && activeCustomerTab === 'menu' ? activeNavButtonStyle : ''}`}
            >
              Thực đơn
            </button>
            {/* Removed Locations and About Us buttons */}
             {isAdmin && (
              <button onClick={() => navigate('admin')} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${viewMode === 'admin' ? 'bg-theme-accent' : 'hover:bg-theme-accent/20'}`}>
                <AdminIcon />
                Quản trị
              </button>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {!isLoading && (
                isAuthenticated && user ? (
                  <div className="flex items-center space-x-4">
                    <span className="hidden sm:inline">Chào, {user.username}!</span>
                    <button
                      onClick={onLogout}
                      className="p-2 rounded-full hover:bg-theme-accent/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-primary focus:ring-theme-accent transition duration-300"
                      aria-label="Đăng xuất"
                    >
                      <LogoutIcon />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onLoginClick}
                    className="flex items-center p-2 rounded-full hover:bg-theme-accent/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-primary focus:ring-theme-accent transition duration-300"
                    aria-label="Đăng nhập"
                  >
                    <UserIcon />
                     <span className="ml-2 hidden sm:inline">Đăng nhập</span>
                  </button>
                )
              )}
            </div>
            {viewMode === 'customer' && (
               <button
                onClick={onCartClick}
                className="relative p-2 rounded-full hover:bg-theme-accent/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-primary focus:ring-theme-accent transition duration-300"
                aria-label="Mở giỏ hàng"
              >
                <ShoppingCartIcon />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
