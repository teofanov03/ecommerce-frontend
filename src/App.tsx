// src/App.tsx
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CartIcon from './components/CartIcon'; 
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import './index.css'; 

import { useAuthContext } from './context/AuthContext'; 

import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductListAdmin from './pages/admin/ProductListAdmin'; 
import OrderListAdmin from './pages/admin/OrderListAdmin';
import OrderDetailPageAdmin from './pages/admin/OrderDetailPageAdmin'; 
import ProductCreateAdmin from './pages/admin/ProductCreateAdmin'; 
import ProductEditAdmin from './pages/admin/ProductEditAdmin';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AboutUsPage from './pages/AboutUsPage';
import RegisterPage from './pages/RegisterPage';
import OrderHistory from './components/user/OrderHistory'; 
import ShippingAddresses from './components/user/ShippingAddresses';
import AccountSettings from './components/user/AccountSettings';
import Footer from './components/Footer';
import UserProfilePage from './pages/UserProfilePage';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuthContext();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    
    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    
    return (
        <>
            <Toaster position="top-left" reverseOrder={false} />
            <div className="min-h-screen bg-gray-50 flex flex-col">

                {/* NAVIGACIJA */}
                <header className="bg-white shadow-lg p-4 fixed w-full z-50 top-0">
                    <div className="container mx-auto flex justify-between items-center max-w-7xl">
                        
                        {/* 1. LOGO */}
                        <Link to="/" className="text-2xl font-extrabold text-indigo-600 hover:text-indigo-800 transition tracking-wide">
                            NovaShop
                        </Link>

                        {/* 2. DESKTOP NAV */}
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition font-medium border-b-2 border-transparent hover:border-indigo-600 pb-1">Shop</Link>
                            <Link to="/track" className="text-gray-700 hover:text-indigo-600 transition font-medium border-b-2 border-transparent hover:border-indigo-600 pb-1">Track Order</Link>
                            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium border-b-2 border-transparent hover:border-indigo-600 pb-1">About Us</Link>
                        </nav>

                        {/* 3. DESNA STRANA */}
                        <div className="flex space-x-6 items-center">
                            {isAuthenticated ? (
                                <>
                                    <Link 
                                        to={user?.role === 'admin' ? "/admin" : "/user/profile"}
                                        className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium text-sm hidden sm:block"
                                    >
                                        {user?.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                                    </Link>
                                    
                                    <button 
                                        type="button"
                                        onClick={() => logout()}
                                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium text-sm cursor-pointer hidden sm:block"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex space-x-3 items-center">
                                    <Link to="/login" className="px-3 py-1 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition font-medium text-sm hidden sm:block">
                                        Login
                                    </Link>
                                    <Link to="/register" className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium text-sm hidden sm:block">
                                        Register
                                    </Link>
                                </div>
                            )}
                            
                            <button className="sm:hidden p-2 text-gray-700" onClick={toggleMenu}>
                                {isMenuOpen ? "✕" : "☰"}
                            </button>

                            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition">
                                <CartIcon />
                            </Link>
                        </div>
                    </div>

                    {/* MOBILE MENU */}
                    {isMenuOpen && (
                        <div className="sm:hidden bg-white shadow-lg pt-2 pb-4 px-4 border-t border-gray-100">
                            <nav className="flex flex-col space-y-2 mb-4">
                                <Link to="/" onClick={toggleMenu} className="py-2 border-b border-gray-100">Shop</Link>
                                <Link to="/track" onClick={toggleMenu} className="py-2 border-b border-gray-100">Track Order</Link>
                                <Link to="/about" onClick={toggleMenu} className="py-2">About Us</Link>
                            </nav>
                            {isAuthenticated ? (
                                <div className="flex flex-col space-y-3">
                                    <Link to={user?.role === 'admin' ? "/admin" : "/user/profile"} onClick={toggleMenu} className="w-full text-center py-2 bg-indigo-600 text-white rounded-md">
                                        Dashboard
                                    </Link>
                                    <button onClick={() => { logout(); toggleMenu(); }} className="w-full py-2 bg-red-600 text-white rounded-md">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-3">
                                    <Link to="/login" onClick={toggleMenu} className="w-full text-center py-2 text-indigo-600 border border-indigo-600 rounded-md">Login</Link>
                                    <Link to="/register" onClick={toggleMenu} className="w-full text-center py-2 bg-indigo-600 text-white rounded-md">Register</Link>
                                </div>
                            )}
                        </div>
                    )}
                </header>

                <main className="pt-20 grow"> 
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/login" element={<LoginPage />} /> 
                        <Route path="/track" element={<OrderTrackingPage />} />
                        <Route path="/about" element={<AboutUsPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        
                        <Route path="/user/profile" element={<UserProfilePage />}>
                            <Route index element={<OrderHistory />} /> 
                            <Route path="orders" element={<OrderHistory />} />
                            <Route path="addresses" element={<ShippingAddresses />} />
                            <Route path="settings" element={<AccountSettings />} />
                        </Route>
                    
                        <Route path="/admin" element={<AdminRoute />}>
                            <Route element={<AdminDashboard />}> 
                                <Route index element={<ProductListAdmin />} /> 
                                <Route path="products" element={<ProductListAdmin />} />
                                <Route path="products/new" element={<ProductCreateAdmin />} /> 
                                <Route path="products/edit/:id" element={<ProductEditAdmin />} />
                                <Route path="orders/:id" element={<OrderDetailPageAdmin />} />
                                <Route path="orders" element={<OrderListAdmin />} />
                            </Route>
                        </Route>
                    </Routes>
                </main>
                <Footer />
            </div>
        </>
    );
}

export default App;