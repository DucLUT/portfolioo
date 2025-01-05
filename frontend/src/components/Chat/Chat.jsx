import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Components
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";

// Main Chat Component
const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]); // Chat messages
    const [isConnected, setIsConnected] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState(0);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io("https://www.neniuk.dev/",{transports:["websocket"]}); // Replace with your backend URL
        setSocket(newSocket);

        // Connection events
        newSocket.on("connect", () => setIsConnected(true));
        newSocket.on("disconnect", () => setIsConnected(false));
        newSocket.on("users", (count) => setConnectedUsers(count));

        // Listen for incoming messages
        newSocket.on("chat", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => newSocket.close();
    }, []);

    return (
        <div className="w-full h-full flex flex-col">
            <ChatHeader isConnected={isConnected} connectedUsers={connectedUsers} />
            <ChatBody socket={socket} messages={messages} setMessages={setMessages} />
        </div>
    );
};

export default Chat;
