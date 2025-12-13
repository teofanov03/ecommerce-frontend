// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const BASE_URL = 'http://localhost:5000/api/v1/auth'; 

const getInitialAuthState = () => {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('authUser');
    
    let user = null;
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

const useAuth = () => {
    const [auth, setAuth] = useState(getInitialAuthState);
    const navigate = useNavigate();

    // 🔥 ADD THIS - Configure axios headers when component mounts or token changes
    useEffect(() => {
        if (auth.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
            console.log('✅ Axios configured with token');
        } else {
            delete axios.defaults.headers.common['Authorization'];
            console.log('❌ No token, axios headers cleared');
        }
    }, [auth.token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, { email, password });
            
            // Check if response has the expected structure
            if (!response.data || !response.data.data) {
                throw new Error('Invalid response from server');
            }
            
            const { token, _id, name, role } = response.data.data;
            
            if (!token || !_id || !name) {
                throw new Error('Missing user data in response');
            }
            
            const user = { 
                _id, 
                name, 
                role: role || 'user'
            };
            
            // Update state and storage
            setAuth({ token, user });
            localStorage.setItem('authToken', token);
            localStorage.setItem('authUser', JSON.stringify(user));

            // Show success message (only one)
            toast.success(`Welcome back, ${user.name}!`);
            
            // Navigate based on role (use replace to avoid back button issues)
            if (user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
            
            return true;
        } catch (error) {
            // Only show error if it's a real error (not a navigation issue)
            if (error.response) {
                const message = error.response.data?.error || error.response.data?.message || 'Login failed. Please check credentials.';
                toast.error(message);
            } else {
                toast.error('Login failed. Please try again.');
            }
            return false;
        }
    };
  // Updated register function in useAuth.js
const register = async ({ name, email, password }) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, { name, email, password });

        console.log('Registration response:', response.data); // DEBUG

        // Check the actual structure of the response
        if (!response.data || !response.data.data) {
            throw new Error('Invalid response from server');
        }

        // Backend returns { token, _id, name, role } like login does
        const { token, _id, name: userName, role } = response.data.data;
        
        if (!token || !_id || !userName) {
            throw new Error('Missing user data in response');
        }
        
        const user = { 
            _id, 
            name: userName, 
            role: role || 'user'
        };

        setAuth({ token, user });
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(user));

        toast.success(`Registration successful! Welcome, ${user.name}.`);

        // Use window.location for hard redirect (like logout does)
        setTimeout(() => {
            window.location.href = window.location.origin + '/';
        }, 500);

        return true;
    } catch (error) {
        console.error('Registration error:', error); // Better error logging
        
        if (error.response && error.response.status >= 400) {
            const message = error.response.data?.message || 'Registration failed. Check if user already exists.';
            toast.error(message);
        } else if (error.message) {
            toast.error(error.message);
        } else {
            toast.error('Registration failed. Please try again.');
        }
        return false;
    }
};

    const logout = () => {
        console.log('🔄 Logout function called');
        console.log('📍 Current location:', window.location.pathname);
        
        // Prepare redirect URL first - this is critical
        const loginUrl = window.location.origin + '/login';
        console.log('🎯 Redirecting to:', loginUrl);
        
        // Clear storage immediately (synchronous - this is the source of truth)
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        delete axios.defaults.headers.common['Authorization'];
        console.log('✅ Storage cleared');
        
        // Clear state (async, but storage is already cleared so auth is effectively logged out)
        setAuth({ token: null, user: null });
        
        // Show logout message (using success instead of info since react-hot-toast doesn't have info)
        toast.success("You have been logged out.");
        
        // CRITICAL: Use window.location.href for immediate, unblockable redirect
        // This completely bypasses React Router and any route guards
        // Must be synchronous and immediate - no async operations after this
        console.log('🚀 Executing redirect...');
        window.location.href = loginUrl;
        console.log('⚠️ This should not execute if redirect works');
    };
    
    const isAdmin = auth.user?.role === 'admin';

    return { 
        user: auth.user, 
        token: auth.token,
        isAuthenticated: !!auth.token,
        isAdmin, 
        login, 
        logout,
        register,
    };
};

export default useAuth;