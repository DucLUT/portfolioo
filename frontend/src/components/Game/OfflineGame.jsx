import React, { useState, useRef, useEffect } from "react";

const OfflineGame = () => {
   const [leftScore, setLeftScore] = useState(0);
   const [rightScore, setRightScore] = useState(0);
   const canvasRef = useRef(null);
   const requestRef = useRef();
   const rightPaddleYRef = useRef((300 - 100) / 2);
   const leftPaddleYRef = useRef((300 - 100) / 2);
   const ball = useRef({
      x: 200,
      y: 150,
      speedX: 7,
      speedY: 7,
      size: 6,
   });

   const draw = (ctx) => {
      ctx.clearRect(0, 0, 400, 300);

      // Draw paddles
      ctx.fillStyle = "white";
      ctx.fillRect(10, leftPaddleYRef.current, 10, 100); // Left paddle
      ctx.fillRect(380, rightPaddleYRef.current, 10, 100); // Right paddle

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.current.x, ball.current.y, ball.current.size, 0, Math.PI * 2);
      ctx.fill();

   };

   const update = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const { x, y, speedX, speedY, size } = ball.current;

    // Ball movement
    ball.current.x += speedX;
    ball.current.y += speedY;

    // Collision with top and bottom walls
    if (y - size < 0) {
        ball.current.speedY *= -1;
        ball.current.y = size; // Adjust position to be within bounds
    } else if (y + size > canvas.height) {
        ball.current.speedY *= -1;
        ball.current.y = canvas.height - size; // Adjust position to be within bounds
    }

    // Collision with paddles
    if (
        x - size < 20 &&
        y > leftPaddleYRef.current &&
        y < leftPaddleYRef.current + 100
    ) {
        ball.current.speedX *= -1;
        ball.current.x = 20 + size; // Adjust position to be within bounds
    } else if (
        x + size > 380 &&
        y > rightPaddleYRef.current &&
        y < rightPaddleYRef.current + 100
    ) {
        ball.current.speedX *= -1;
        ball.current.x = 380 - size; // Adjust position to be within bounds
    }

    // Scoring
    if (x - size < 0) {
        setRightScore((prev) => prev + 1);
        resetBall();
    } else if (x + size > canvas.width) {
        setLeftScore((prev) => prev + 1);
        resetBall();
    }

    // AI paddle movement (right paddle)
    if (y > rightPaddleYRef.current + 50) {
        rightPaddleYRef.current = Math.min(rightPaddleYRef.current + 7, 200);
    } else {
        rightPaddleYRef.current = Math.max(rightPaddleYRef.current - 7, 0);
    }

    draw(ctx);
    requestRef.current = requestAnimationFrame(update);
};

   const resetBall = () => {
      ball.current.x = 200;
      ball.current.y = 150;
      ball.current.speedX = Math.random() > 0.5 ? 7 : -7;
      ball.current.speedY = Math.random() > 0.5 ? 7 : -7;
   };

   useEffect(() => {
      const handleKeyDown = (event) => {
         if (event.key === "ArrowUp") {
            leftPaddleYRef.current = Math.max(leftPaddleYRef.current - 20, 0);
         } else if (event.key === "ArrowDown") {
            leftPaddleYRef.current = Math.min(leftPaddleYRef.current + 20, 200);
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      requestRef.current = requestAnimationFrame(update);

      return () => {
         window.removeEventListener("keydown", handleKeyDown);
         cancelAnimationFrame(requestRef.current);
      };
   }, []);

   return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 text-white">
         <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="border border-gray-700"
         />
         <div className="mt-4 text-center">
            <p className="text-lg">Player 1: {leftScore}</p>
            <p className="text-lg">Player 2: {rightScore}</p>
         </div>
      </div>
   );
};

export default OfflineGame;
