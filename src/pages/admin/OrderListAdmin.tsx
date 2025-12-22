import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { Link } from 'react-router-dom';
import type { Order } from '../../types/Order';
import { toast } from 'react-hot-toast';

const OrderListAdmin: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(false);
            
            // Koristimo axiosInstance koji SADA ima ispravan 'token' ključ
            const res = await axiosInstance.get('/orders');
            
            // DEBUG: Ovde ćemo videti šta tačno stiže i kako se zove ID
            console.log("Podaci sa servera:", res.data);

            // Prilagodi putanju ako backend pakuje u res.data.data
            const data = res.data.data || res.data;
            setOrders(data);
        } catch (err: any) {
            console.error('Greška pri dohvatanju porudžbina:', err);
            setError(true);
            toast.error(err.response?.status === 401 ? "Niste autorizovani (Admin only)" : "Greška na serveru");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
        let nextStatus = "";
        if (currentStatus === 'Processing') nextStatus = 'Shipped';
        else if (currentStatus === 'Shipped') nextStatus = 'Delivered';
        else return;

        try {
            await axiosInstance.put(`/orders/${orderId}`, { orderStatus: nextStatus });
            toast.success("Status ažuriran");
            fetchOrders(); // Refresh liste
        } catch (err) {
            toast.error("Greška pri ažuriranju");
        }
    };

    if (loading) return <div className="text-center py-10">Učitavanje porudžbina...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Greška 401: Proveri da li si ulogovan kao Admin.</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Upravljanje porudžbinama</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">Order ID</th>
                            <th className="px-6 py-3 text-left">Kupac</th>
                            <th className="px-6 py-3 text-left">Ukupno</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-center">Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-sm text-blue-600">
                                    {/* OVDE JE REŠENJE ZA ID: Koristimo _id */}
                                    {order._id ? `#${order._id.substring(order._id.length - 6)}` : "Nema ID-a"}
                                </td>
                                <td className="px-6 py-4">
                                    {order.shippingInfo?.fullName || "Nepoznato"}
                                </td>
                                <td className="px-6 py-4 font-bold">
                                    ${order.totalPrice?.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleUpdateStatus(order._id, order.orderStatus)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Sledeći status
                                    </button>
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