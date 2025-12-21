// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    
    // Dohvatamo podatke iz konteksta
    const { isAuthenticated, login, user } = useAuthContext();
    const navigate = useNavigate();

    // 1. Ako je korisnik već ulogovan, odmah ga sklanjamo sa login stranice
    useEffect(() => {
        if (isAuthenticated) {
            // Ako je admin šaljemo ga na admin panel, inače na home
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, navigate, user]);

    // 2. Rukovanje formom
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); 

        if (!email || !password) {
            setError('Please fill in all fields.'); 
            return;
        }

        const result = await login(email, password);

        if (result === true) {
            setError('');
            // OVO JE KLJUČNO: Nakon uspešnog logina, moramo reći browseru gde da ide
            // Pošto useEffect iznad prati 'isAuthenticated', on će uraditi navigaciju,
            // ali je sigurnije i brže dodati je i ovde:
            navigate('/'); 
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl border border-gray-200 transition duration-300">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        Login to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4"> 
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                                placeholder="Email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center font-medium border border-red-200">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                        >
                            Sign In 
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;