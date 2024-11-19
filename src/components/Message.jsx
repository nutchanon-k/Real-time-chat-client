// src/components/Message.jsx

import React from 'react';

const Message = ({ username, message, timestamp, fromSelf }) => {
    const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex ${fromSelf ? 'justify-end' : 'justify-start'} mb-4`}>
            {!fromSelf && (
                <div className="flex-shrink-0 mr-2">
                    {/* Avatar หรือ Icon */}
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
                        {username.charAt(0).toUpperCase()}
                    </div>
                </div>
            )}
            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${fromSelf ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                <div className="text-sm font-semibold">
                    {fromSelf ? 'You' : username}
                </div>
                <div className="mt-1">
                    {message}
                </div>
                <div className="mt-1 text-xs text-right">
                    {time}
                </div>
            </div>
            {fromSelf && (
                <div className="flex-shrink-0 ml-2">
                    {/* Avatar หรือ Icon */}
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        {username.charAt(0).toUpperCase()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Message;
