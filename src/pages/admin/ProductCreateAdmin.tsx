// src/pages/admin/ProductCreateAdmin.tsx
import React from 'react';
// 1. Menjamo axios sa našim axiosInstance koji šalje token
import axiosInstance from '../../api/axios'; 
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm'; 
import { Product } from '../../types/Product';

export type ProductFormData = Omit<Product, '_id'>;

const ProductCreateAdmin: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateSubmit = async (formData: ProductFormData) => {
        try {
            // 2. Koristimo axiosInstance. Putanja je sada samo '/products' 
            // jer je BASE_URL već ugrađen u axiosInstance
            await axiosInstance.post('/products', formData); 
            
            alert('Product successfully created!');
            navigate('/admin/products'); 
        } catch (err: any) {
            console.error("Product creation failed:", err.response?.data || err.message);
            throw new Error(err.response?.data?.message || 'Failed to create product.'); 
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pt-20 max-w-2xl">
            <ProductForm onSubmit={handleCreateSubmit} />
        </div>
    );
};

export default ProductCreateAdmin;