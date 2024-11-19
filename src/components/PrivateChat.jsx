// src/components/PrivateChat.jsx

import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';
import Message from './Message';

const PrivateChat = ({ selectedUser }) => {
    const [privateMessages, setPrivateMessages] = useState([]);

    useEffect(() => {
        if (!selectedUser) return;

        const handlePrivateMessage = (msg) => {
            if (msg.from === selectedUser) {
                setPrivateMessages(prev => [...prev, msg]);
            }
        };

        socket.on('private message', handlePrivateMessage);

        return () => {
            socket.off('private message', handlePrivateMessage);
        };
    }, [selectedUser]);

    return (
        <div className="p-4 bg-gray-200">
            <h3 className="text-lg font-semibold">Private Chat with {selectedUser}</h3>
            <ul>
                {privateMessages.map((msg, index) => (
                    <li key={index} className="mb-2">
                        <Message username={msg.from} message={msg.content} timestamp={msg.timestamp} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PrivateChat;
