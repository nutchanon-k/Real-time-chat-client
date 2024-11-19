// src/socket/socket.js

import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000'; // ปรับ URL ตามเซิร์ฟเวอร์ของคุณ

const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    auth: {
        token: localStorage.getItem('token') // ส่ง JWT ในการเชื่อมต่อ
    }
});

export default socket;
