import React from "react";

const ChatInput = ({ onSubmit, message, onMessageChange }) => {
    return (
        <form onSubmit={onSubmit} className="flex gap-2">
            <input
                type="text"
                value={message}
                onChange={onMessageChange}
                maxLength={250}
                placeholder="Type a message..."
                className={`flex-1 rounded-md border-2 border-gray-600 bg-gray-700 p-2 text-white focus:outline-none ${
                    message.length === 250 ? "border-red-500" : ""
                }`}
            />
            <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
            >
                Send
            </button>
        </form>
    );
};

export default ChatInput;
