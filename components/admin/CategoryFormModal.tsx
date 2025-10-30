import React, { useState, useEffect } from 'react';
import { Category, CategoryCreationRequest, CategoryUpdateRequest } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import { createCategory, updateCategory } from '../../api';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  refreshCategories: () => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, category, refreshCategories }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({ name: category.name, description: category.description });
      } else {
        setFormData({ name: '', description: '' });
      }
    }
  }, [category, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
        setError("Yêu cầu đăng nhập để thực hiện hành động này.");
        return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const requestData: CategoryCreationRequest | CategoryUpdateRequest = { 
          name: formData.name, 
          description: formData.description 
      };

      if (category) {
        await updateCategory(category.id, requestData, token);
      } else {
        await createCategory(requestData, token);
      }
      alert(`Đã ${category ? 'cập nhật' : 'tạo mới'} danh mục thành công!`);
      refreshCategories();
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h3 className="text-xl font-serif font-bold text-theme-primary">{category ? 'Chỉnh sửa Danh mục' : 'Tạo Danh mục Mới'}</h3>
          </div>
          <div className="p-6 space-y-4">
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</p>}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên danh mục</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-theme-accent focus:border-theme-accent"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea 
                name="description" 
                id="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={3}
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-theme-accent focus:border-theme-accent"
              ></textarea>
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

export default CategoryFormModal;