// src/pages/OrderTrackingPage.jsx - FULL ENGLISH VERSION

import React, { useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OrderTrackingPage = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    // Provera da li je ID uopšte unet
    if (!orderId) {
        setError('Please enter a valid Order ID.');
        return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);
    
    try {
        const response = await axios.get(`${BASE_URL}/orders/${orderId}`);
        
        if (response.data && response.data.data) {
             setOrder(response.data.data);
        } else {
             // Ako je poziv uspešan, ali nema podataka (npr. 200 OK, ali prazan odgovor)
             setError('Order tracking is temporarily unavailable or ID is incorrect.');
        }

    } catch (err) {
        console.error("Tracking error:", err);

        // Standardna provera za greške koje vraća Axios (npr. 404 Not Found)
        if (err.response && err.response.data && err.response.data.message) {
            // Ako backend vraća custom poruku (npr. 'Order not found' ili 'Invalid ID format')
             setError(err.response.data.message); 
        } else if (err.response) {
            // Ako je greška 4xx/5xx bez body poruke
            setError(`Error: Could not retrieve order. Status code: ${err.response.status}`);
        } else {
            // Greška mreže ili potpuno neočekivana greška
            setError('A network error occurred. Please check your connection.');
        }

    } finally {
        setLoading(false);
    }
};

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Shipped':
                return 'bg-blue-100 text-blue-800';
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl mt-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                Track Your Order
            </h2>
            
            {/* INPUT FORM */}
            <form onSubmit={handleTrackOrder} className="bg-white p-6 shadow-xl rounded-lg mb-8">
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Order ID:
                </label>
                <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="E.g., 60c72b21b4a..."
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                />
                <button
                    type="submit"
                    className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-150 font-bold cursor-pointer disabled:opacity-50 "
                    disabled={loading}
                >
                    {loading ? 'Tracking...' : 'Track Order'}
                </button>
            </form>

            {/* ERROR MESSAGE */}
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center font-medium">{error}</div>}

            {/* ORDER DETAILS DISPLAY */}
            {order && (
                <div className="bg-white p-6 shadow-xl rounded-lg border-t-4 border-indigo-600">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Order Details:</h3>
                    
                    <p className="mb-2">
                        <span className="font-medium">ID:</span> {order._id}
                    </p>
                    <p className="mb-2">
                        <span className="font-medium">Total Price:</span> ${order.totalPrice.toFixed(2)}
                    </p>
                    <p className="mb-4">
                        <span className="font-medium">Date Placed:</span> {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-4 p-4 rounded-lg text-center font-bold text-lg border border-gray-200">
                        Current Status: 
                        <span 
                            className={`ml-3 px-3 py-1 inline-flex text-base leading-5 font-bold rounded-full ${getStatusClasses(order.orderStatus)}`}
                        >
                            {order.orderStatus || 'Processing'}
                        </span>
                    </div>

                    {/* Added Order Status Visualizer */}
                    <div className="mt-8">
                        <h4 className="font-semibold mb-4 text-center text-lg">Order Progress</h4>
                        <OrderStatusTimeline currentStatus={order.orderStatus} />
                    </div>

                </div>
            )}
        </div>
    );
};

// 💡 NOVA POMOĆNA KOMPONENTA ZA VIZUELIZACIJU STATUSA
const OrderStatusTimeline = ({ currentStatus }) => {
    const statuses = ['Processing', 'Shipped', 'Delivered'];
    
    // Određuje da li je status prošao, aktivan ili dolazi
    const getTimelineClasses = (status, index) => {
        const currentIndex = statuses.indexOf(currentStatus);
        const targetIndex = statuses.indexOf(status);

        if (targetIndex < currentIndex) {
            return 'bg-green-500 text-white'; // Prošlo
        } else if (targetIndex === currentIndex) {
            return 'bg-indigo-600 text-white animate-pulse'; // Trenutni
        } else {
            return 'bg-gray-300 text-gray-500'; // Sledeći
        }
    };

    return (
        <div className="flex justify-between items-center relative py-4">
            {/* Linija za povezivanje */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 z-0 mx-8"></div>

            {statuses.map((status, index) => (
                <div key={status} className="flex flex-col items-center z-10 w-1/3">
                    <div 
                        className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 
                            ${getTimelineClasses(status, index)}`}
                    >
                        {index + 1}
                    </div>
                    <div className="mt-2 text-center text-xs font-semibold">
                        {status}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderTrackingPage;