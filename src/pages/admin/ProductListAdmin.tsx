// src/pages/admin/ProductListAdmin.tsx
import React, { useState, useMemo } from 'react';
import useFetch from '../../hooks/useFetch';
import axiosInstance from '../../api/axios'; // Dodajemo naš axios sa tokenom
import { Link } from 'react-router-dom';
import { Product } from '../../types/Product';

interface ProductsFetchResponse {
    data: Product[];
    totalPages: number;
    currentPage: number;
}

const ProductListAdmin: React.FC = () => {
    // 1. Uklonili smo BASE_URL jer axiosInstance to već ima
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 10;
    
    const filterQuery = useMemo(() => {
        const params = [];
        params.push(`page=${currentPage}`);
        params.push(`limit=${productsPerPage}`);
        
        // Putanja je sada relativna u odnosu na axiosInstance
        return `/products?${params.join('&')}`;
    }, [currentPage, productsPerPage]);

    // OBAVEZNO: Ovde takođe treba paziti na useFetch. 
    // Ako useFetch unutra koristi običan fetch/axios bez tokena, 
    // dobijaćeš 401 kad backend bude zaštićen. 
    // Za sada ostavljamo ovako dok ne vidimo kako se useFetch ponaša.
    const { data: fetchResponse, loading, error, refetch } = useFetch<ProductsFetchResponse>(filterQuery); 
    console.log("Šta je stiglo sa servera:", fetchResponse);
    const products = fetchResponse?.data || [];
    const totalPages = fetchResponse?.totalPages || 1; 

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete the product: ${name}?`)) {
            try {
                // 2. Korišćenje axiosInstance.delete (šalje token automatski)
                await axiosInstance.delete(`/products/${id}`); 
                alert(`Product ${name} successfully deleted.`);
                refetch();
            } catch (err: any) {
                console.error('Error during deletion:', err);
                alert('Deletion failed. Check the console.');
            }
        }
    };
    
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
            <Link to="/admin/products/new">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer">
                    + Add New Product
                </button>
            </Link>
        </div>
    );

    // Ostatak tvog JSX-a ostaje ISTI (tabele, dugmići, paginacija)...
    if (loading && products.length === 0) {
        return (
            <div>
                {renderHeader()}
                <div className="text-center py-8">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                {renderHeader()}
                <div className="text-center py-8 text-red-500">Error fetching products.</div>
            </div>
        );
    }

    return (
        <div>
            {renderHeader()}
            
            {products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No products found. Click "Add New Product" to create one.
                </div>
            ) : (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product._id.substring(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.stock}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center space-x-2">
                                            <Link to={`/admin/products/edit/${product._id}`}>
                                                <button className="text-white bg-indigo-600 hover:bg-indigo-700 py-1.5 px-4 rounded-md transition duration-150 shadow-md inline-flex items-center cursor-pointer">
                                                    Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id, product.name)}
                                                className="ml-3 text-white bg-red-600 hover:bg-red-700 py-1.5 px-4 rounded-md transition duration-150 shadow-md inline-flex items-center cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination - ostaje isto */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                    currentPage === 1 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                &laquo; Previous
                            </button>
                            <span className="px-4 py-2 text-sm font-medium text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                    currentPage === totalPages 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                Next &raquo;
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductListAdmin;