export interface User {
    email: string;
    _id: string;
    name: string;
    role: 'user' | 'admin';
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (data: { name: string; email: string; password: string }) => Promise<boolean>;
}