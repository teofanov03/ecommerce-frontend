// src/components/ProductForm.jsx - JEDINSTVENA, AŽURIRANA FORMA
import React, { useState, useEffect } from 'react';
import fileToBase64 from '../utils/fileToBase64'; // Uvezite Base64 funkciju

const categories = ['Electronics', 'Clothing', "Home & Living", 'Accessories',"Footwear","Sports","Books","Beauty","Toys"];

// Prima onSubmit i initialData
const ProductForm = ({ onSubmit, initialData = {} }) => {
    // Stanje inicijalizujemo na osnovu initialData (za Edit) ili na prazne vrednosti (za Create)
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '', // Ostavljamo prazan string da bi input polje bilo prazno u CREATE modu
        category: initialData.category || 'Electronics',
        stock: initialData.stock || '', // Ostavljamo prazan string
        image: initialData.image || '', // Base64 string ili URL
    });
    
    // Stanje za prikaz slike: koristimo postojeću sliku ako postoji
    const [imagePreview, setImagePreview] = useState(initialData.image || null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sinhronizacija (Potrebno samo ako se initialData menja nakon inicijalnog renderovanja, ali je dobra praksa)
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || '',
                category: initialData.category || 'Electronics',
                stock: initialData.stock || '',
                image: initialData.image || '',
            });
            setImagePreview(initialData.image || null);
        }
    }, [initialData]);

    // ------------------------------------------------------------------------
    // RUKOVANJE SLIKOM: Ažurira state i preview sa Base64 (Preuzeto iz ProductCreateAdmin.jsx)
    // ------------------------------------------------------------------------
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64String = await fileToBase64(file);
                setFormData(prev => ({ ...prev, image: base64String }));
                setImagePreview(base64String); 
            } catch (err) {
                console.error("Error converting file to Base64:", err);
                setError("Could not read file. Please try a different one.");
            }
        }
    };

    // ------------------------------------------------------------------------
    // OPŠTI HANDLER ZA PROMENU INPUTA
    // ------------------------------------------------------------------------
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ------------------------------------------------------------------------
    // SUBMIT RUKOVATELJ
    // ------------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Dodatna Validacija
        if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.image) {
            setError("Please fill out all required fields and upload an image.");
            setLoading(false);
            return;
        }

        try {
            await onSubmit(formData); 
        } catch (err) {
            setError(err.message || 'An unexpected error occurred during submit.');
        } finally {
            setLoading(false);
        }
    };

    const buttonText = initialData && initialData._id ? 'Update Product' : 'Create Product';
    const formTitle = initialData && initialData._id ? 'Edit Product' : 'Create New Product';

    return (
        <div className="bg-white p-6 shadow-xl rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{formTitle}</h1>
            
            <form onSubmit={handleSubmit}>
                
                {/* Naziv Proizvoda */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                
                {/* Opis (preuzet stil iz ProductCreateAdmin.jsx) */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    ></textarea>
                </div>
                
                {/* CENA, KATEGORIJA, STOCK (preuzet stil iz ProductCreateAdmin.jsx) */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="price">Price ($)</label>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required min="0" step="any"/>
                    </div>
                    
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="category">Category</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="stock">Stock</label>
                        <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required min="0"/>
                    </div>
                </div>
                
                {/* FILE INPUT I PREVIEW (preuzet stil iz ProductCreateAdmin.jsx) */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="imageUpload">
                        Product Image
                    </label>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleFileChange}
                        // U Edit modu, polje za fajl nije obavezno. U Create modu jeste (zbog validacije u handleSubmit)
                        className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                    />
                    
                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="mt-4 p-2 border border-gray-200 rounded-lg inline-block">
                            {/* Slika se prikazuje bez obzira da li je Base64 ili URL */}
                            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                        </div>
                    )}
                </div>
                
                {/* Greške */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg font-medium">
                        Error: {error}
                    </div>
                )}

                {/* Dugme za Slanje */}
                <button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-lg text-white font-bold transition duration-150 cursor-pointer ${
                        loading 
                            ? 'bg-indigo-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                    }`}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : buttonText}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;