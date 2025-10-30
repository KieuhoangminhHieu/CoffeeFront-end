import React, { useState, useEffect } from 'react';
import { User, UserCreationRequest, UserUpdateRequest } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import { createUser, updateUser } from '../../api';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  refreshUsers: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, user, refreshUsers }) => {
  const initialFormData = {
    username: '',
    email: '',
    password: '',
    roles: 'USER', // Default role for new users
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (isOpen) {
        if (user) {
          // NOTE: The API doesn't provide roles in the UserResponse, so we can't pre-fill it.
          // We default to USER when editing. A better API would return the user's current roles.
          setFormData({
            username: user.username,
            email: user.email,
            password: '', 
            roles: 'USER', 
          });
        } else {
          setFormData(initialFormData);
        }
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Yêu cầu đăng nhập để thực hiện hành động này.");
      return;
    }
    if (!user && !formData.password) {
        setError("Mật khẩu là bắt buộc cho người dùng mới.");
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (user) {
        const updateData: UserUpdateRequest = {
            email: formData.email,
            roles: [formData.roles]
        };
        await updateUser(user.id, updateData, token);
      } else {
        const createData: UserCreationRequest = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            roles: [formData.roles]
        };
        await createUser(createData, token);
      }
      alert(`Đã ${user ? 'cập nhật' : 'tạo mới'} người dùng thành công!`);
      refreshUsers();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(`Thao tác thất bại: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h3 className="text-xl font-serif font-bold text-theme-primary">{user ? 'Chỉnh sửa Người dùng' : 'Tạo Người dùng Mới'}</h3>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</p>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required disabled={!!user} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-theme-accent disabled:bg-gray-100"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-theme-accent"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={user ? "Để trống nếu không đổi" : ""} required={!user} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-theme-accent"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vai trò</label>
              <select name="roles" value={formData.roles} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-theme-accent">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div className="p-4 bg-gray-50 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">Hủy</button>
            <button type="submit" disabled={isLoading} className="bg-theme-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-theme-accent disabled:bg-gray-400">
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;