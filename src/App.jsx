// src/App.jsx - FINALNA VERZIJA SA AUTH CONTEXT INTEGRACIJOM

import React from 'react';
import {  Routes, Route, Link,useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CartIcon from './components/CartIcon'; 
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import './index.css'; 

// 💡 UVEZITE AUTH CONTEXT ZA GLOBALNO STANJE LOGOVANJA
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
import RegisterPage from './pages/RegisterPage.jsx';
import OrderHistory from './components/user/OrderHistory.jsx'; 
import ShippingAddresses from './components/user/ShippingAddresses.jsx';
import AccountSettings from './components/user/AccountSettings.jsx';
import Footer from './components/Footer';
import UserProfilePage from './pages/UserProfilePage.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
    
    // 💡 KORISTIMO AUTH CONTEXT ZA PRAĆENJE STANJA
    const { isAuthenticated, logout, user } = useAuthContext();
    
    // Status za uslovno renderovanje
    const isLogged = isAuthenticated;
    return (
        <>
            <Toaster 
                position="top-right"
                reverseOrder={false}
            />
            <div className="min-h-screen bg-gray-50 flex flex-col">

                {/* NAVIGACIJA */}
                <header className="bg-white shadow-lg p-4 fixed w-full z-20 top-0">
                    <div className="container mx-auto flex justify-between items-center max-w-7xl">
                        
                        {/* 1. LOGO */}
                        <Link to="/" className="text-2xl font-extrabold text-indigo-600 hover:text-indigo-800 transition tracking-wide">
                            NovaShop
                        </Link>

                        {/* 2. CENTRALNA NAVIGACIJA */}
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition font-medium border-b-2 border-transparent hover:border-indigo-600 pb-1">Shop</Link>
                            <Link to="/track" className="text-gray-700 hover:text-indigo-600 transition font-medium border-b-2 border-transparent hover:border-indigo-600 pb-1">Track Order</Link>
                            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium border-b-2 border-transparent hover:border-indigo-600 pb-1">About Us</Link>
                        </nav>

                        {/* 3. DESNA STRANA (Admin Actions) */}
                        <div className="flex space-x-6 items-center">
    
                        {isLogged ? (
                            // --- KORISNIK JE LOGOVAN: Prikaži Dashboard i Logout ---
                            <>
                                {/* Ako je prijavljen, možete prikazati i "User Dashboard" ili "Order History" link */}
                                <Link 
                                    to={user?.role === 'admin' ? "/admin" : "/user/profile"} // 💡 U zavisnosti od uloge
                                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium text-sm hidden sm:block"
                                >
                                    {user?.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                                </Link>
                                
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Logout button clicked for user:', user?.role);
                                        logout();
                                    }}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium text-sm cursor-pointer"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            // --- NIKO NIJE LOGOVAN: Prikaži Login i Register ---
                          <div className="flex space-x-3 items-center">

                {/* 1. 📝 LOGIN: Secondary Button (Manje istaknuto dugme) */}
                <Link 
                    to="/login" 
                    className="
                        px-3 py-1 
                        text-indigo-600 border border-indigo-600 rounded-md 
                        hover:bg-indigo-50 transition 
                        font-medium text-sm 
                        hidden sm:block
                    "
                >
                    Login
                </Link>

                {/* 2. 📝 REGISTER: Primary Button (Istaknuto dugme) - ostaje isto */}
                <Link 
                    to="/register" 
                    className="
                        px-3 py-1 
                        bg-indigo-600 text-white rounded-md 
                        hover:bg-indigo-700 transition 
                        font-medium text-sm 
                        hidden sm:block
                    "
                >
                    Register
                </Link>

            </div>
                        )}
                        
                        {/* Cart Icon (ostaje) */}
                        <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition">
                            <CartIcon />
                        </Link>
                        
                    </div>
                    </div>
                </header>

                <main className="pt-20 grow"> 
                    {/* DEFINICIJA RUTA */}
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/login" element={<LoginPage />} /> {/* LoginPage ne prima propove */}
                        <Route path="/track" element={<OrderTrackingPage />} />
                        <Route path="/about" element={<AboutUsPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route 
                            path="/user/profile" 
                            element={<UserProfilePage />}
                        >
                            {/* Podrazumevana pod-ruta (index) - Prikazuje se kad je URL: /user/profile */}
                            <Route index element={<OrderHistory />} /> 

                            {/* Detaljne pod-rute */}
                            <Route path="orders" element={<OrderHistory />} />
                            <Route path="addresses" element={<ShippingAddresses />} />
                            <Route path="settings" element={<AccountSettings />} />

                            {/* Možete dodati i rutu za grešku unutar profila */}
                            {/* <Route path="*" element={<h1>404 - Profile Subpage Not Found</h1>} /> */}
                        </Route>
                  
                        {/* ADMIN RUTE */}
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