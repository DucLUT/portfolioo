import Draggable from 'react-draggable';
import { useState } from 'react';

const Icon = ({ name, x, y, positions, updatePosition }) => {
    const [position, setPosition] = useState({ x, y });
    const [initialPosition] = useState({ x, y });
    const [isDragging, setIsDragging] = useState(true);

    const handleDrag = (e, data) => {
        if (!isDragging) return;

        const newX = data.x;
        const newY = data.y;

        // Check for collisions with other icons
        const isColliding = positions.some(
            (pos) =>
                pos.name !== name &&
                Math.abs(pos.x - newX) < 85 && // Adjust the threshold as needed
                Math.abs(pos.y - newY) < 85 // Adjust the threshold as needed
        );

        // Check for boundaries
        const isOutOfBounds = newX < 0 || newY < 40 || newX > window.innerWidth - 96 || newY > window.innerHeight - 96;

        if (!isColliding && !isOutOfBounds) {
            setPosition({ x: newX, y: newY });
        } else {
            setPosition(initialPosition);
            setIsDragging(false);
            setTimeout(() => setIsDragging(true), 100); // Disable dragging for 100ms
        }
    };

    const handleStop = () => {
        if (isDragging) {
            updatePosition(name, position.x, position.y);
        } else {
            setPosition(initialPosition);
        }
    };

    return (
        <Draggable
            position={position}
            onDrag={handleDrag}
            onStop={handleStop}
            disabled={!isDragging}
        >
            <div className="flex flex-col items-center absolute">
                <div className="w-24 h-24 flex items-center justify-center rounded-lg shadow-sm cursor-pointer transition-transform duration-150 bg-green-200">
                    {/* You can add an icon or image here if needed */}
                </div>
                <span className="mt-2 text-sm text-white text-center">{name}</span>
            </div>
        </Draggable>
    );
};

export default Icon;