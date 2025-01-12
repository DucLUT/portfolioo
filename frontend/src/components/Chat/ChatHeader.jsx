import React from "react";

const ChatHeader = ({ isConnected, connectedUsers }) => {
    return (
        <div className="flex items-center justify-between border-b border-gray-600 pb-4">
            
            <div className="flex items-center space-x-4">
                <div
                    className={`h-3 w-3 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                    title="Connection status"
                ></div>
                <p className="text-white">Users: {connectedUsers}</p>
            </div>
        </div>
    );
};

export default ChatHeader;
