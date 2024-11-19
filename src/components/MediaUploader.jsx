// src/components/MediaUploader.jsx

import React, { useState } from 'react';
import axios from 'axios';
import socket from '../socket/socket';

const MediaUploader = () => {
    const [media, setMedia] = useState(null);
    const [error, setError] = useState('');

    const handleMediaChange = (e) => {
        setMedia(e.target.files[0]);
    };

    const handleMediaSubmit = async (e) => {
        e.preventDefault();
        if (!media) {
            setError('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('media', media);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:8000/api/media', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMedia(null);
            setError('');
            // กระจายสื่อที่อัปโหลดผ่าน Socket.io
            socket.emit('share media', res.data);
        } catch (err) {
            console.error('Error uploading media:', err);
            setError('Failed to upload media');
        }
    };

    return (
        <form onSubmit={handleMediaSubmit} className="p-4 bg-white flex space-x-2">
            <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
                แชร์
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default MediaUploader;
