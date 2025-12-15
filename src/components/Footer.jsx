// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-10 border-t border-indigo-600 relative z-49 ">
            <div className="container mx-auto max-w-7xl px-6 py-10">
                
                {/* GLAVNI GRID SEKCIJA */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
                    
                    {/* 1. BRAND I KONTAKT */}
                    <div>
                        <h3 className="text-2xl font-extrabold text-indigo-400 mb-4">NovaShop</h3>
                        <p className="text-gray-400 text-sm mb-2">
                            Quality products, exceptional service.
                        </p>
                        <p className="text-sm text-gray-400">
                            Email: support@novashop.com
                        </p>
                        <p className="text-sm text-gray-400">
                            Phone: +381 11 123 456
                        </p>
                    </div>

                    {/* 2. CUSTOMER SERVICE */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Customer Service</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/track" className="text-gray-400 hover:text-indigo-400 transition">
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                {/* Link za stranicu 'About Us' koju ćemo uskoro kreirati */}
                                <Link to="/about" className="text-gray-400 hover:text-indigo-400 transition">
                                    About Us
                                </Link>
                            </li>
                            
                        </ul>
                    </div>

                    {/* 3. QUICK LINKS */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition">
                                    Shop All
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-400 hover:text-indigo-400 transition">
                                    Shopping Cart
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-indigo-400 transition">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 4. SOCIAL MEDIA (Dummy Links) */}
                    <div>
    <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Follow Us</h4>
    <div className="flex space-x-4">
        
        {/* Facebook Icon (Primer) */}
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.77l-.44 2.893h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
        </a>

        {/* Instagram Icon (Primer) */}
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.715.01 3.67.058 1.054.054 1.745.213 2.37.458.74.29 1.258.665 1.76 1.168.5.503.878 1.02 1.167 1.76.245.626.404 1.317.458 2.37.047.955.058 1.24.058 3.67s-.01 2.715-.058 3.67c-.054 1.054-.213 1.745-.458 2.37-.29.74-.665 1.258-1.168 1.76-.503.5-.878.878-1.76 1.167-.626.245-1.317.404-2.37.458-.955.047-1.24.058-3.67.058s-2.715-.01-3.67-.058c-1.054-.054-1.745-.213-2.37-.458-.74-.29-1.258-.665-1.76-1.168-.5-.503-.878-1.02-1.167-1.76-.245-.626-.404-1.317-.458-2.37-.047-.955-.058-1.24-.058-3.67s.01-2.715.058-3.67c.054-1.054.213-1.745.458-2.37.29-.74.665-1.258 1.168-1.76.503-.5.878-.878 1.76-1.167.626-.245 1.317-.404 2.37-.458.955-.047 1.24-.058 3.67-.058zm0 2.1c-2.39 0-2.67.009-3.61.055-1.002.052-1.57.19-1.875.305-.333.125-.563.26-.75.445-.187.187-.32.417-.445.75-.115.305-.253.873-.305 1.875-.046.94-.055 1.22-.055 3.61s.009 2.67.055 3.61c.052 1.002.19 1.57.305 1.875.125.333.26.563.445.75.187.187.417.32.75.445.305.115.873.253 1.875.305.94.046 1.22.055 3.61.055s2.67-.009 3.61-.055c1.002-.052 1.57-.19 1.875-.305.333-.125.563-.26.75-.445.187-.187.32-.417.445-.75.115-.305.253-.873.305-1.875.046-.94.055-1.22.055-3.61s-.009-2.67-.055-3.61c-.052-1.002-.19-1.57-.305-1.875-.125-.333-.26-.563-.445-.75-.187-.187-.417-.32-.75-.445-.305-.115-.873-.253-1.875-.305-.94-.046-1.22-.055-3.61-.055zM12 7.6c-2.43 0-4.4 1.97-4.4 4.4s1.97 4.4 4.4 4.4 4.4-1.97 4.4-4.4-1.97-4.4-4.4-4.4zm0 2.1c1.26 0 2.3 1.04 2.3 2.3s-1.04 2.3-2.3 2.3-2.3-1.04-2.3-2.3 1.04-2.3 2.3-2.3zm5.8-5.3c0 .54-.436.976-.976.976s-.976-.436-.976-.976.436-.976.976-.976.976.436.976.976z" clipRule="evenodd" />
            </svg>
        </a>

    </div>
</div>
                </div>

                {/* AUTORSKA PRAVA SEKCIJA */}
                <div className="pt-6 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} NovaShop. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;