// src/components/Chat.jsx

import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket/socket';
import Message from './Message';
import UserList from './UserList';
import TypingIndicator from './TypingIndicator';
import MediaUploader from './MediaUploader';
import useAuth from '../hook/useAuth';
import axios from 'axios';

const Chat = () => {
    const { user, logout, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [privateMessages, setPrivateMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const privateMessagesEndRef = useRef(null);

    useEffect(() => {
        // รับประวัติแชทสาธารณะ
        socket.on('chat history', (msgs) => {
            setMessages(msgs.map((msg) => ({
                ...msg,
                fromSelf: msg.username === user.username,
            })));
            scrollToBottom();
        });

        // รับข้อความสาธารณะใหม่
        socket.on('chat message', (msg) => {
            setMessages((prev) => [
                ...prev,
                {
                    ...msg,
                    fromSelf: msg.username === user.username,
                },
            ]);
            scrollToBottom();
        });

        // รับรายการผู้ใช้ที่ออนไลน์
        socket.on('user list', (users) => {
            setUsers(users);
        });

        // รับเหตุการณ์การพิมพ์
        socket.on('typing', (userTyping) => {
            if (userTyping !== user.username) {
                setTypingUsers((prev) => [...prev, userTyping]);
                setTimeout(() => {
                    setTypingUsers((prev) => prev.filter((u) => u !== userTyping));
                }, 3000);
            }
        });

        // รับข้อความส่วนตัว
        socket.on('private message', (msg) => {
            setPrivateMessages((prev) => [
                ...prev,
                {
                    ...msg,
                    fromSelf: msg.username === user.username,
                },
            ]);
            scrollToBottomPrivate();
        });

        // เคลียร์ event listeners เมื่อ component ถูกทำลาย
        return () => {
            socket.off('chat history');
            socket.off('chat message');
            socket.off('user list');
            socket.off('typing');
            socket.off('private message');
        };
    }, [user.username, selectedUser]);

    useEffect(() => {
        if (selectedUser) {
            // ดึงประวัติการแชทส่วนตัวจาก Backend
            const fetchPrivateMessages = async () => {
                try {
                    const res = await axios.get(
                        `http://localhost:8000/api/messages/private/${selectedUser}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setPrivateMessages(
                        res.data.map((msg) => ({
                            ...msg,
                            fromSelf: msg.username === user.username,
                        }))
                    );
                    scrollToBottomPrivate();
                } catch (error) {
                    console.error('Error fetching private messages:', error);
                }
            };
            fetchPrivateMessages();
        } else {
            setPrivateMessages([]);
        }
    }, [selectedUser, token]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (message.trim() === '' || !user.username) return;

        if (selectedUser) {
            // ส่งข้อความส่วนตัว
            socket.emit('private message', {
                content: message,
                to: selectedUser,
            });
            const res = await axios.post(
                `http://localhost:8000/api/messages`,{message,to: selectedUser},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(res.data);
        } else {
            // ส่งข้อความสาธารณะ
            const msg = {
                username: user.username,
                message,
            };
            socket.emit('chat message', msg);
        }

        // ล้างช่องข้อความ
        setMessage('');
    };

    const handleTyping = () => {
        socket.emit('typing', user.username);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToBottomPrivate = () => {
        privateMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    console.log(privateMessages, "test")
    return (
        <div className="flex flex-1">
            <UserList users={users} setSelectedUser={setSelectedUser} selectedUser={selectedUser} currentUser={user.username} />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto">
                    {selectedUser ? (
                        <div>
                            <h2 className="text-xl font-bold mb-2">Private Chat with {selectedUser}</h2>
                            <div className="space-y-2">
                                {privateMessages.map((msg, index) => (
                                    <Message
                                        key={index}
                                        username={msg.fromSelf ? 'You' : msg.username}
                                        message={msg.message}
                                        timestamp={msg.timestamp}
                                        fromSelf={msg.fromSelf}
                                    />
                                ))}
                                <div ref={privateMessagesEndRef} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-bold mb-2">Public Chat</h2>
                            <div className="space-y-2">
                                {messages.map((msg, index) => (
                                    <Message
                                        key={index}
                                        username={msg.username}
                                        message={msg.message}
                                        timestamp={msg.timestamp}
                                        fromSelf={msg.fromSelf}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <TypingIndicator typingUsers={typingUsers} />
                        </div>
                    )}
                </div>
                <MediaUploader />
                <form onSubmit={handleSubmit} className="p-4 bg-white flex space-x-2">
                    {selectedUser && (
                        <div className="flex items-center text-sm text-gray-600">
                            <span>Private chat with {selectedUser}</span>
                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                className="ml-2 text-red-500 hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="พิมพ์ข้อความของคุณ..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleTyping}
                        className="flex-1 p-2 border border-gray-300 rounded"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        ส่ง
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
