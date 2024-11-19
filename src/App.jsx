// src/App.jsx

import React from 'react';
import { AuthContext } from './contexts/AuthContext';
import Auth from './components/Auth';
import Chat from './components/Chat';
import useAuth from './hook/useAuth';

const App = () => {
    const { token, user, logout } = useAuth();

    return (
        <div className="flex flex-col h-screen">
            {token && user ? (
                <>
                    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
                        <h1 className="text-2xl">Real-Time Chat - Welcome, {user.username}</h1>
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        >
                            Logout
                        </button>
                    </header>
                    <Chat />
                </>
            ) : (
                <Auth />
            )}
        </div>
    );
};

export default App;
