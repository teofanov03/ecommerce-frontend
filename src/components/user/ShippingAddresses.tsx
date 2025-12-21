import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';

interface Address {
  _id?: string; // Optional jer nova adresa još nema _id dok ne stigne sa servera
  name?: string;
  street: string;
  city: string;
  zip: string;
}

const API_ADDRESSES_URL = '/user/addresses';

const ShippingAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newAddress, setNewAddress] = useState<Address>({
    name: '',
    street: '',
    city: '',
    zip: '',
  });

  // --- READ ---
  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get(API_ADDRESSES_URL);
      setAddresses(response.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch addresses:", error);
      toast.error("Could not load shipping addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // --- CREATE ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newAddress.street || !newAddress.city || !newAddress.zip) {
      toast.error("Street, City, and ZIP Code are required!");
      return;
    }

    try {
      const response = await axiosInstance.post(API_ADDRESSES_URL, newAddress);
      const addedAddress: Address = response.data.data;

      setAddresses([...addresses, addedAddress]);
      setNewAddress({ name: '', street: '', city: '', zip: '' });
      setIsAdding(false);
      toast.success(`Address "${addedAddress.name || addedAddress.street}" added successfully!`);
    } catch (error: any) {
      console.error("Failed to add address:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to add address.');
    }
  };

  // --- DELETE ---
  const handleDeleteAddress = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      await axiosInstance.delete(`${API_ADDRESSES_URL}/${id}`);
      setAddresses(addresses.filter(addr => addr._id !== id));
      toast.success("Address successfully deleted!");
    } catch (error: any) {
      console.error("Failed to delete address:", error);
      toast.error('Failed to delete address.');
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-indigo-600">Loading addresses...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Shipping Addresses</h2>

      {!isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          + Add New Address
        </button>
      )}

      {isAdding && (
        <form onSubmit={handleAddAddress} className="mb-6 p-4 border border-indigo-200 rounded-lg bg-indigo-50 shadow-md space-y-3">
          <h3 className="font-bold text-lg">Add New Address</h3>
          <input 
            name="name"
            value={newAddress.name || ''}
            onChange={handleInputChange}
            placeholder="Address Nickname (e.g., Home)"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input 
            name="street"
            value={newAddress.street}
            onChange={handleInputChange}
            placeholder="Street Address (Required)"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <div className="flex space-x-3">
            <input 
              name="city"
              value={newAddress.city}
              onChange={handleInputChange}
              placeholder="City (Required)"
              required
              className="w-1/2 px-3 py-2 border rounded-md"
            />
            <input 
              name="zip"
              value={newAddress.zip}
              onChange={handleInputChange}
              placeholder="ZIP Code (Required)"
              required
              className="w-1/2 px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex space-x-3 justify-end">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600 hover:text-gray-900 transition">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              Save Address
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <p className="text-gray-500">No saved addresses. Please add one.</p>
        ) : (
          addresses.map((addr) => (
            <div key={addr._id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex justify-between items-start">
              <div className="text-sm">
                <p className="font-bold text-gray-800 mb-1">{addr.name || 'Untitled Address'}</p>
                <p>{addr.street}</p>
                <p>{addr.zip} {addr.city}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDeleteAddress(addr._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShippingAddresses;
