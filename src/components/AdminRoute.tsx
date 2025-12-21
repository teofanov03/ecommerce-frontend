// src/components/AdminRoute.tsx
import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute: React.FC = () => {
    // TypeScript ovde automatski prepoznaje tipove iz tvog AuthContext-a
    const { isAuthenticated, user } = useAuthContext();
    
    // Provera: Da li je korisnik prijavljen I da li je uloga 'admin'
    // Koristimo opcionalni upitnik user?.role jer user može biti null
    if (isAuthenticated && user?.role === 'admin') {
        // Ako je Admin, dozvoli prikaz podređenih komponenti (Outlet)
        return <Outlet />;
    } else {
        // Ako nije Admin, preusmeri ga na Login stranicu
        // replace osigurava da korisnik ne može da se vrati "back" na admin stranu nakon preusmeravanja
        return <Navigate to="/login" replace />; 
    }
};

export default AdminRoute;