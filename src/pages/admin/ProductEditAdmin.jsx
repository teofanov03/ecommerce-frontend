// src/pages/admin/ProductEditAdmin.jsx - LOKALIZOVANA VERZIJA (EN)
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm.jsx';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';

const ProductEditAdmin = () => {
    const { id } = useParams(); // Retrieves ID from the URL
    const BASE_URL = 'import.meta.env.VITE_API_BASE_URL/products';
    const navigate = useNavigate();

    // Fetches existing product data
    const { data: fetchResponse, loading, error } = useFetch(`${BASE_URL}/${id}`); 
    const product = fetchResponse?.data || [];
    const handleEditSubmit = async (formData) => {
        try {
            // Sending PUT request for update
            await axios.put(`${BASE_URL}/${id}`, formData);
            
            // PROMENA: Alert poruka
            alert(`Product "${formData.name}" was successfully updated!`);
            
            // Redirecting back to the product list
            navigate('/admin/products'); 

        } catch (error) {
            // PROMENA: Log i Alert poruka
            console.error('Error updating product:', error.response?.data || error.message);
            alert('Product update failed. Check the console.');
        }
    };

    // PROMENA: Učitavanje
    if (loading) return <div className="text-center py-8">Loading data for editing...</div>;
    // PROMENA: Greška pri dohvaćanju
    if (error) return <div className="text-center py-8 text-red-500">Error fetching product data.</div>;
    // PROMENA: Proizvod nije pronađen
    if (!product) return <div className="text-center py-8 text-red-500">Product not found.</div>;


    return (
        <div className="max-w-3xl mx-auto">
            {/* Passing existing data to the form for pre-filling */}
            <ProductForm 
                onSubmit={handleEditSubmit} 
                initialData={product} // Based on your console log, 'product' is the actual object
            />
        </div>
    );
};

export default ProductEditAdmin;