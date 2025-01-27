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
} else if (ENVIRONMENT === "production") {
    console.log("Running in production mode");
    ALLOWED_ORIGINS = [
        "https://portfolio-duc-app-39771e993c9d.herokuapp.com",
        "https://www.ducduong.dev/",
        "https://ducduong.dev/",
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
const availablePlayers = new Map(); // Tracks players available for matchmaking
const activeMatches = new Map(); // Tracks active matche
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
    chatNamespace.emit("users", currentConnections);
    console.log(`${userName} connected`);
};

const handleDisconnect = (socket) => {
    currentConnections--;

    const usernameToDelete = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);

    if (usernameToDelete) {
        connectedUsernames.delete(usernameToDelete);
    }

    chatNamespace.emit("users", currentConnections);
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
const chatNamespace = io.of("/chat");

chatNamespace.on("connection", (socket) => {
    handleConnect(socket);

    socket.on("disconnect", () => {
        handleDisconnect(socket);
    });

    socket.on("chat", (msg) => {
        handleChat(socket, msg);
    });
});

const gameNamespace = io.of("/game");
let gameState = {
    ball: { x: 200, y: 150, speedX: 7, speedY: 7, size: 6 },
    leftPaddleY: 100,
    rightPaddleY: 100,
    leftScore: 0,
    rightScore: 0,
};

const canvasWidth = 400;
const canvasHeight = 300;

const resetBall = () => {
    gameState.ball = {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        speedX: Math.random() > 0.5 ? 7 : -7,
        speedY: Math.random() > 0.5 ? 7 : -7,
        size: 6,
    };
};

const updateGame = () => {
    const { ball, leftPaddleY, rightPaddleY } = gameState;

    // Ball movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Collision with walls (top and bottom)
    if (ball.y - ball.size < 0) {
        ball.speedY *= -1;
        ball.y = ball.size;
    }else if (ball.y+ball.size>canvasHeight){
        ball.speedY*=-1;
        ball.y=canvasHeight-ball.size;
    }

    // Collision with paddles
    if (
        ball.x - ball.size < 20 &&
        ball.y > leftPaddleY &&
        ball.y < leftPaddleY + 100
    ) {
        ball.speedX *= -1;
        ball.x=20+ball.size;
    }else if (
        ball.x+ball.size > 380 &&
        ball.y>rightPaddleY &&
        ball.y< rightPaddleY + 100
    ) {
        ball.speedX *=-1;
        ball.x=380-ball.size;
    }

    // Scoring
    if (ball.x - ball.size < 0) {
        gameState.rightScore++;
        resetBall();
    }

    if (ball.x + ball.size > canvasWidth) {
        gameState.leftScore++;
        resetBall();
    }

    // Emit game state to connected clients
    gameNamespace.emit("gameState", gameState);
};

// Update the game state at 60 FPS
setInterval(updateGame, 1000 / 60);

const broadcastPlayers = () => {
    gameNamespace.emit(
        "updatePlayers",
        Array.from(availablePlayers.entries()).map(([id, name]) => ({ id, name }))
    );
}

const handleGameConnect = (socket) => {
    const userName = generateUniqueName();
    availablePlayers.set(socket.id, userName);
    broadcastPlayers();
    
}
const sendInvite = (socket, opponentId) => {
    const inviterName = availablePlayers.get(socket.id);
    // console.log("Inviter Name: "+ inviterName)
    // console.log("Opponent Name: "+ opponentId)
    if (inviterId === opponentId) {
        console.log("Cannot send invite to yourself.");
        return;
    }
    if (inviterName) {
        gameNamespace.to(opponentId).emit("receiveInvite", {
            inviterId: socket.id,
            inviterName,
        });
    }
};
const respondInvite = (socket, { inviterId, accepted }) => {
    console.log(`Received response to invite from ${socket.id} to ${inviterId}: ${accepted}`);
    if (accepted) {
        const opponentName = availablePlayers.get(socket.id);
        availablePlayers.delete(socket.id);
        availablePlayers.delete(inviterId);
        broadcastPlayers();
        activeMatches.set(socket.id, inviterId);
        activeMatches.set(inviterId, socket.id);
        gameNamespace.to(socket.id).emit("startGame", { role: "right", opponentName });
        gameNamespace.to(inviterId).emit("startGame", { role: "left", opponentName: opponentName });
    } else {
        gameNamespace.to(inviterId).emit("inviteDeclined");
    }
};
const handleGameDisconnect = (socket) => {
    availablePlayers.delete(socket.id);
    const opponentId = activeMatches.get(socket.id)
    if(opponentId){
        gameNamespace.to(opponentId).emit("opponentDisconnected");
        activeMatches.delete(opponentId);
    }
    activeMatches.delete(socket.id)
    broadcastPlayers();
};
const handleController = (socket, { paddle, direction }) => {
    if (paddle === "left") {
        gameState.leftPaddleY = Math.max(
            Math.min(gameState.leftPaddleY + direction * 10, canvasHeight - 100),
            0
        );
    } else if (paddle === "right") {
        gameState.rightPaddleY = Math.max(
            Math.min(gameState.rightPaddleY + direction * 10, canvasHeight - 100),
            0
        );
    }
    gameNamespace.emit("gameState", gameState);
};

gameNamespace.on("connection", (socket) => {
    handleGameConnect(socket);
    socket.emit("gameState", gameState);

    socket.on("handleController", (data) => {
        handleController(socket, data);
    });

    socket.on("sendInvite", (opponentId) => sendInvite(socket, opponentId));

    socket.on("respondInvite", (data) => respondInvite(socket, data));

    socket.on("disconnect", () => {
        handleGameDisconnect(socket);
    });
});

// gameNamespace.on("connection", (socket) => {
//     console.log("A user connected to the game!");
    

//     // Send initial state
//     socket.emit("gameState", gameState);


//     // Handle paddle movement
//     socket.on("paddleMove", ({ paddle, direction }) => {
//         if (paddle === "left") {
//             gameState.leftPaddleY = Math.max(
//                 Math.min(gameState.leftPaddleY + direction * 10, canvasHeight - 100),
//                 0
//             );
//         } else if (paddle === "right") {
//             gameState.rightPaddleY = Math.max(
//                 Math.min(gameState.rightPaddleY + direction * 10, canvasHeight - 100),
//                 0
//             );
//         }
//     });

//     socket.on("disconnect", () => {
//         console.log("A user disconnected from the game!");
//     });
// });