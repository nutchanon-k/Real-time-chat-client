// src/components/TypingIndicator.jsx

import React from 'react';

const TypingIndicator = ({ typingUsers }) => {
    if (typingUsers.length === 0) return null;

    return (
        <div className="text-sm text-gray-500 mt-2">
            {typingUsers.join(', ')} กำลังพิมพ์...
        </div>
    );
};

export default TypingIndicator;
