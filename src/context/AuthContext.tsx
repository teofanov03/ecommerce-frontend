import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextType, User } from '../types/auth';
import axiosInstance from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

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
            
            // Provera: Da li backend šalje podatke u res.data.user ili samo res.data?
            const userData = res.data.user || res.data;
            const userToken = res.data.token;

            if (userToken) {
                // Prvo postavljamo token da bi axios bio spreman
                setToken(userToken);
                // Zatim postavljamo user-a da bi trigerovali re-render
                setUser(userData);
                
                toast.success('Welcome back!');
                return true;
            }
            return false;
        } catch (err: any) {
            console.error("Login Error Details:", err.response?.data);
            toast.error(err.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        toast.success('Logged out successfully');
    };

    const register = async (data: { name: string; email: string; password: string }) => {
        try {
            const res = await axiosInstance.post('/auth/register', data);
            const userData = res.data.user || res.data;
            const userToken = res.data.token;

            setToken(userToken);
            setUser(userData);
            
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
                isAuthenticated: !!user && !!token, // Proveravamo oba
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