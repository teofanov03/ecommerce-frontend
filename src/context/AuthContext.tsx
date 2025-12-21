// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextType, User } from '../types/auth';
import axiosInstance from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Inicijalizacija iz localStorage da se ne izloguje na F5
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    // Kad god se token promeni, ažuriraj axios zaglavlje
    useEffect(() => {
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (email: string, password: string) => {
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            setUser(res.data.user);
            setToken(res.data.token);
            toast.success('Welcome back!');
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
        toast.success('Logged out successfully');
    };

    const register = async (data: { name: string; email: string; password: string }) => {
        try {
            const res = await axiosInstance.post('/auth/register', data);
            setUser(res.data.user);
            setToken(res.data.token);
            toast.success('Account created!');
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'admin',
                login,
                logout,
                register
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuthContext must be used within AuthProvider');
    return context;
};