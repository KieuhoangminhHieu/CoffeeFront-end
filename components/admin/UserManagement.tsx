import React, { useState, useEffect, useCallback } from 'react';
import { getUsers, deleteUser } from '../../api';
import { User } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import UserFormModal from './UserFormModal';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { token } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setError("Cần có token quản trị để xem người dùng.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const usersData = await getUsers(token);
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (!token) return;
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await deleteUser(userId, token);
        alert('Đã xóa người dùng thành công!');
        fetchUsers();
      } catch (err) {
        alert(`Lỗi khi xóa người dùng: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
      }
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  if (loading) return <p>Đang tải danh sách người dùng...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Người dùng</h2>
        <button
          onClick={handleAddNew}
          className="bg-theme-primary hover:bg-theme-accent text-white font-bold py-2 px-4 rounded"
        >
          Thêm người dùng mới
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="relative px-6 py-3"><span className="sr-only">Hành động</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4"><PencilIcon /></button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        refreshUsers={fetchUsers}
      />
    </div>
  );
};

export default UserManagement;
