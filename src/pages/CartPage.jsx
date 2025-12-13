// src/pages/CartPage.jsx
import React from 'react';
import { useCartContext } from '../context/CartContext.jsx';
import ShippingForm from '../components/ShippingForm.jsx';
import axiosInstance from '../api/axios'; // ✅ Use your configured instance!

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartContext(); 
    const totalPrice = getTotalPrice(); 

    const handleCheckout = async (orderData) => {
        try {
            console.log("Sending order:", orderData);
            
            // ✅ Use axiosInstance instead of axios
            const response = await axiosInstance.post('/orders', orderData);
            
            console.log('Order successfully created:', response.data);
            
            clearCart(); 

            alert(`Order #${response.data.data._id} successfully created! Thank you for your purchase.`);
            
        } catch (error) {
            console.error('Checkout error:', error.response ? error.response.data : error.message);
            alert("An error occurred while creating the order.");
        }
    };
    
    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center pt-20">
                 <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Shopping Cart is Empty</h2>
                 <p className="text-gray-500">Go back to the homepage to start shopping.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 pt-20">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Shopping Cart</h1>

            <div className="lg:flex lg:space-x-8">
                {/* 1. Cart Items List */}
                <div className="lg:w-3/4 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex items-center p-4 bg-white shadow-lg rounded-lg border border-gray-100">
                            
                            <img 
                               src={item.image} 
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-md mr-4"
                            />
                            <div className="grow">
                                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                            </div>
                            
                            {/* Quantity Control */}
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm mr-6">
                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-xl font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed" disabled={item.quantity <= 1}>-</button>
                                <span className="font-medium text-lg w-8 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-xl font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition cursor-pointer">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item._id)} className="text-red-600 hover:text-white hover:bg-red-600 font-bold py-1 px-3 rounded-lg transition duration-150 border border-red-600 cursor-pointer">Remove</button>
                        </div>
                    ))}
                </div>

                {/* 2. Side Panel - Shipping Form */}
                <div className="lg:w-1/4 mt-8 lg:mt-0 sticky top-24 h-fit">
                    <ShippingForm onCheckout={handleCheckout} total={totalPrice} /> 
                </div>
            </div>
        </div>
    );
};

export default CartPage;