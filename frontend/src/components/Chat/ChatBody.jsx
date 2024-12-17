import React, { useState } from "react";
import ChatInput from "./ChatInput";
import ChatContent from "./ChatContent";

const ChatBody = ({ socket, messages, setMessages }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (message.trim() === "") return;

        const newMessage = { sender: "ME", message };
        setMessages((prev) => [...prev, newMessage]);
        socket.emit("chat", newMessage);

        setMessage(""); // Clear input
    };

    const handleChange = (e) => setMessage(e.target.value);

    return (
        <div className="mt-4 flex flex-col gap-4">
            {/* Chat Content */}
            <ChatContent messages={messages} />

            {/* Chat Input */}
            <ChatInput
                onSubmit={handleSubmit}
                message={message}
                onMessageChange={handleChange}
            />
        </div>
    );
};

export default ChatBody;
