// src/context/CartContext.js
import React, { createContext, useContext } from 'react';
import useCart from '../hooks/useCart'; // Uvozimo naš Custom Hook
import { toast } from 'react-hot-toast';
// 1. Kreiramo Context
const CartContext = createContext();

// 2. Kreiramo Provider komponentu
export const CartProvider = ({ children }) => {
    // Pozivamo naš hook i dobijamo sve funkcije i stanje
    const cart = useCart(); 

    return (
        // Prosleđujemo sve metode i stanje (cart) u value prop
        <CartContext.Provider value={cart}>
            {children}
        </CartContext.Provider>
    );
};

// 3. Kreiramo custom hook za korišćenje Context-a (OVO JE NAŠ 'BIT')
export const useCartContext = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};