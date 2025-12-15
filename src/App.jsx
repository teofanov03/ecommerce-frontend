/* eslint-disable no-unused-vars */
// src/App.jsx - FINALNA VERZIJA SA AUTH CONTEXT INTEGRACIJOM

import React, { useState } from 'react'; // 💡 DODANO: useState za upravljanje menijem
import { Routes, Route, Link,useNavigate } from 'react-router-dom';
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
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 💡 NOVO STANJE ZA HAMBURGER MENI
    
    const toggleMenu = () => setIsMenuOpen(prev => !prev); // 💡 NOVO: Funkcija za promenu stanja menija
    
    // Status za uslovno renderovanje
    const isLogged = isAuthenticated;
    return (
        <>
            <Toaster 
                position="top-left"
                reverseOrder={false}
            />
            <div className="min-h-screen bg-gray-50 flex flex-col">

                {/* NAVIGACIJA */}
                <header className="bg-white shadow-lg p-4 fixed w-full  z-50 top-0">
                    
                    {/* GLAVNI RED HEATHER-a (LOGO, DESKTOP NAV, DUGMAD, IKONICE) */}
                    <div className="container mx-auto flex justify-between items-center max-w-7xl">
                        
                        {/* 1. LOGO */}
                        <Link to="/" className="text-2xl font-extrabold text-indigo-600 hover:text-indigo-800 transition tracking-wide">
                            NovaShop
                        </Link>

                        {/* 2. CENTRALNA NAVIGACIJA (OSTAVLJENA SAMO ZA DESKTOP) */}
                        {/* Zadržavamo 'hidden md:flex' kako bi se sakrilo na mobilnom */}
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition font-medium border-b-2 border-transparent hover:border-indigo-600 pb-1">Shop</Link>
                            <Link to="/track" className="text-gray-700 hover:text-indigo-600 transition font-medium border-b-2 border-transparent hover:border-indigo-600 pb-1">Track Order</Link>
                            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium border-b-2 border-transparent hover:border-indigo-600 pb-1">About Us</Link>
                        </nav>

                        {/* 3. DESNA STRANA (Akcije i Ikone) */}
                        <div className="flex space-x-6 items-center">
                
                            {isLogged ? (
                                // --- KORISNIK JE LOGOVAN (DESKTOP) ---
                                <>
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
                                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium text-sm cursor-pointer hidden sm:block" // 💡 DODATO: Skriva se na mobilnom
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                // --- NIKO NIJE LOGOVAN (DESKTOP) ---
                                <div className="flex space-x-3 items-center">

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
                            
                            {/* 💡 HAMBURGER IKONA (Vidljiva samo na mobilnom) */}
                            <button 
                                className="sm:hidden p-2 text-gray-700 hover:text-indigo-600 focus:outline-none" 
                                onClick={toggleMenu}
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? (
                                     // Ikona za zatvaranje (X)
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                ) : (
                                    // Ikona za otvaranje (Hamburger)
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                )}
                            </button>

                            {/* Cart Icon (ostaje) */}
                            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition">
                                <CartIcon />
                            </Link>
                        </div>
                    </div>
                    
                    {/* 💡 MOBILNI MENI DROPDOWN (Prikazuje se uslovno na mobilnom) */}
                    {isMenuOpen && (
                        <div className="sm:hidden bg-white shadow-lg pt-2 pb-4 px-4 border-t border-gray-100 z-50">
                            
                            {/* Centralna Navigacija (Mobile) */}
                            <nav className="flex flex-col space-y-2 mb-4">
                                <Link to="/" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 transition font-medium py-2 border-b border-gray-100">Shop</Link>
                                <Link to="/track" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 transition font-medium py-2 border-b border-gray-100">Track Order</Link>
                                <Link to="/about" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 transition font-medium py-2">About Us</Link>
                            </nav>

                            {/* Logged In/Out Akcije (Mobile) - KORIŠĆENJE ISTE LOGIKE */}
                            {isLogged ? (
                                <div className="flex flex-col space-y-3 pt-3 border-t">
                                    <Link 
                                        to={user?.role === 'admin' ? "/admin" : "/user/profile"}
                                        onClick={toggleMenu} // Zatvara meni nakon klika
                                        className="w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
                                    >
                                        {user?.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                                    </Link>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            logout();
                                            toggleMenu(); // Zatvori meni nakon odjave
                                        }}
                                        className="w-full text-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-3 pt-3 border-t">
                                    <Link 
                                        to="/login" 
                                        onClick={toggleMenu} 
                                        className="w-full text-center px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        onClick={toggleMenu} 
                                        className="w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </header>

                <main className="pt-20 grow"> 
                    {/* DEFINICIJA RUTA */}
                    {/* ... (Ostatak Routes ostaje nepromenjen) */}
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/login" element={<LoginPage />} /> 
                        <Route path="/track" element={<OrderTrackingPage />} />
                        <Route path="/about" element={<AboutUsPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route 
                            path="/user/profile" 
                            element={<UserProfilePage />}
                        >
                            <Route index element={<OrderHistory />} /> 
                            <Route path="orders" element={<OrderHistory />} />
                            <Route path="addresses" element={<ShippingAddresses />} />
                            <Route path="settings" element={<AccountSettings />} />
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