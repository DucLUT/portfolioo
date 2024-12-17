import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from "@heroicons/react/24/solid";

const Window = ({ title, content, x, y, onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [size, setSize] = useState({ width: 500, height: 400 });
  const [position, setPosition] = useState({ x, y });
  const [lastPosition, setLastPosition] = useState({ x, y });
  const [lastSize, setLastSize] = useState({ width: 500, height: 400 });

  const handleFullScreen = () => {
    const topBarHeight = 31; // Adjust this to match your top bar height

    if (isFullScreen) {
      // Restore to original position and size
      setPosition(lastPosition);
      setSize(lastSize);
    } else {
      // Save current position and size, then go fullscreen
      setLastPosition(position);
      setLastSize(size);
      setPosition({ x: 0, y: topBarHeight });
      setSize({ width: window.innerWidth, height: window.innerHeight - topBarHeight });
    }

    // Toggle the fullscreen state
    setIsFullScreen(!isFullScreen);
  };

  const handleMediumSize = () => {
    if (isFullScreen) {
      // Restore saved position and size
      setPosition(lastPosition);
      setSize(lastSize);
    }
    setIsFullScreen(false);
  };

  return (
    <Rnd
      size={size}
      position={position}
      minWidth={300}
      minHeight={200}
      onDragStop={(e, d) => {
        if (!isFullScreen) {
          const newPosition = { x: d.x, y: d.y };
          setPosition(newPosition);
          setLastPosition(newPosition); // Update last position
        }
      }}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        if (!isFullScreen) {
          setSize({
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
          });
          setPosition(newPosition);
          setLastPosition(newPosition); // Update last position
        }
      }}
      bounds="parent"
    >
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 w-full h-full z-50 content overflow-auto">
        {/* Title bar */}
        <div className="flex justify-between items-center mb-4 cursor-move sticky top-0 bg-gray-800 z-10">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleFullScreen}
              className="text-yellow-500 hover:text-yellow-700"
            >
              <ArrowsPointingOutIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleMediumSize}
              className="text-green-500 hover:text-green-700"
            >
              <ArrowsPointingInIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="content overflow-auto h-full">{content}</div>
      </div>
    </Rnd>
  );
};

export default Window;