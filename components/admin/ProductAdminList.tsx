
import React from 'react';
import { Product } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';

interface ProductAdminListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductAdminList: React.FC<ProductAdminListProps> = ({ products, onEdit, onDelete }) => {
  const placeholderImageUrl = 'https://images.unsplash.com/photo-1511920183353-34e85a7ab120?q=80&w=1887&auto=format&fit=crop';
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sản phẩm
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Danh mục
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giá
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Hành động</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full object-cover" src={placeholderImageUrl} alt={product.name} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.category?.name || <span className="text-gray-400 italic">Chưa phân loại</span>}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* Use basePrice instead of price */}
                <span className="text-sm text-gray-900">${product.basePrice.toFixed(2)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                  <PencilIcon />
                </button>
                <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-900">
                  <TrashIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductAdminList;
