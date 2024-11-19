// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket/socket';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            // Decode token to get user info
            const payload = parseJwt(token);
            if (payload) {
                setUser(payload.user);
                // Emit add user event to socket
                socket.emit('add user', payload.user.username);
            }
        } else {
            setUser(null);
        }
    }, [token]);

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    };

    const register = async ({ username, email, password }) => {
        try {
            const res = await axios.post('http://localhost:8000/api/auth/register', { username, email, password });
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            throw err;
        }
    };

    const login = async ({ email, password }) => {
        try {
            const res = await axios.post('http://localhost:8000/api/auth/login', { email, password });
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            // Emit add user event to socket after login
            const payload = parseJwt(res.data.token);
            if (payload) {
                socket.emit('add user', payload.user.username);
            }
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        }
    };

    const logout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
        socket.disconnect();
    };

    return (
        <AuthContext.Provider value={{ token, user, register, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
