// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Skinuta ekstenzija .jsx
import './index.css';

import { CartProvider } from './context/CartContext'; 
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom'; 

// Koristimo "as HTMLElement" da TypeScript ne bi mislio da je root null
const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider> 
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);