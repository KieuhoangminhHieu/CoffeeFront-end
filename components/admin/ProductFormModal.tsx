import React, { useState, useEffect } from 'react';
import { Product, Category, ProductCreationRequest, ProductUpdateRequest } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import { getCategories, createProduct, updateProduct } from '../../api';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  refreshProducts: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, product, refreshProducts }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 0,
    categoryId: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    // Reset form data when modal opens or product changes
    if (isOpen) {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                basePrice: product.basePrice,
                categoryId: product.category?.id || '',
            });
        } else {
             setFormData({
                name: '',
                description: '',
                basePrice: 0,
                categoryId: categories.length > 0 ? categories[0].id : '',
            });
        }
    }
  }, [product, isOpen, categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        // If creating a new product and we didn't have categories before, set default
        if (!product && formData.categoryId === '' && cats.length > 0) {
          setFormData(prev => ({...prev, categoryId: cats[0].id}));
        }
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
        setError("Không thể tải danh sách danh mục.");
      }
    };
    if (isOpen) {
        fetchCategories();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'basePrice' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
        setError("Yêu cầu đăng nhập để thực hiện hành động này.");
        return;
    }
    if (!formData.categoryId) {
        setError("Vui lòng chọn một danh mục.");
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestData: ProductCreationRequest | ProductUpdateRequest = {
          name: formData.name,
          description: formData.description,
          basePrice: formData.basePrice,
          categoryId: formData.categoryId
      };
      
      if (product) { // Chế độ sửa
        await updateProduct(product.id, requestData, token);
      } else { // Chế độ tạo mới
        await createProduct(requestData, token);
      }
      alert(`Đã ${product ? 'cập nhật' : 'tạo mới'} sản phẩm thành công!`);
      refreshProducts();
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
            <h3 className="text-xl font-serif font-bold text-theme-primary">{product ? 'Chỉnh sửa Sản phẩm' : 'Tạo Sản phẩm Mới'}</h3>
          </div>
          <div className="p-6 space-y-4">
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</p>}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-theme-accent focus:border-theme-accent"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-theme-accent focus:border-theme-accent"></textarea>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Giá</label>
                    <input type="number" name="basePrice" id="basePrice" value={formData.basePrice} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-theme-accent focus:border-theme-accent"/>
                </div>
                 <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Danh mục</label>
                    <select name="categoryId" id="categoryId" value={formData.categoryId} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-theme-accent focus:border-theme-accent bg-white">
                        <option value="" disabled>-- Chọn danh mục --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
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

export default ProductFormModal;