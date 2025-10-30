
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  loading: boolean;
  error: string | null;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, loading, error }) => {
  if (loading) {
    return <div className="text-center text-xl text-gray-500">Đang tải thực đơn...</div>;
  }

  if (error) {
    return <div className="text-center text-base text-red-700 bg-red-100 p-6 rounded-lg whitespace-pre-wrap">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="text-center text-xl text-gray-500">Không có sản phẩm nào để hiển thị.</div>;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map(product => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductList;