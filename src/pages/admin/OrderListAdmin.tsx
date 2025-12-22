// src/pages/admin/OrderListAdmin.tsx
import React from 'react';
import useFetch from '../../hooks/useFetch';
import axiosInstance from '../../api/axios';
import { Link } from 'react-router-dom';
import type { Order } from '../../types/Order';

interface OrdersFetchResponse {
    data: Order[];
}

const OrderListAdmin: React.FC = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL; 
    
    const { data: fetchResponse, loading, error, refetch } = useFetch<OrdersFetchResponse>(`${BASE_URL}/orders`); 
    const orders = fetchResponse?.data || [];

    // DEBUG: Pogledaj u konzolu da vidiš strukturu ID-a
    console.log("Admin Orders Data:", orders);

    const handleUpdateStatus = async (orderId: string, currentStatus: Order['orderStatus']) => {
        let nextStatus: Order['orderStatus'];
        if (currentStatus === 'Processing') {
            nextStatus = 'Shipped';
        } else if (currentStatus === 'Shipped') {
            nextStatus = 'Delivered';
        } else {
            alert(`Cannot change status from ${currentStatus}.`);
            return;
        }

        if (window.confirm(`Are you sure you want to change order status from ${currentStatus} to ${nextStatus}?`)) {
            try {
                // Koristimo axiosInstance (sa malim 'a') jer on šalje token
                await axiosInstance.put(`/orders/${orderId}`, { orderStatus: nextStatus });
                alert(`Order updated to ${nextStatus}.`);
                refetch();
            } catch (err: any) {
                console.error('Error updating order status:', err);
                alert('Status update failed.');
            }
        }
    };

    const handleDelete = async (orderId: string) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await axiosInstance.delete(`/orders/${orderId}`);
                alert("Order deleted successfully!");
                refetch();
            } catch (error) {
                console.error("Delete failed:", error);
                alert("Error deleting order.");
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US');
    };

    const getStatusClasses = (status: Order['orderStatus']) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'Processing': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center py-8">Loading orders...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error fetching orders.</div>;
    if (orders.length === 0) return <div className="text-center py-8">No orders found.</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h2>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th> 
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {/* Koristimo _id jer ga MongoDB tako šalje */}
                                    {order._id ? order._id.substring(0, 8) : 'N/A'}...
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.shippingInfo?.fullName || order.shippingInfo?.email || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {order.shippingInfo?.address}, {order.shippingInfo?.city} ({order.shippingInfo?.zipCode})
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                                    ${order.totalPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(order.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span 
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.orderStatus)}`}
                                    >
                                        {order.orderStatus || 'Processing'} 
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center text-sm font-medium">
                                    <div className="flex flex-col items-center space-y-2">
                                        {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order._id, order.orderStatus)}
                                                className="bg-indigo-500 text-white py-1 px-2 rounded-lg hover:bg-indigo-600 transition font-medium text-xs w-full max-w-25"
                                            >
                                                Next Status
                                            </button>
                                        )}
                                        
                                        <Link to={`/admin/orders/${order._id}`} className="w-full max-w-25">
                                            <button className="bg-gray-200 text-gray-800 py-1 px-2 rounded-lg hover:bg-gray-300 transition font-medium text-xs w-full">
                                                Details
                                            </button>
                                        </Link>
                                        
                                        <button 
                                            onClick={() => handleDelete(order._id)}
                                            className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition font-medium text-xs w-full max-w-25"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderListAdmin;