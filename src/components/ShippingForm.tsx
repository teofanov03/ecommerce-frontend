// src/components/ShippingForm.jsx - LOKALIZOVANA VERZIJA (EN / USD)
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useCartContext } from '../context/CartContext';
import { CartItem } from '../types/Cart';
interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

interface OrderData {
  shippingInfo: ShippingInfo;
  orderItems: {
    product: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
}

interface ShippingFormProps {
  onCheckout: (data: OrderData) => void;
}
const ShippingForm = ({ onCheckout }) => {
    // Stanje forme sa ključevima koji odgovaraju Order modelu (fullName, email, itd.)
    const [formData, setFormData] = useState<ShippingInfo>({
        fullName: '',
        email: '',
        address: '',
        city: '',
        zipCode: ''
    });
    const { cartItems, getTotalPrice } = useCartContext();
    
    // Dohvatamo ukupnu cenu
    const total = parseFloat(getTotalPrice());

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const total = parseFloat(getTotalPrice());

    const orderData: OrderData = {
        shippingInfo: formData,
        orderItems: cartItems.map((item: CartItem) => ({
            product: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        })),
        totalPrice: total,
    };

    onCheckout(orderData);
};

    // Funkcija za prevođenje CamelCase polja u User-friendly tekst (Već je na engleskom)
    const getFieldLabel = (key:keyof ShippingInfo) => {
        switch(key) {
            case 'fullName': return 'Full Name';
            case 'email': return 'Email Address';
            case 'address': return 'Street Address';
            case 'city': return 'City';
            case 'zipCode': return 'ZIP Code';
            default: return key;
        }
    };

    return (
         <form onSubmit={handleSubmit} className="p-6 bg-white shadow-xl rounded-lg border border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
            
            {Object.keys(formData).map((key) => (
                <div key={key} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor={key}>
                        {getFieldLabel(key as keyof ShippingInfo)}
                    </label>
                    <input
                        type={key === 'email' ? 'email' : 'text'}
                        id={key}
                        name={key}
                        value={formData[key as keyof ShippingInfo]}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            ))}

            <div className="flex justify-between text-lg font-semibold border-t pt-4 mt-6">
                <span>Order Total:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
            
            <button
                type="submit"
                className="w-full py-3 mt-4 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
                disabled={cartItems.length === 0}
            >
                Confirm Order (${total.toFixed(2)})
            </button>
        </form>
    );
};

export default ShippingForm;