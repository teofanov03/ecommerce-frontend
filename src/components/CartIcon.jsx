// src/components/CartIcon.jsx
import React from 'react';
import { useCartContext } from '../context/CartContext.jsx'; 
// Mora se koristiti .jsx jer smo tako preimenovali fajl
import { FaShoppingCart } from 'react-icons/fa'; // Pretpostavljam da imate instaliran react-icons

const CartIcon = () => {
    // Dohvatanje broja stavki iz našeg Context Hooka
    const { getCartCount } = useCartContext();
    const count = getCartCount();

    return (
        <button 
            className="relative p-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
            aria-label="View Cart"
            // U budućnosti, ovde bi dodali onClick={() => setShowCart(true)}
        >
            <FaShoppingCart className="w-6 h-6" />
            {count > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {count}
                </span>
            )}
        </button>
    );
};

export default CartIcon;