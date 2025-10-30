import React from 'react';
import { Category } from '../types';

interface CategoryMenuProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ categories, selectedCategoryId, onSelectCategory }) => {
  const baseStyle = "px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-accent";
  const activeStyle = "bg-theme-primary text-white shadow-md";
  const inactiveStyle = "bg-white text-theme-primary hover:bg-theme-secondary";

  return (
    <div className="flex justify-center flex-wrap gap-3">
      <button
        onClick={() => onSelectCategory(null)}
        className={`${baseStyle} ${!selectedCategoryId ? activeStyle : inactiveStyle}`}
      >
        Tất cả sản phẩm
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`${baseStyle} ${selectedCategoryId === category.id ? activeStyle : inactiveStyle}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
