// src/components/ProductForm.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import fileToBase64 from '../utils/fileToBase64';
import { Product } from '../types/Product';

const categories = [
    'Electronics', 'Clothing', "Home & Living", 'Accessories', 
    "Footwear", "Sports", "Books", "Beauty", "Toys"
];

// Tip za podatke u formi (slično kao Product, ali price i stock mogu biti stringovi dok se kucaju)
interface FormDataState {
    name: string;
    description: string;
    price: string | number;
    category: string;
    stock: string | number;
    image: string;
}

interface ProductFormProps {
    onSubmit: (formData: any) => Promise<void>;
    initialData?: Partial<Product>; // Partial jer u Create modu nemamo sva polja
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState<FormDataState>({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '', 
        category: initialData.category || 'Electronics',
        stock: initialData.stock || '', 
        image: initialData.image || '', 
    });
    
    const [imagePreview, setImagePreview] = useState<string | null>(initialData.image || null); 
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price ?? '',
                category: initialData.category || 'Electronics',
                stock: initialData.stock ?? '',
                image: initialData.image || '',
            });
            setImagePreview(initialData.image || null);
        }
    }, [initialData]);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.image) {
            setError("Please fill out all required fields and upload an image.");
            setLoading(false);
            return;
        }

        try {
            await onSubmit(formData); 
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during submit.');
        } finally {
            setLoading(false);
        }
    };

    const buttonText = initialData && (initialData as any)._id ? 'Update Product' : 'Create Product';
    const formTitle = initialData && (initialData as any)._id ? 'Edit Product' : 'Create New Product';

    return (
        <div className="bg-white p-6 shadow-xl rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{formTitle}</h1>
            
            <form onSubmit={handleSubmit}>
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
                
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    ></textarea>
                </div>
                
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
                
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="imageUpload">
                        Product Image
                    </label>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                    />
                    
                    {imagePreview && (
                        <div className="mt-4 p-2 border border-gray-200 rounded-lg inline-block">
                            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                        </div>
                    )}
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg font-medium">
                        Error: {error}
                    </div>
                )}

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