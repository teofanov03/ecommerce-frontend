// src/pages/admin/ProductEditAdmin.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';
import axiosInstance from '../../api/axios'; // Naš heroj sa tokenom
import { Product } from '../../types/Product';
import { ProductFormData } from './ProductCreateAdmin';

const ProductEditAdmin: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();

    // Ručni state umesto useFetch da bismo mogli koristiti axiosInstance
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // 1. Fetchovanje podataka o proizvodu sa tokenom
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/products/${id}`);
                setProduct(res.data.data || res.data);
                setError(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    // 2. Slanje izmena sa tokenom
    const handleEditSubmit = async (formData: ProductFormData) => {
        try {
            // Koristimo axiosInstance.put
            await axiosInstance.put(`/products/${id}`, formData);
            
            alert(`Product "${formData.name}" was successfully updated!`);
            navigate('/admin/products'); 

        } catch (error: any) {
            console.error('Error updating product:', error.response?.data || error.message);
            alert('Product update failed. Check the console.');
        }
    };

    if (loading) return <div className="text-center py-8 pt-20">Loading data for editing...</div>;
    if (error) return <div className="text-center py-8 pt-20 text-red-500">Error fetching product data. (401 Unauthorized)</div>;
    if (!product) return <div className="text-center py-8 pt-20 text-red-500">Product not found.</div>;

    return (
        <div className="max-w-3xl mx-auto pt-20 px-4">
            <ProductForm 
                onSubmit={handleEditSubmit} 
                initialData={product} 
            />
        </div>
    );
};

export default ProductEditAdmin;