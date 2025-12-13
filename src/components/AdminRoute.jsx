// src/components/AdminRoute.jsx
import React from 'react';
import { useAuthContext } from '../context/AuthContext.jsx';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const { isAuthenticated, user } = useAuthContext();
    
    // Provera: Da li je korisnik prijavljen I da li je uloga 'admin'
    if (isAuthenticated && user?.role === 'admin') {
        // Ako je Admin, dozvoli prikaz podređenih komponenti (Outlet)
        return <Outlet />;
    } else {
        // Ako nije Admin, preusmeri ga na Login stranicu
        // U Route path možete podesiti i da ga preusmeri na HomePage
        return <Navigate to="/login" replace />; 
    }
};

export default AdminRoute;