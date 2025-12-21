// src/hooks/useCart.ts
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import type { Product } from '../types/Product';
import type { CartItem, CartContextType } from '../types/Cart';

const useCart = (): CartContextType => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem('ecommerce_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Could not load cart from localStorage", error);
      return [];
    }
  });

  // Perzistencija korpe - čuvanje u browseru
  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    const productStock = product.stock;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > productStock) {
          const availableToAdd = productStock - existingItem.quantity;
          if (availableToAdd <= 0) {
            toast.error(`Stock limit reached! You already have ${existingItem.quantity} units in your cart (Max: ${productStock}).`);
          } else {
            toast.error(`Cannot add ${quantity} units. You can only add ${availableToAdd} more (Max: ${productStock}).`);
          }
          return prevItems;
        }

        toast.success(`Quantity for ${product.name} updated!`, { 
          style: { backgroundColor: '#10B981', color: 'white' }
        });

        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantity > productStock) {
          toast.error(`Only ${productStock} available in stock.`);
          return prevItems;
        }

        toast.success(`${product.name} added to cart!`, { 
          style: { backgroundColor: '#10B981', color: 'white' }
        });

        return [...prevItems, { ...product, quantity, stock: productStock }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCartItems(prevItems => {
      const itemToUpdate = prevItems.find(item => item._id === productId);
      if (!itemToUpdate) return prevItems;

      const productStock = itemToUpdate.stock;

      if (newQuantity < 1) {
        return prevItems.filter(item => item._id !== productId);
      }

      if (newQuantity > productStock) {
        toast.error(`Maximum quantity for ${itemToUpdate.name} is ${productStock}.`);
        newQuantity = productStock;
      }

      return prevItems.map(item =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success("Shopping cart cleared!");
  };

  const getTotalPrice = (): string => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
  };

  const getCartCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getCartCount };
};

export default useCart;