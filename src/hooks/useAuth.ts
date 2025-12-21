// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContextType, User } from '../types/auth';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

interface AuthState {
    token: string | null;
    user: User | null;
}

const getInitialAuthState = (): AuthState => {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('authUser');

    let user: User | null = null;
    if (userJson) {
        try {
            user = JSON.parse(userJson);
        } catch (e) {
            console.error("Error parsing user data from localStorage:", e);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        }
    }

    return { token, user };
};

const useAuth = (): AuthContextType => {
    const [auth, setAuth] = useState<AuthState>(getInitialAuthState);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [auth.token]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, { email, password });
            const { token, _id, name, role } = response.data.data;

            if (!token || !_id || !name) throw new Error('Missing user data');

            const user: User = {
                _id, name, role: role || 'user',
                email: ''
            };
            setAuth({ token, user });
            localStorage.setItem('authToken', token);
            localStorage.setItem('authUser', JSON.stringify(user));

            toast.success(`Welcome back, ${user.name}!`);

            if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
            else navigate('/', { replace: true });

            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed.');
            return false;
        }
    };

    const register = async (data: { name: string; email: string; password: string }): Promise<boolean> => {
        try {
            const response = await axios.post(`${BASE_URL}/register`, data);
            const { token, _id, name, role } = response.data.data;

            if (!token || !_id || !name) throw new Error('Missing user data');

            const user: User = {
                _id, name, role: role || 'user',
                email: ''
            };
            setAuth({ token, user });
            localStorage.setItem('authToken', token);
            localStorage.setItem('authUser', JSON.stringify(user));

            toast.success(`Registration successful! Welcome, ${user.name}.`);
            setTimeout(() => window.location.href = '/', 500);

            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed.');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        delete axios.defaults.headers.common['Authorization'];
        setAuth({ token: null, user: null });
        toast.success("You have been logged out.");
        window.location.href = '/login';
    };

    const isAdmin = auth.user?.role === 'admin';

    return { 
        user: auth.user,
        token: auth.token,
        isAuthenticated: !!auth.token,
        isAdmin,
        login,
        logout,
        register
    };
};

export default useAuth;
