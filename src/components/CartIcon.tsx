// src/components/CartIcon.tsx
import React from 'react';
import { useCartContext } from '../context/CartContext'; 
import { FaShoppingCart } from 'react-icons/fa'; 

const CartIcon: React.FC = () => {
    // Dohvatanje broja stavki iz našeg Context Hooka
    // TypeScript će prepoznati da je getCartCount funkcija koja vraća broj
    const { getCartCount } = useCartContext();
    const count: number = getCartCount();

    return (
        <button 
            className="relative p-2 rounded-full text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            aria-label="View Cart"
        >
            <FaShoppingCart className="w-6 h-6" />
            
            {/* Prikazujemo badge samo ako ima proizvoda u korpi */}
            {count > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {count}
                </span>
            )}
        </button>
    );
};

export default CartIcon;