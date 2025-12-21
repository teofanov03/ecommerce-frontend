import type { Product } from './Product';

export interface CartItem extends Product {
  quantity: number; // dodatna količina za korpu
  stock: number; // zadržavamo stock iz Product tipa
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void; // <-- dodaj ovo
  clearCart: () => void;
  getTotalPrice: () => string;
  getCartCount: () => number;
}

