import React, { createContext, useContext, ReactNode } from 'react';
import useCart from '../hooks/useCart';
import type { CartContextType } from '../types/Cart';

// Kreiramo Context sa tipom
const CartContext = createContext<CartContextType | undefined>(undefined);

// Tipovi za Provider props
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const cart = useCart(); // tvoj custom hook koji vraća sve metode i stanje

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook za korišćenje konteksta
export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext must be used within a CartProvider');
  return context;
};
