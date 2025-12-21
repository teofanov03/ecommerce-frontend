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
        
        // Backend struktura: res.data je { success: true, data: { name, role, token, ... } }
        const responseData = res.data.data; 

        if (responseData && responseData.token) {
            // 1. Postavljamo token (da bi Axios dobio Authorization header)
            setToken(responseData.token);
            
            // 2. Postavljamo korisnika (ovo menja isAuthenticated u true)
            setUser({
                _id: responseData._id,
                name: responseData.name,
                email: responseData.email,
                role: responseData.role
            });

            toast.success('Welcome back!');
            return true;
        } else {
            console.error("Token nije pronađen u response.data.data");
            return false;
        }
    } catch (err: any) {
        console.error("Login error:", err.response?.data || err.message);
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
        
        // Backend vraća: { success: true, data: { _id, name, email, role, token } }
        const responseData = res.data.data;

        if (responseData && responseData.token) {
            // 1. Prvo postavljamo token
            setToken(responseData.token);
            
            // 2. Postavljamo user objekat (bez tokena unutar njega, da bude čistije)
            const { token, ...userWithoutToken } = responseData;
            setUser(userWithoutToken);
            
            toast.success('Account created successfully!');
            return true;
        } else {
            console.error("Registration success, but no token received");
            return false;
        }
    } catch (err: any) {
        console.error("Registration error:", err.response?.data || err.message);
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