// src/pages/OrderTrackingPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Order } from '../types/Order';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OrderTrackingPage: React.FC = () => {
  const [orderId, setOrderId] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError('Please enter a valid Order ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await axios.get<{ data: Order }>(`${BASE_URL}/orders/track/${orderId}`);
      console.log("Tracking Response:", response.data);
      if (response.data?.data) {
        setOrder(response.data.data);
      } else {
        setError('Order tracking is temporarily unavailable or ID is incorrect.');
      }
    } catch (err: any) {
      console.error('Tracking error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response) {
        setError(`Error: Could not retrieve order. Status code: ${err.response.status}`);
      } else {
        setError('A network error occurred. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = (status: Order['orderStatus']) => {
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
          className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-150 font-bold cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Tracking...' : 'Track Order'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center font-medium mb-4">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white p-6 shadow-xl rounded-lg border-t-4 border-indigo-600">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Order Details:</h3>

          <p className="mb-2">
            <span className="font-medium">Order ID:</span> {order._id || "No ID returned"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Total Price:</span> ${order.totalPrice.toFixed(2)}
          </p>
          <p className="mb-4">
            <span className="font-medium">Date Placed:</span> {new Date(order.createdAt).toLocaleDateString()}
          </p>

          {order.shippingInfo && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Shipping Address:</h4>
              <p className="text-sm text-gray-700">
                {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.zipCode}
              </p>
            </div>
          )}

          {order.orderItems.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Items:</h4>
              <div className="space-y-2">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      {typeof item.product !== 'string' && item.product?.image && (
                        <img src={item.product.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 p-4 rounded-lg text-center font-bold text-lg border border-gray-200">
            Current Status:
            <span className={`ml-3 px-3 py-1 inline-flex text-base leading-5 font-bold rounded-full ${getStatusClasses(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>

          {order.deliveredAt && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-green-800">
                <span className="font-medium">Delivered on:</span> {new Date(order.deliveredAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
