import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';

// 💡 Use relative URL since axiosInstance has baseURL configured
const API_ADDRESSES_URL = '/user/addresses'; 

const ShippingAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    
    // State for new address form
    const [newAddress, setNewAddress] = useState({ 
        name: '', 
        street: '', 
        city: '', 
        zip: '' 
    });

    // --- 1. READ (Fetch Addresses) ---
    const fetchAddresses = async () => {
        try {
            const response = await axiosInstance.get(API_ADDRESSES_URL);
            setAddresses(response.data.data || []); // Assuming response is { data: [...] }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
            toast.error("Could not load shipping addresses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // --- 2. CREATE (Add New Address) ---
    const handleInputChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        
        // Validate required fields (zip is also required by backend)
        if (!newAddress.street || !newAddress.city || !newAddress.zip) {
            toast.error("Street, City, and ZIP Code are required!");
            return;
        }

        try {
            const response = await axiosInstance.post(API_ADDRESSES_URL, newAddress);
            
            // Refresh the list with the new address returned by the server
            // Assuming the server returns the newly created address in response.data.data
            setAddresses([...addresses, response.data.data]); 
            setNewAddress({ name: '', street: '', city: '', zip: '' });
            setIsAdding(false);
            toast.success(`Address "${newAddress.name || newAddress.street}" added successfully!`);

        } catch (error) {
            console.error("Failed to add address:", error);
            console.error("Error response:", error.response?.data);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to add address.';
            console.error("Error message:", errorMessage);
            toast.error(errorMessage);
        }
    };

    // --- 3. DELETE (Remove Address) ---
    const handleDeleteAddress = async (id) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;

        try {
            // Delete request to API
            await axiosInstance.delete(`${API_ADDRESSES_URL}/${id}`);
            
            // Optimistically update the UI
            setAddresses(addresses.filter(addr => addr._id !== id)); 
            toast.success("Address successfully deleted!");
        } catch (error) {
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
            
            {/* Button to show Add Form */}
            {!isAdding && (
                <button 
                    onClick={() => setIsAdding(true)}
                    className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    + Add New Address
                </button>
            )}

            {/* Form for adding a new address */}
            {isAdding && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 border border-indigo-200 rounded-lg bg-indigo-50 shadow-md space-y-3">
                    <h3 className="font-bold text-lg">Add New Address</h3>
                    <input 
                        name="name" 
                        value={newAddress.name} 
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

            {/* Displaying existing addresses */}
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
                                    onClick={() => handleDeleteAddress(addr._id)} // Using _id from MongoDB
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