import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ username, password });
      onClose(); // Đóng modal khi đăng nhập thành công
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4 transform transition-all"
          onClick={e => e.stopPropagation()}
        >
          <h2 className="text-2xl font-serif font-bold text-theme-primary text-center mb-6">Đăng nhập</h2>
          <form onSubmit={handleSubmit}>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-theme-accent"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-theme-accent"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-theme-primary text-white py-3 rounded-full font-bold text-lg hover:bg-theme-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-accent transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </div>
          </form>
           <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-medium text-theme-accent hover:text-green-700 focus:outline-none"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;