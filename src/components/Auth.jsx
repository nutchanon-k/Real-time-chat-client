// src/components/Auth.jsx

import React, { useState } from 'react';
import useAuth from '../hook/useAuth';

const Auth = () => {
    const { register, login, error } = useAuth();
    const [isRegister, setIsRegister] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegister) {
                await register(formData);
                alert('Registration successful! Please login.');
                setIsRegister(false);
            } else {
                await login(formData);
            }
        } catch (err) {
            // ข้อผิดพลาดจะถูกจัดการใน Context
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {isRegister ? 'Register' : 'Login'}
                </h2>
                {isRegister && (
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    {isRegister ? 'Register' : 'Login'}
                </button>
                <p className="mt-4 text-center">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-blue-500 hover:underline"
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Auth;
