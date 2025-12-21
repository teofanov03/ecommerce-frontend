// src/pages/admin/AdminDashboard.tsx

import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaBoxes, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext.js';

const AdminDashboard: React.FC = () => {
    const { logout, user } = useAuthContext();

    return (
        <div className="flex min-h-screen">

            {/* SIDEBAR */}
            <aside
                className="
                    w-64 
                    bg-gray-800 
                    text-white 
                    p-4 
                    pb-8
                    space-y-4 
                    shadow-xl
                    fixed 
                    left-0 
                    top-20
                    bottom-0
                    overflow-y-auto
                    z-10
                "
            >
                <h2 className="text-2xl font-bold mb-5 text-indigo-400">Admin Panel</h2>
                <p className="text-sm mb-3">Hello, {user?.name?.split(' ')[0]}</p>

                <nav className="space-y-2">
                    <Link
                        to="/admin/products"
                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 transition"
                    >
                        <FaBoxes className="w-5 h-5" />
                        <span>Product Management</span>
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 transition"
                    >
                        <FaClipboardList className="w-5 h-5" />
                        <span>Orders</span>
                    </Link>
                </nav>

                <button
                    onClick={logout}
                    className="flex items-center space-x-2 p-3  mb-8 text-red-400 hover:bg-gray-700 transition rounded-lg w-full"
                >
                    <FaSignOutAlt className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main
                className="
                    flex-1 
                    ml-64
                    p-8
                    bg-gray-100
                "
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;