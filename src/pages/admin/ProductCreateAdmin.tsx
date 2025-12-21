// src/pages/admin/ProductCreateAdmin.tsx
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm'; 
import { Product } from '../../types/Product';

// Definišemo tip za podatke koji dolaze iz forme (slično Product, ali bez _id)
// Omit koristimo da kažemo "uzmi sve iz Product osim _id"
export type ProductFormData = Omit<Product, '_id'>;

const ProductCreateAdmin: React.FC = () => {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL; 

    const handleCreateSubmit = async (formData: ProductFormData) => {
        try {
            // formData već sadrži Base64 string u polju 'image'
            await axios.post(`${BASE_URL}/products`, formData); 
            
            alert('Product successfully created!');
            navigate('/admin/products'); 
        } catch (err: any) {
            console.error("Product creation failed:", err.response?.data || err.message);
            // Bacamo grešku koju će ProductForm uhvatiti
            throw new Error(err.response?.data?.message || 'Failed to create product.'); 
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pt-20 max-w-2xl">
            {/* Prosleđujemo funkciju koja sada tačno zna kakve podatke prima */}
            <ProductForm onSubmit={handleCreateSubmit} />
        </div>
    );
};

export default ProductCreateAdmin;