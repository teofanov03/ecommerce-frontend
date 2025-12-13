 
// src/pages/admin/OrderListAdmin.jsx - AŽURIRANA VERZIJA (EN)
import React from 'react';
import useFetch from '../../hooks/useFetch';
import axios from 'axios'; // Dodajemo axios za PUT zahtev
import { Link } from 'react-router-dom';

const OrderListAdmin = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL; 
    
    // Fetch all orders, dodajemo refetch za osvežavanje
    const { data: fetchResponse, loading, error, refetch } = useFetch(`${BASE_URL}/orders`); 
    const orders = fetchResponse?.data || [];
    // ------------------------------------------------------------------------
    // NOVO: Funkcija za promenu statusa narudžbine
    // ------------------------------------------------------------------------
    const handleUpdateStatus = async (orderId, currentStatus) => {
        // Logika za određivanje sledećeg statusa
        let nextStatus;
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
                // Slanje PUT zahteva za promenu statusa
                await axios.put(`${BASE_URL}/orders/${orderId}`, { orderStatus: nextStatus });
                
                alert(`Order ${orderId.substring(0, 8)}... status updated to ${nextStatus}.`);
                refetch(); // Osveži listu narudžbina
            } catch (err) {
                console.error('Error updating order status:', err);
                alert('Status update failed. Check the console.');
            }
        }
    };
    const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
        try {
            await axios.delete(`import.meta.env.VITE_API_BASE_URL/orders/${orderId}`);
            alert("Order deleted successfully!");
            // Opciono: Ažurirajte listu narudžbina (ponovnim fetchovanjem)
            refetch();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Error deleting order.");
        }
    }
};
    // ------------------------------------------------------------------------

    if (loading) return <div className="text-center py-8">Loading orders...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error fetching orders.</div>;
    if (orders.length === 0) return <div className="text-center py-8">No orders found.</div>;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US');
    };

    // Funkcija za bojenje statusa
    const getStatusClasses = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Shipped':
                return 'bg-blue-100 text-blue-800';
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h2>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            {/* NOVO: Dodavanje adrese */}
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
                                    {order._id.substring(0, 8)}...
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {/* Koristimo ispravan ključ `shippingInfo` i `fullName` */}
                                    {order.shippingInfo?.fullName || order.shippingInfo?.email || 'N/A'}
                                </td>
                                {/* NOVO: Prikaz adrese */}
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {/* Prikaz adrese, grada i poštanskog broja */}
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
    
                            {/* 💡 KLJUČNA IZMENA: Vertikalni flex kontejner za Akcije */}
                                <div className="flex flex-col items-center space-y-2">
                                    
                                    {/* 1. Dugme za Ažuriranje Statusa (Next Status) */}
                                    {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                                        <button
                                            onClick={() => handleUpdateStatus(order._id, order.orderStatus)}
                                            // Konzistentan blok stil
                                            className="bg-indigo-500 text-white py-1 px-2 rounded-lg hover:bg-indigo-600 transition font-medium text-xs w-full max-w-25"
                                        >
                                            Next Status
                                        </button>
                                    )}
                                    
                                    {/* 2. Dugme za Detalje (Details) */}
                                    <Link to={`/admin/orders/${order._id}`} className="w-full max-w-25">
                                        <button 
                                            // Svetliji neutralni stil
                                            className="bg-gray-200 text-gray-800 py-1 px-2 rounded-lg hover:bg-gray-300 transition font-medium text-xs w-full"
                                        >
                                            Details
                                        </button>
                                    </Link>
                                    
                                    {/* 3. Dugme za Brisanje (Delete) */}
                                    <button 
                                        onClick={() => handleDelete(order._id)}
                                        // Stil crvenog bloka
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