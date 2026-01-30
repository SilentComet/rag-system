import { useState } from 'react';
import { apiClient } from '../services/apiClient';

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const login = async (email, password) => {
        try {
            const response = await apiClient.login(email, password);
            setToken(response.access_token);
            localStorage.setItem('token', response.access_token);
            setUser({ email });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (email, username, password) => {
        try {
            const response = await apiClient.register(email, username, password);
            setToken(response.access_token);
            localStorage.setItem('token', response.access_token);
            setUser({ email, username });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!token
    };
}
