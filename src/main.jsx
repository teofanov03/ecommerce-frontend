// src/main.jsx - ISPRAVNO

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { CartProvider } from './context/CartContext.jsx'; 
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom'; 
// Importujte i Redux Provider ako ga koristite (npr. { Provider as ReduxProvider } from 'react-redux')

ReactDOM.createRoot(document.getElementById('root')).render(
    // 1. BrowserRouter mora biti PRVI da bi sve React Router funkcionalnosti radile
    <BrowserRouter>
        {/* 2. AuthProvider je sledeći, jer koristi useNavigate */}
        <AuthProvider> 
            {/* 3. Ostali konteksti, CartProvideru ne smeta gde se nalazi */}
            <CartProvider>
                <App />
            </CartProvider>
        </AuthProvider>
    </BrowserRouter>
);