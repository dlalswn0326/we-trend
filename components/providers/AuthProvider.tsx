'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

interface User {
    id: string;
    email?: string;
    name: string;
    profileImage?: string;
    isAnonymous: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const initAuth = async () => {
            // Check localStorage for existing user
            const storedUser = localStorage.getItem('weners_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setLoading(false);
            } else {
                // Create anonymous user
                await createAnonymousUser();
            }
        };

        initAuth();
    }, []);

    const createAnonymousUser = async () => {
        try {
            const response = await axios.post('/api/auth/login', {
                createAnonymous: true
            });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('weners_user', JSON.stringify(userData));
        } catch (error) {
            console.error('Failed to create anonymous user:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('weners_user', JSON.stringify(userData));
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, name?: string) => {
        try {
            const response = await axios.post('/api/auth/register', {
                email,
                password,
                name,
                anonymousUserId: user?.isAnonymous ? user.id : undefined
            });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('weners_user', JSON.stringify(userData));
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('weners_user');
        createAnonymousUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
