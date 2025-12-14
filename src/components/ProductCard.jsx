/* eslint-disable no-irregular-whitespace */
// src/components/ProductCard.jsx
import React from 'react';
import { useCartContext } from '../context/CartContext.jsx'; // Uvozimo naš kontekst
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { addToCart } = useCartContext(); 
    const handleAddToCart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        addToCart(product); 
    };
    // ...

    return (
        // Umesto običnog diva, koristimo Link za navigaciju do rute
        <div className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300 flex flex-col h-full"> 
            {/* LINK: Mora biti flex-grow da bi popunio visinu */}
            <Link to={`/product/${product._id}`} className="flex flex-col grow">
                <img 
                    src={product.image} 
                    alt={product.name} 
                   
                    className="w-full h-72 object-contain" 
                />
                    
                {/* TEXT WRAPPER: Mora biti flex-grow */}
                <div className="p-4 flex flex-col items-start grow">
                    <span className="text-sm font-semibold text-gray-500 uppercase">{product.category}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{product.name}</h3>
                    
                    <p className="text-2xl font-extrabold text-emerald-600 my-2">${product.price.toFixed(2)}</p>

                    {/* 🛑 IZMENA 3: Fiksiramo visinu opisa (npr. na h-10, što je ~2.5 reda teksta) */}
                    <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">{product.description}</p>
                </div>
            </Link>

            {/* Dugme za korpu ostaje izvan Linka */}
            <div className="p-4 pt-0 mt-auto">
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50 cursor-pointer"
                    disabled={product.stock === 0}
                >
                    {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                </button>
            </div>
        </div>
    );
};
export default ProductCard;