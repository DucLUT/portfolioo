import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const OnlineGame = () => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState({
        ball: { x: 200, y: 150, speedX: 10, speedY: 10, size: 6 },
        leftPaddleY: 100,
        rightPaddleY: 100,
        leftScore: 0,
        rightScore: 0,
    });
    const socket = useRef(null);
    useEffect(() => {
        socket.current= io("http://localhost:3000/game", { transports: ["websocket"] });
        socket.current.on("gameState", (state) => {
            setGameState(state);
        });

        const handleKeyDown = (event) => {
            if (event.key === "ArrowUp") {
                socket.current.emit("paddleMove", { paddle: "right", direction: -1 });
            } else if (event.key === "ArrowDown") {
                socket.current.emit("paddleMove", { paddle: "right", direction: 1 });
            } else if (event.key === "w") {
                socket.current.emit("paddleMove", { paddle: "left", direction: -1 });
            } else if (event.key === "s") {
                socket.current.emit("paddleMove", { paddle: "left", direction: 1 });
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            socket.current.disconnect();
        };
    }, []);
        // Draw the game state on canvas
        const drawGame = () => {
            const ctx = canvasRef.current.getContext("2d");
            const { ball, leftPaddleY, rightPaddleY, leftScore, rightScore } = gameState;
    
            // Clear canvas
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
            // Draw paddles
            ctx.fillStyle = "white";
            ctx.fillRect(10, leftPaddleY, 10, 100); // Left paddle
            ctx.fillRect(canvasRef.current.width - 20, rightPaddleY, 10, 100); // Right paddle
    
            // Draw ball
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
            ctx.fill();
        };

        const draw = (ctx) =>{
            const { ball, leftPaddleY, rightPaddleY, leftScore, rightScore } = gameState;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.fillStyle = "white";
            ctx.fillRect(10, leftPaddleY, 10, 100); // Left paddle
            ctx.fillRect(canvasRef.current.width - 20, rightPaddleY, 10, 100); // Right paddle
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
            ctx.fill();

        };
        const update = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d")
            const {x,y,speedX, speedY, size} = ball.current
        }

        const gameLoop = () => {
            drawGame();
            requestAnimationFrame(gameLoop);
        };
    
        useEffect(() => {
            // Start the game loop when component is mounted
            gameLoop();
        }, [gameState]); // Re-run the game loop when gameState changes
    
        return (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={300}
                    style={{ border: "1px solid white" }}
                ></canvas>
            </div>
        );
};

export default OnlineGame;