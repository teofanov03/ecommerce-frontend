/* eslint-disable no-irregular-whitespace */
// src/pages/HomePage.tsx - KOMPLETAN KOD SA FILTERIMA, SORTIRANJEM I PAGINACIJOM

import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import useFetch from '../hooks/useFetch'; 
import { Link } from 'react-router-dom';
import type { Product } from '../types/Product';
// Hardkodovana lista kategorija
const categories = ['All', 'Electronics', 'Clothing', "Home & Living", 'Accessories',"Footwear","Sports","Books","Beauty","Toys"];
const BASE_URL = '/products'; // Relativna putanja, axiosInstance će dodati bazni URL

const HomePage = () => {
    
    // ----------------------------------------------------
    // 1. STANJE (STATE) ZA FILTERE I PAGINACIJU
    // ----------------------------------------------------
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('latest');
    
    // PAGINACIJA STANJE
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 12; // Konstantan broj proizvoda po stranici
    
    // ----------------------------------------------------
    // 2. KREIRANJE URL-a SA FILTERIMA I PAGINACIJOM
    // ----------------------------------------------------
    const filterQuery = useMemo(() => {
        const params = [];
        
        // Filter po Kategoriji
        if (selectedCategory !== 'All') {
            const encodedCategory = encodeURIComponent(selectedCategory);
            params.push(`category=${encodedCategory}`);
        }

        // Filter po Ceni (Min i Max)
        if (minPrice && parseFloat(minPrice) >= 0) {
            params.push(`price[gte]=${minPrice}`); 
        }
        if (maxPrice && parseFloat(maxPrice) >= 0) {
            params.push(`price[lte]=${maxPrice}`); 
        }
        
        // Sortiranje
        if (sortBy) {
            params.push(`sort=${sortBy}`);
        }
        
        // 💡 PAGINACIJA PARAMETRI
        params.push(`page=${currentPage}`);
        params.push(`limit=${productsPerPage}`);

        // Kreiranje kompletnog URL-a za dohvatanje
        return `${BASE_URL}?${params.join('&')}`;

    // ✅ ISPRAVKA ZAVISNOSTI: Uključujemo SVE state varijable koje se koriste
    }, [selectedCategory, minPrice, maxPrice, sortBy, currentPage, productsPerPage]); 

    // ----------------------------------------------------
    // 3. DOHVATANJE PROIZVODA
    // ----------------------------------------------------
    // 💡 useFetch sada vraća ceo odgovor (fetchResponse) koji sadrži podatke o paginaciji
    const { data: fetchResponse, loading, error } = useFetch<{ data: Product[]; totalPages: number }>(filterQuery);
    
    // Izdvajanje podataka
    const products: Product[] = fetchResponse?.data || [];
    const totalPages: number = fetchResponse?.totalPages || 1;
    
    // ----------------------------------------------------
    // 4. FUNKCIJE ZA RUKOVANJE
    // ----------------------------------------------------
    
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            // Skrolovanje na vrh liste proizvoda radi boljeg UX-a
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    const handleResetFilters = () => {
        setSelectedCategory('All');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('latest');
        setCurrentPage(1); // KLJUČNO: Resetovanje stranice
    };
    
    // ----------------------------------------------------
    // 5. RENDER KOMPONENTE
    // ----------------------------------------------------
    
    return (
        <div className="container mx-auto px-4 py-12 pt-24 min-h-screen max-w-7xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Our Products</h1>
            
            <div className="flex flex-col lg:flex-row lg:space-x-8">
                
                {/* -------------------- LEVI PANEL: FILTERI -------------------- */}
                <div className="lg:w-1/4 p-6 bg-white shadow-xl rounded-lg mb-8 lg:mb-0 lg:h-[calc(100vh-100px)] overflow-y-auto lg:sticky lg:top-24">
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Filter Products</h2>
                    
                    {/* A. FILTER PO KATEGORIJI */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Category</h3>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setCurrentPage(1); // Resetuj stranicu pri promeni filtera
                                    }}
                                    className={`w-full text-left py-2 px-3 rounded-lg transition duration-150 text-sm font-medium ${
                                        selectedCategory === cat 
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* B. FILTER PO CENI */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Price Range ($)</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-500 mb-1">Min Price</label>
                                <input
                                    type="number"
                                    id="minPrice"
                                    value={minPrice}
                                    onChange={(e) => {
                                        setMinPrice(e.target.value);
                                        setCurrentPage(1); // Resetuj stranicu pri promeni filtera
                                    }}
                                    placeholder="e.g. 10"
                                    min="0"
                                    step="1"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-500 mb-1">Max Price</label>
                                <input
                                    type="number"
                                    id="maxPrice"
                                    value={maxPrice}
                                    onChange={(e) => {
                                        setMaxPrice(e.target.value);
                                        setCurrentPage(1); // Resetuj stranicu pri promeni filtera
                                    }}
                                    placeholder="e.g. 500"
                                    min="0"
                                    step="1"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* C. SORTIRANJE */}
                    <div className="mb-6 border-t pt-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Sort By</h3>
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1); // Resetuj stranicu pri promeni sortiranja
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                            <option value="latest">Latest Arrivals</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>

                    {/* D. DUGME ZA RESETOVANJE FILTERA */}
                    <button
                        onClick={handleResetFilters}
                        className="w-full py-2 px-4 rounded-lg text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 transition"
                    >
                        Reset All
                    </button>

                </div>

                {/* -------------------- DESNI PANEL: LISTA PROIZVODA -------------------- */}
                <div className="lg:w-3/4">
                    {loading && <div className="text-center text-xl text-indigo-600 py-12">Loading products...</div>}
                    {error && <div className="text-center text-xl text-red-500 py-12">Error fetching products: {error.message}</div>}
                    
                    {products && products.length === 0 && !loading && (
                            <div className="text-center text-xl text-gray-500 py-12">
                                No products found matching the filter criteria.
                            </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 items-stretch">
                        {products?.map((product: Product) => (
                           
                            <Link key={product._id} to={`/product/${product._id}`} className="h-full">
                                <ProductCard product={product} />
                            </Link>
                        ))}
                    </div>
                    
                    {/* -------------------- PAGINACIJA -------------------- */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            
                            {/* Dugme Prethodna */}
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

                            {/* Prikaz brojeva stranica (Prikazujemo 1, poslednju, i +/- 1 oko trenutne) */}
                            {[...Array(totalPages).keys()].map(index => {
                                const pageNumber = index + 1;
                                
                                const shouldDisplay = 
                                    pageNumber === 1 || 
                                    pageNumber === totalPages || 
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

                                if (!shouldDisplay) return null; // Preskače nebitne brojeve
                                
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                            pageNumber === currentPage 
                                            ? 'bg-indigo-200 text-indigo-800 ring-2 ring-indigo-500' 
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            {/* Dugme Sledeća */}
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
                    {/* -------------------- KRAJ PAGINACIJE -------------------- */}

                </div>

            </div>
        </div>
    );
};

export default HomePage;