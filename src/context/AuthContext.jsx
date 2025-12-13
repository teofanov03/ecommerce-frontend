// src/context/AuthContext.jsx
import React, { createContext, useContext } from 'react';
import useAuth from '../hooks/useAuth';

const AuthContext = createContext();

// Provider Komponenta
export const AuthProvider = ({ children }) => {
    const authState = useAuth(); 

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook za korišćenje konteksta
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};