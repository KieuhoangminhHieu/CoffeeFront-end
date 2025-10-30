import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories, deleteProduct, deleteCategory } from '../../api';
import { Product, Category } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import ProductAdminList from './ProductAdminList';
import CategoryAdminList from './CategoryAdminList';
import ProductFormModal from './ProductFormModal';
import CategoryFormModal from './CategoryFormModal';

const MenuManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { token } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!token) return;
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(productId, token);
        alert('Đã xóa sản phẩm thành công!');
        fetchData();
      } catch (err) {
        alert(`Lỗi khi xóa sản phẩm: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!token) return;
    if (window.confirm('Bạn có chắc muốn xóa danh mục này? Hành động này có thể ảnh hưởng đến các sản phẩm thuộc danh mục này.')) {
      try {
        await deleteCategory(categoryId, token);
        alert('Đã xóa danh mục thành công!');
        fetchData();
      } catch (err) {
        alert(`Lỗi khi xóa danh mục: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
      }
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  return (
    <div>
      {/* Product Management */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Sản phẩm</h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            className="bg-theme-primary hover:bg-theme-accent text-white font-bold py-2 px-4 rounded"
          >
            Thêm sản phẩm mới
          </button>
        </div>
        <ProductAdminList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
      </div>

      {/* Category Management */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Danh mục</h2>
          <button
            onClick={() => {
              setEditingCategory(null);
              setIsCategoryModalOpen(true);
            }}
            className="bg-theme-primary hover:bg-theme-accent text-white font-bold py-2 px-4 rounded"
          >
            Thêm danh mục mới
          </button>
        </div>
        <CategoryAdminList categories={categories} onEdit={handleEditCategory} onDelete={handleDeleteCategory} />
      </div>

      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={editingProduct}
        refreshProducts={fetchData}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={editingCategory}
        refreshCategories={fetchData}
      />
    </div>
  );
};

export default MenuManagement;