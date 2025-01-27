import React, { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import throttle from "lodash.throttle";

const OnlineGame = ({ role, opponentName }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const gameStateRef = useRef({
        ball: { x: 200, y: 150, speedX: 7, speedY: 7, size: 6 },
        leftPaddleY: 100,
        rightPaddleY: 100,
        leftScore: 0,
        rightScore: 0,
    });

    const [gameState, setGameState] = useState(gameStateRef.current);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        //localhost:3000/game
        //https://portfolio-duc-app-39771e993c9d.herokuapp.com/game
        const newSocket = io("localhost:3000/game", { transports: ["websocket"] });
        setSocket(newSocket);
        newSocket.on("gameState", (state) => {
            gameStateRef.current = state;
            setGameState(state);
        });

        const handleKeyDown = throttle((event) => {
            if (event.key === "ArrowUp") {
                newSocket.emit("handleController", { paddle: role, direction: -1 });
            } else if (event.key === "ArrowDown") {
                newSocket.emit("handleController", { paddle: role, direction: 1 });
            }
        }, 100); // Throttle to limit the frequency of keydown events

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            newSocket.close();
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [role]);

    const drawGame = useCallback(() => {
        const ctx = canvasRef.current.getContext("2d");
        const { ball, leftPaddleY, rightPaddleY, leftScore, rightScore } = gameStateRef.current;

        // Clear canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw paddles
        ctx.fillStyle = "white";
        ctx.fillRect(10, leftPaddleY, 10, 100); // Left paddle
        ctx.fillRect(380, rightPaddleY, 10, 100); // Right paddle

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        ctx.fill();
    }, []);

    const gameLoop = useCallback(() => {
        drawGame();
        requestRef.current = requestAnimationFrame(gameLoop);
    }, [drawGame]);

    useEffect(() => {
        // Start the game loop when component is mounted
        requestRef.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameLoop]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 text-white">
            <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="border border-gray-700"
            ></canvas>
            <p>Playing as: {role}</p> 
            <p>Opponent: {opponentName}</p>
        </div>
    );
};

export default OnlineGame;