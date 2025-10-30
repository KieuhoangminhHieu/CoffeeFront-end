
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import AdminDashboard from './components/admin/AdminDashboard';
import CategoryMenu from './components/CategoryMenu';
import { Product, CartItem, Category } from './types';
import { getProducts, getCategories } from './api';
import { useAuth } from './auth/AuthContext';

type ViewMode = 'customer' | 'admin';
// Removed 'locations' and 'about' as they are not supported by the API
type CustomerTab = 'menu';
type ModalType = 'none' | 'login' | 'register';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [activeCustomerTab, setActiveCustomerTab] = useState<CustomerTab>('menu');

  const [activeModal, setActiveModal] = useState<ModalType>('none');
  
  const { logout } = useAuth();

  const fetchMenuData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Không thể tải thực đơn. Vui lòng thử lại sau.\nChi tiết: ${errorMessage}`);
      setProducts([]);
      setFilteredProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  useEffect(() => {
    if (selectedCategoryId === null) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category?.id === selectedCategoryId));
    }
  }, [selectedCategoryId, products]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item => item.product.id === product.id);
      if (itemInCart) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };
  
  const handleCheckoutSuccess = () => {
    setCartItems([]);
    setIsCartOpen(false);
  };

  const navigate = (mode: ViewMode, tab?: CustomerTab) => {
    setViewMode(mode);
    if (mode === 'customer' && tab) {
      setActiveCustomerTab(tab);
    }
  };

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const renderCustomerView = () => {
    switch (activeCustomerTab) {
      case 'menu':
        return (
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-theme-primary">Thực đơn của chúng tôi</h1>
              <p className="mt-4 text-lg text-gray-600">Khám phá hương vị cà phê đích thực và các món ăn nhẹ đặc biệt.</p>
            </div>
            <div className="mb-12">
              <CategoryMenu 
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />
            </div>
            <ProductList
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              loading={loading}
              error={error}
            />
          </main>
        );
      // Removed cases for 'locations' and 'about'
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-theme-light font-sans">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={cartItemCount}
        onLoginClick={() => setActiveModal('login')}
        onLogout={logout}
        viewMode={viewMode}
        activeCustomerTab={activeCustomerTab}
        navigate={navigate}
      />
      <div className="flex-grow">
        {viewMode === 'customer' ? renderCustomerView() : <AdminDashboard />}
      </div>
      <Footer />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={handleCheckoutSuccess}
        onLoginRequired={() => setActiveModal('login')}
      />
      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={() => setActiveModal('none')}
        onSwitchToRegister={() => setActiveModal('register')}
      />
      <RegisterModal
        isOpen={activeModal === 'register'}
        onClose={() => setActiveModal('none')}
        onSwitchToLogin={() => setActiveModal('login')}
      />
    </div>
  );
}

export default App;
