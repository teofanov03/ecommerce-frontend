// src/pages/LoginPage.tsx - AŽURIRANA VERZIJA (SAMO ESTETIKA)
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
// Uklanjamo Link import, jer ga originalni kod nije imao

const LoginPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    
    // Retrieves state and login function from Auth context
    const { isAuthenticated, login }: { isAuthenticated: boolean; login: (email: string, password: string) => Promise<boolean> } = useAuthContext();
    const navigate = useNavigate();

    // 1. Check if the user is already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // 2. Function to handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); // Reset error

        if (!email || !password) {
            // PROMENA: Poruka o grešci
            setError('Please fill in all fields.'); 
            return;
        }

        const result = await login(email, password);

        if (result === true) {
            // Successful login - navigation is handled by login function
            // Clear any previous errors
            setError('');
        } else {
            // Failed login - error toast je već shown by login function
            // Set local error for display in form
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        // 💡 DIZAJN: Pozadina svetlija, veća padding i shadow
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl border border-gray-200 transition duration-300">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        {/* Originalni Tekst */}
                        Login to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    
                    {/* 💡 DIZAJN: Dodajemo razmak između polja, ali zadržavamo grupu */}
                    <div className="space-y-4"> 
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                {/* Originalni Tekst */}
                                Email address 
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                // 💡 DIZAJN: Polja su zaobljena i imaju bolji fokus, veći padding
                                className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                                // Originalni Tekst
                                placeholder="Email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                {/* Originalni Tekst */}
                                Password 
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                // 💡 DIZAJN: Polja su zaobljena i imaju bolji fokus, veći padding
                                className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                                // Originalni Tekst
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Displaying error */}
                    {error && (
                        // 💡 DIZAJN: Vizuelno istaknuta greška sa pozadinom
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center font-medium border border-red-200">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            // 💡 DIZAJN: Veće dugme i lepša tranzicija
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                        >
                            {/* Originalni Tekst */}
                            Sign In 
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;