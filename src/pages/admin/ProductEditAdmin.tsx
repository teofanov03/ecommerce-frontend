// src/pages/admin/ProductEditAdmin.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';
import { Product } from '../../types/Product';
import { ProductFormData } from './ProductCreateAdmin'; // Reupotrebljavamo tip koji smo definisali

// Tip za odgovor sa backenda jer tvoj API pakuje podatke u .data
interface ProductFetchResponse {
    data: Product;
}

const ProductEditAdmin: React.FC = () => {
    // Tipiziramo useParams da TS zna da je id string
    const { id } = useParams<{ id: string }>(); 
    const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/products`;
    const navigate = useNavigate();

    // Fetches existing product data koristeći Product interfejs
    const { data: fetchResponse, loading, error } = useFetch<ProductFetchResponse>(`${BASE_URL}/${id}`); 
    
    // Ako je fetchResponse definisan, uzmi data, inače null
    const product = fetchResponse?.data || null;

    const handleEditSubmit = async (formData: ProductFormData) => {
        try {
            // Slanje PUT zahteva za update
            await axios.put(`${BASE_URL}/${id}`, formData);
            
            alert(`Product "${formData.name}" was successfully updated!`);
            
            // Redirecting back to the product list
            navigate('/admin/products'); 

        } catch (error: any) {
            console.error('Error updating product:', error.response?.data || error.message);
            alert('Product update failed. Check the console.');
        }
    };

    if (loading) return <div className="text-center py-8">Loading data for editing...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error fetching product data.</div>;
    if (!product) return <div className="text-center py-8 text-red-500">Product not found.</div>;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Passing existing data to the form for pre-filling */}
            <ProductForm 
                onSubmit={handleEditSubmit} 
                initialData={product} 
            />
        </div>
    );
};

export default ProductEditAdmin;