import React, { useState } from 'react';
import { register } from '../api';
import { UserCreationRequest } from '../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);
    try {
      // The API expects roles, but for a public registration, we default to 'USER'
      const registrationData: UserCreationRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        roles: ['USER'], // Default role for new users
      };
      await register(registrationData);
      setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-serif font-bold text-theme-primary text-center mb-6">Tạo tài khoản</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</p>}
          {success && <p className="bg-green-100 text-green-700 p-3 rounded-md text-sm">{success}</p>}
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username-register">Tên đăng nhập</label>
            <input id="username-register" type="text" name="username" value={formData.username} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-theme-accent" required />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email-register">Email</label>
            <input id="email-register" type="email" name="email" value={formData.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-theme-accent" required />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password-register">Mật khẩu</label>
            <input id="password-register" type="password" name="password" value={formData.password} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-theme-accent" required />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword-register">Xác nhận mật khẩu</label>
            <input id="confirmPassword-register" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-theme-accent" required />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-theme-primary text-white py-3 rounded-full font-bold text-lg hover:bg-theme-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-accent transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-theme-accent hover:text-green-700 focus:outline-none"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;