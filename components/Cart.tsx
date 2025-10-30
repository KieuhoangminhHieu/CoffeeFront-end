import React, { useMemo, useState } from 'react';
import { CartItem, OrderItemRequest, CreateOrderRequest } from '../types';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import TrashIcon from './icons/TrashIcon';
import { useAuth } from '../auth/AuthContext';
import { createOrder } from '../api';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckoutSuccess: () => void;
  onLoginRequired: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckoutSuccess, onLoginRequired }) => {
  const { user, isAuthenticated, token } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(() => {
    // Use basePrice instead of price
    return cartItems.reduce((total, item) => total + item.product.basePrice * item.quantity, 0);
  }, [cartItems]);

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      onLoginRequired();
      onClose();
      return;
    }
    
    if (cartItems.length === 0 || !token) return;

    setIsPlacingOrder(true);
    setError(null);
    try {
      const orderItems: OrderItemRequest[] = cartItems.map(item => ({
        menuId: item.product.id,
        quantity: item.quantity,
      }));
      
      // Add userId to the request payload as required by the API spec
      const orderRequest: CreateOrderRequest = {
        userId: user.id,
        items: orderItems
      };

      await createOrder(orderRequest, token);
      
      alert('Đặt hàng thành công!');
      onCheckoutSuccess();
    } catch (err) {
      console.error('Lỗi khi đặt hàng:', err);
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(`Đặt hàng thất bại: ${errorMessage}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };


  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-theme-light shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-theme-secondary">
            <h2 className="text-2xl font-serif font-bold text-theme-primary">Giỏ hàng của bạn</h2>
            <button onClick={onClose} className="p-2 text-theme-primary hover:text-theme-accent transition-colors">&times;</button>
          </div>
          
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
              <button
                onClick={onClose}
                className="mt-4 bg-theme-primary text-white px-6 py-2 rounded-full hover:bg-theme-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-accent transition-all duration-300"
              >
                Bắt đầu mua sắm
              </button>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto p-6">
                <ul className="space-y-4">
                  {cartItems.map(item => (
                    <li key={item.product.id} className="flex items-center space-x-4">
                      {/* Using a placeholder since imageUrl is not available */}
                      <img src="https://images.unsplash.com/photo-1511920183353-34e85a7ab120?q=80&w=1887&auto=format&fit=crop" alt={item.product.name} className="w-20 h-20 rounded-md object-cover" />
                      <div className="flex-grow">
                        <h3 className="font-bold text-theme-primary">{item.product.name}</h3>
                        {/* Use basePrice */}
                        <p className="text-sm text-gray-500">${item.product.basePrice.toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                          <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"><MinusIcon /></button>
                          <span className="px-3">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"><PlusIcon /></button>
                        </div>
                      </div>
                      <div className="text-right">
                        {/* Use basePrice */}
                        <p className="font-bold text-theme-primary">${(item.product.basePrice * item.quantity).toFixed(2)}</p>
                        <button onClick={() => onRemoveItem(item.product.id)} className="text-red-500 hover:text-red-700 mt-2"><TrashIcon /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 border-t border-theme-secondary bg-white">
                 {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium text-gray-600">Tạm tính</span>
                  <span className="font-bold text-theme-primary">${subtotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={isPlacingOrder}
                  className="w-full mt-4 bg-theme-primary text-white py-3 rounded-full font-bold text-lg hover:bg-theme-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-accent transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? 'Đang xử lý...' : (isAuthenticated ? 'Tiến hành thanh toán' : 'Đăng nhập để thanh toán')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
