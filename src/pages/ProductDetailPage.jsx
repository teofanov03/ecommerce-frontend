// src/pages/ProductDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useCartContext } from '../context/CartContext.jsx';

const ProductDetailPage = () => {
    // 1. Dohvatamo ID proizvoda iz URL-a
    const { id } = useParams(); 
    const BASE_URL = 'http://localhost:5000/api/v1'; 

    // 2. Dohvatamo specifičan proizvod (koristeći novi API endpoint)
    const { data: fetchResponse, loading, error } = useFetch(`${BASE_URL}/products/${id}`);
    const { addToCart } = useCartContext(); 
const product = fetchResponse?.data;
    if (loading) return <div className="pt-20 text-center">Loading details...</div>;
    if (error || !product) return <div className="pt-20 text-center text-red-500">Product not found!</div>;

    const handleAddToCart = () => {
        addToCart(product, 1); // Uvek dodajemo 1 za sada
    };

    return (
        <div className="container mx-auto px-4 py-12 pt-20">
            <div className="flex flex-wrap -mx-4">
                {/* 1. Slika */}
                <div className="w-full lg:w-1/2 px-4 mb-6 lg:mb-0">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-auto object-cover rounded-lg shadow-xl" 
                    />
                </div>

                {/* 2. Detalji i Akcije */}
                <div className="w-full lg:w-1/2 px-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                    <span className="text-lg font-semibold text-gray-500 uppercase">{product.category}</span>
                    
                    <p className="text-4xl font-extrabold text-indigo-600 my-4">${product.price.toFixed(2)}</p>

                    <div className="text-gray-700 leading-relaxed mb-6">
                        <h2 className="text-2xl font-semibold mb-3">Description</h2>
                        <p>{product.description}</p>
                    </div>

                    <p className={`mb-6 font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Availability: {product.stock > 0 ? `In Stock (${product.stock})` : 'Sold Out'}
                    </p>

                    <button
                        onClick={handleAddToCart}
                        className="w-full max-w-xs bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
                        disabled={product.stock === 0}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;