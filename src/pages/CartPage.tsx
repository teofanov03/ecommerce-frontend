// src/pages/CartPage.tsx
import React from 'react';
import { useCartContext } from '../context/CartContext.js';
import ShippingForm from '../components/ShippingForm.jsx';
import axiosInstance from '../api/axios.js'; 
import { CartItem } from '../types/Cart.js';

// Definišemo interfejs za podatke koji dolaze iz forme (bez cartItems i totalPrice)
interface ShippingData {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
}

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartContext(); 
    const totalPrice = getTotalPrice(); 

    // ✅ Izmenjen hendler da prima podatke iz forme i spaja ih sa korpom
    const handleCheckout = async (shippingData: ShippingData) => {
        try {
            // Spajamo podatke iz forme sa artiklima iz korpe i ukupnom cenom
            const orderData = {
                ...shippingData,
                cartItems,
                totalPrice,
            };

            console.log("Sending order:", orderData);
            
            // Šaljemo na backend preko instance (automatski dodaje token ako postoji)
            const response = await axiosInstance.post('/orders', orderData);
            
            console.log('Order successfully created:', response.data);
            
            // Čistimo korpu nakon uspešne kupovine
            clearCart(); 

            // Backend obično vraća ID u response.data._id ili response.data.data._id
            const orderId = response.data?.data?._id || response.data?._id;
            alert(`Order #${orderId} successfully created! Thank you for your purchase.`);
            
        } catch (error: any) {
            console.error('Checkout error:', error.response ? error.response.data : error.message);
            alert(error.response?.data?.message || "An error occurred while creating the order.");
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
                        <div 
                            key={item._id} 
                            className="flex flex-wrap sm:flex-nowrap items-center p-4 bg-white shadow-lg rounded-lg border border-gray-100"
                        >
                            <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-md mr-4 mb-2 sm:mb-0 shrink-0"
                            />
                            
                            <div className="grow w-full sm:w-auto min-w-0 mb-4 sm:mb-0 sm:mr-6">
                                <h3 className="text-lg font-semibold text-gray-800 whitespace-normal">{item.name}</h3>
                                <p className="text-gray-600 text-sm sm:hidden mt-1">Price: ${item.price.toFixed(2)}</p>
                            </div>
                            
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm mr-4">
                                <button 
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                                    className="w-8 h-8 flex items-center justify-center text-xl font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition cursor-pointer disabled:bg-gray-300" 
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="font-medium text-lg w-10 text-center text-gray-800">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                                    className="w-8 h-8 flex items-center justify-center text-xl font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            <div className="hidden sm:block text-right font-bold text-lg text-gray-800 shrink-0 mr-4 w-24">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            
                            <button 
                                onClick={() => removeFromCart(item._id)} 
                                className="text-red-600 hover:text-white hover:bg-red-600 font-bold py-1 px-3 rounded-lg transition duration-150 border border-red-600 cursor-pointer shrink-0 order-4 sm:order-0 w-full sm:w-auto mt-4 sm:mt-0"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    
                    {/* Ukupna cena na dnu liste za bolju preglednost */}
                    <div className="p-4 bg-gray-50 rounded-lg text-right">
                         <span className="text-xl font-bold text-gray-900">Total: ${Number(totalPrice).toFixed(2)}</span>
                    </div>
                </div>

                {/* 2. Side Panel - Shipping Form */}
                <div className="lg:w-1/4 mt-8 lg:mt-0 sticky top-24 h-fit">
                    <ShippingForm onCheckout={handleCheckout} /> 
                </div>
            </div>
        </div>
    );
};

export default CartPage;