// src/pages/admin/ProductCreateAdmin.jsx - NOVA, ČISTA VERZIJA
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm.jsx'; // ✅ Uvozimo novu komponentu
// fileToBase64 više nije potreban ovde, jer je premešten u ProductForm.jsx

const ProductCreateAdmin = () => {
    const navigate = useNavigate();
    const BASE_URL = 'http://localhost:5000/api/v1'; 

    const handleCreateSubmit = async (formData) => {
        try {
            // formData već sadrži Base64 string u polju 'image'
            await axios.post(`${BASE_URL}/products`, formData); 
            
            // Koristimo Toaster umesto alert (ako je instaliran, inače vratite alert)
            // toast.success('Product successfully created!'); 
            alert('Product successfully created!');
            navigate('/admin/products'); // Vrati se na listu proizvoda
        } catch (err) {
            console.error("Product creation failed:", err.response?.data || err.message);
            // Bacamo grešku koju će ProductForm uhvatiti i prikazati korisniku
            throw new Error(err.response?.data?.message || 'Failed to create product.'); 
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pt-20 max-w-2xl">
            {/* Koristimo jedinstvenu formu bez initialData */}
            <ProductForm onSubmit={handleCreateSubmit} />
        </div>
    );
};

export default ProductCreateAdmin;