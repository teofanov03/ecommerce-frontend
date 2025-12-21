// src/pages/User/OrderHistory.tsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import type { Order, OrderItem } from '../../types/Order';

const API_ORDERS_URL = '/orders/my-orders'; // Backend ruta

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log('🔍 Fetching orders...');
                const response = await axiosInstance.get<{ data: Order[] }>(API_ORDERS_URL);
                console.log('📦 Orders received:', response.data);

                setOrders(response.data.data);
            } catch (error: any) {
                console.error("❌ Failed to fetch orders:", error);
                console.error("❌ Error Response:", error.response?.data);
                toast.error("Could not load order history.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="text-center p-8 text-indigo-600">Loading order history...</div>;
    }

    if (orders.length === 0) {
        return <div className="text-center p-8 text-gray-500">You haven't placed any orders yet.</div>;
    }

    const getStatusStyle = (status: string) => {
        switch(status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order History</h2>
            
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 p-5 rounded-lg shadow-sm bg-white">
                        {/* Glavni detalji narudžbine */}
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold text-indigo-600">Order #{order._id.slice(-6)}</span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(order.orderStatus)}`}>
                                {order.orderStatus}
                            </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                            <p>Date: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                            <p>Total: <span className="font-bold text-gray-800">{order.totalPrice.toFixed(2)} $</span></p>
                        </div>

                        {/* Stavke narudžbine */}
                        <h4 className="font-semibold text-gray-700 mb-2 border-t pt-2">Items Ordered:</h4>
                        <div className="space-y-3">
                            {order.orderItems.map((item: OrderItem, index: number) => {
                                // Type narrowing: ako je product objekat
                                const productDetails = typeof item.product === 'object' ? item.product : null;
                                const productName = item.name || productDetails?.name;
                                const imageUrl = productDetails?.image;

                                return (
                                    <div key={index} className="flex items-center space-x-3 border-b pb-2 last:border-b-0 last:pb-0">
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                alt={productName}
                                                className="w-12 h-12 object-cover rounded shadow-md shrink-0"
                                            />
                                        )}
                                        <div className="flex justify-between w-full text-sm items-center">
                                            <span className="font-medium text-gray-800 w-3/5">{productName}</span>
                                            <span className="text-gray-600 font-semibold ml-auto whitespace-nowrap">
                                                {item.quantity} x {item.price.toFixed(2)} €
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
