// src/components/UserList.jsx

import React from 'react';

const UserList = ({ users, setSelectedUser, selectedUser, currentUser }) => {
    return (
        <div className="w-1/4 p-4 bg-gray-200 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">ผู้ใช้ที่ออนไลน์</h3>
            <ul>
                {users.filter(user => user !== currentUser).map((user, index) => (
                    <li
                        key={index}
                        className={`mb-2 cursor-pointer flex items-center p-2 rounded hover:bg-gray-300 ${user === selectedUser ? 'bg-blue-100' : ''}`}
                        onClick={() => setSelectedUser(user)}
                    >
                        {/* Avatar หรือ Icon */}
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white mr-2">
                            {user.charAt(0).toUpperCase()}
                        </div>
                        <span>{user}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
