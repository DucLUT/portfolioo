import React from "react";

const getMessageStyle = (sender) => {
    switch (sender) {
        case "ME":
            return "text-blue-400 font-semibold";
        case "HELP":
            return "text-green-400 font-semibold";
        case "ERROR":
            return "text-red-400 font-semibold";
        default:
            return "text-gray-300";
    }
};

const ChatContent = ({ messages }) => {
    return (
        <div className="h-64 overflow-y-auto rounded-md border border-gray-700 bg-gray-700 p-4">
            {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                    <span className={`${getMessageStyle(msg.sender)}`}>
                        {msg.sender} {"> "}
                    </span>
                    <span className="text-white">{msg.messages}</span>
                </div>
            ))}
        </div>
    );
};

export default ChatContent;
