import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext'; 
// Uvozite ostale komponente za pod-rute

const UserProfilePage = () => {
    const { user } = useAuthContext();

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user?.name}</h1>

            <div className="flex flex-col md:flex-row gap-6">
                
                {/* 1. SIDEBAR NAVIGACIJA */}
                <aside className="w-full md:w-64 bg-white p-4 rounded-lg shadow">
                    <nav className="space-y-2">
                        {/* NavLink se koristi da automatski naglasi aktivnu rutu */}
                        <NavLink to="orders" end className={({ isActive }) => `block p-3 rounded-md transition ${isActive ? 'bg-indigo-500 text-white font-medium' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                            Order History
                        </NavLink>
                        <NavLink to="addresses" className={({ isActive }) => `block p-3 rounded-md transition ${isActive ? 'bg-indigo-500 text-white font-medium' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                            Shipping Addresses
                        </NavLink>
                        <NavLink to="settings" className={({ isActive }) => `block p-3 rounded-md transition ${isActive ? 'bg-indigo-500 text-white font-medium' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                            Account Settings
                        </NavLink>
                    </nav>
                </aside>

                {/* 2. GLAVNI SADRŽAJ (dinamički se menja) */}
                <main className="grow bg-white p-6 rounded-lg shadow">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserProfilePage;