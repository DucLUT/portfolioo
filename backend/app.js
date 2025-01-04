const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { Server } = require('socket.io');
dotenv.config();
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || "5000";
const ENVIRONMENT = process.env.NODE_ENV || "";
const MAX_CONNECTIONS = 1000;

let ALLOWED_ORIGINS = [];
if (ENVIRONMENT === "development") {
    console.log("Running in development mode");
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:5173",
    ];
} else {
    throw new Error("Invalid environment");
}

const app = express();
app.use(cors());
app.use(express.json());

if (ENVIRONMENT === "development") {
    console.log("Serving static files in development mode");
} else if (ENVIRONMENT === "production") {
    console.log("Serving static files in production mode");
} else {
    throw new Error("Invalid environment");
}

const clientPath = path.join(__dirname, "./dist/frontend");
app.use(express.static(clientPath));
app.get("*", (_req, res ,next) => {
    res.sendFile(path.join(clientPath, "index.html"));
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);
app.use(express.urlencoded({ extended: false }));

app.use((err, req, res, _next) => {
    res.status(err.status || 500);
    res.send("error");
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: ALLOWED_ORIGINS,
        credentials: true,
    },
});

const connectedUsers = new Map();
const connectedUsernames = new Set();
let currentConnections = 0;

const validChatMessage = (msg) => {
    return msg.length <= 250;
};

const adjectives = ["Quick", "Lazy", "Happy", "Sad", "Angry", "Bright", "Dark"];
const nouns = ["Fox", "Dog", "Cat", "Mouse", "Lion", "Tiger", "Bear"];

const generateUniqueName = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const uniqueId = Date.now().toString().slice(-4); // Use the last 4 digits of the timestamp
    return `${adjective}${noun}${uniqueId}`;
};

const handleConnect = (socket) => {
    if (currentConnections >= MAX_CONNECTIONS) {
        socket.disconnect();
        return;
    }
    currentConnections++;
    const userName = generateUniqueName();
    socket.data.userName = userName;
    connectedUsers.set(socket.id, userName);
    connectedUsernames.add(userName);
    io.emit("users", currentConnections);
    console.log(`${userName} connected`);
};

const handleDisconnect = (socket) => {
    currentConnections--;

    const usernameToDelete = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);

    if (usernameToDelete) {
        connectedUsernames.delete(usernameToDelete);
    }

    io.emit("users", currentConnections);
    console.log(`${usernameToDelete} disconnected`);
};

const handleChat = (socket, msg) => {
    if (typeof msg !== "object" || !msg.message || !msg.sender) {
        return;
    }

    if (!validChatMessage(msg.message)) {
        return;
    }

    msg.sender = socket.data.userName || "ANONYMOUS";

    try {
        // Sanitize message
        msg.sender = decodeURIComponent(msg.sender);
        msg.message = msg.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        socket.broadcast.emit("chat", msg);
    } catch (err) {
        console.log(err);
    }
};

io.on("connection", (socket) => {
    handleConnect(socket);

    socket.on("disconnect", () => {
        handleDisconnect(socket);
    });

    socket.on("chat", (msg) => {
        handleChat(socket, msg);
    });
});