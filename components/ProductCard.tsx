import React from 'react';
import { Product } from '../types';
import PlusIcon from './icons/PlusIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Using a placeholder image since the API doesn't provide one.
  const imageUrl = 'https://images.unsplash.com/photo-1511920183353-34e85a7ab120?q=80&w=1887&auto=format&fit=crop';
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative">
        <img src={imageUrl} alt={product.name} className="w-full h-56 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-bold text-theme-primary">{product.name}</h3>
        <p className="mt-2 text-gray-600 text-sm flex-grow">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          {/* Use basePrice instead of price */}
          <p className="text-xl font-bold text-theme-primary">${product.basePrice.toFixed(2)}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center bg-theme-primary text-white px-4 py-2 rounded-full hover:bg-theme-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-accent transition-all duration-300 transform group-hover:scale-105"
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <PlusIcon />
            <span className="ml-2 text-sm font-medium">Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;