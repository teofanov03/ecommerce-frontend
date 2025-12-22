// src/pages/admin/OrderDetailPageAdmin.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axios'; // Importujemo naš axios sa tokenom
import type { Order, OrderItem, ShippingInfo } from '../../types/Order';

const OrderDetailPageAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State za update statusa
  const [newStatus, setNewStatus] = useState<Order['orderStatus']>('Processing');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Funkcija za dobavljanje podataka (zamenjuje useFetch)
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/orders/${id}`);
      // Backend obično pakuje u .data polje
      const fetchedOrder = res.data.data || res.data;
      setOrder(fetchedOrder);
      setNewStatus(fetchedOrder.orderStatus);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setError('Could not load order details. Check if you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  // Pomoćne funkcije
  const formatDate = (dateString?: string) => (dateString ? new Date(dateString).toLocaleString('en-US') : 'N/A');

  const getStatusClasses = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async () => {
    if (!order || newStatus === order.orderStatus) return alert('Status is already set to this value.');
    setIsUpdating(true);
    try {
      // KORISTIMO axiosInstance da bi poslao token
      await axiosInstance.put(`/orders/${id}`, { orderStatus: newStatus });
      alert(`Order status successfully updated to ${newStatus}.`);
      fetchOrderDetails(); // Refresh podataka nakon update-a
    } catch (err: any) {
      console.error('Error updating order status:', err);
      alert('Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-8 pt-20">Loading order details...</div>;
  if (error) return <div className="text-center py-8 pt-20 text-red-500">{error}</div>;
  if (!order) return <div className="text-center py-8 pt-20">No order found with ID: {id}</div>;

  const { shippingInfo, orderItems, totalPrice, orderStatus, createdAt, deliveredAt } = order;
  const shipping: ShippingInfo = shippingInfo || {} as ShippingInfo;

  // TVOJ ORIGINALNI CSS OSTAJE NETAKNUT
  return (
    <div className="container mx-auto px-4 py-12 pt-20">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        Order Details <span className="text-indigo-600">#{id?.substring(0, 8)}</span>
      </h1>

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
            onChange={(e) => setNewStatus(e.target.value as Order['orderStatus'])}
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

        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {orderItems.map((item: OrderItem) => {
                const product = typeof item.product === 'object' ? item.product : null;
                return (
                  <div key={item._id || item.name} className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center space-x-4">
                      {product?.image && (
                        <img src={product.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      )}
                      <div>
                        <span className="font-semibold text-gray-900">{item.name}</span>
                        {product?.category && <p className="text-xs text-gray-500">Category: {product.category}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">{item.quantity} x ${item.price.toFixed(2)}</p>
                      <p className="font-bold text-indigo-600">Total: ${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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