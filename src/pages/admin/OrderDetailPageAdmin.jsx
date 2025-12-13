// src/pages/admin/OrderDetailPageAdmin.jsx - KONAČNA VERZIJA SA SLIKOM PROIZVODA
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';

const OrderDetailPageAdmin = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const BASE_URL = 'http://localhost:5000/api/v1'; 
    
    // Dohvaćanje specifične narudžbine
    const { data: fetchResponse, loading, error, refetch } = useFetch(`${BASE_URL}/orders/${id}`); 
    const order = fetchResponse?.data;
    // Stanje za rukovanje statusom
    const [newStatus, setNewStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Sinhronizacija newStatusa kada se narudžbina učita
    useEffect(() => {
        if (order) {
            setNewStatus(order.orderStatus); 
        }
    }, [order]);

    // ----------------------------------------------------
    // POMOĆNE FUNKCIJE
    // ----------------------------------------------------
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US');
    };
    
    const getStatusClasses = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'Processing': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // ----------------------------------------------------
    // LOGIKA ZA AŽURIRANJE STATUSA
    // ----------------------------------------------------
    const handleUpdateStatus = async () => {
        if (newStatus === order.orderStatus) {
            alert('Status is already set to this value.');
            return;
        }

        setIsUpdating(true);
        try {
            await axios.put(`${BASE_URL}/orders/${id}`, { orderStatus: newStatus });
            alert(`Order status successfully updated to ${newStatus}.`);
            refetch(); 
        } catch (err) {
            console.error('Error updating order status:', err.response ? err.response.data : err.message);
            alert('Failed to update status.');
        } finally {
            setIsUpdating(false);
        }
    };
    // ----------------------------------------------------


    if (loading) return <div className="text-center py-8 pt-20">Loading order details...</div>;
    // Prikazivanje Backend greške (npr. 404, 500)
    if (error) return <div className="text-center py-8 pt-20 text-red-500">Error: Could not load order. Check your console for details.</div>;
    if (!order) return <div className="text-center py-8 pt-20">No order found with ID: {id}</div>;

    const { shippingInfo, orderItems, totalPrice, orderStatus, createdAt, deliveredAt } = order;
    const shipping = shippingInfo || {}; 

    return (
        <div className="container mx-auto px-4 py-12 pt-20">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                Order Details <span className="text-indigo-600">#{id.substring(0, 8)}</span>
            </h1>

            {/* 1. STATUS I AŽURIRANJE */}
            <div className="flex justify-between items-center mb-8 p-6 bg-white shadow-lg rounded-lg border-l-4 border-indigo-500">
                <div>
                    <span className="text-lg font-semibold text-gray-700 block">Current Status:</span>
                    <span className={`text-2xl font-bold px-3 py-1 rounded-full ${getStatusClasses(orderStatus)}`}>
                        {orderStatus}
                    </span>
                </div>

                <div className="flex items-center space-x-4">
                    <label htmlFor="status-select" className="font-medium text-gray-700">Change Status:</label>
                    <select
                        id="status-select"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={isUpdating}
                    >
                        {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleUpdateStatus}
                        className="py-2 px-4 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition"
                        disabled={isUpdating || newStatus === orderStatus}
                    >
                        {isUpdating ? 'Updating...' : 'Update Status'}
                    </button>
                </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
                {/* 2. INFORMACIJE O DOSTAVI */}
                <div className="lg:col-span-1 p-6 bg-white shadow-lg rounded-lg border border-gray-100 h-fit">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Information</h2>
                    <p><strong>Recipient:</strong> {shipping.fullName || 'N/A'}</p>
                    <p><strong>Email:</strong> <a href={`mailto:${shipping.email}`} className="text-indigo-600 hover:underline">{shipping.email}</a></p>
                    <p><strong>Address:</strong> {shipping.address}</p>
                    <p><strong>City:</strong> {shipping.city}</p>
                    <p><strong>ZIP Code:</strong> {shipping.zipCode}</p>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mt-6 pt-4 border-t">Timestamps</h3>
                    <p className="text-sm text-gray-600"><strong>Created:</strong> {formatDate(createdAt)}</p>
                    <p className="text-sm text-gray-600"><strong>Delivered:</strong> {formatDate(deliveredAt)}</p>
                </div>

                {/* 3. STAVKE NARUDŽBINE I FINANSIJSKI REZIME */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stavke Narudžbine */}
                    <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Items Ordered</h2>
                        <div className="space-y-4">
                            {orderItems.map((item) => (
                                <div key={item._id} className="flex justify-between items-center border-b pb-3">
                                    <div className="flex items-center space-x-4">
                                        
                                        {/* NOVO: PRIKAZ SLIKE (Ako je popunjena) */}
                                        {item.product && item.product.image && (
                                            <img 
                                                src={item.product.image} 
                                                alt={item.name} 
                                                className="w-16 h-16 object-cover rounded-md" 
                                            />
                                        )}

                                        <div>
                                            {/* Ime proizvoda: Koristimo ime iz sačuvane stavke narudžbine */}
                                            <span className="font-semibold text-gray-900">{item.name}</span>
                                            {/* Prikaz kategorije (ako je popunjena) */}
                                            {item.product && item.product.category && (
                                                <p className="text-xs text-gray-500">Category: {item.product.category}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-600">
                                            {item.quantity} x ${item.price.toFixed(2)}
                                        </p>
                                        <p className="font-bold text-indigo-600">
                                            Total: ${(item.quantity * item.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Finansijski Rezime */}
                    <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Summary</h2>
                        <div className="space-y-2 text-lg">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-medium">${(totalPrice / 1.1).toFixed(2)}</span> 
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span className="font-medium">$0.00</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="font-bold text-xl">Order Total:</span>
                                <span className="font-extrabold text-xl text-green-600">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPageAdmin;