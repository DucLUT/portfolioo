import { useState } from "react";

const SettingsMenu = () => {
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(70);
  const [darkMode, setDarkMode] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);

  return (
    <div className="absolute top-10 right-0 bg-gray-800 text-white rounded-lg shadow-lg p-4 w-64 z-50">
      {/* Volume Control */}
      <div className="flex items-center mb-4">
        <span className="mr-2">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Brightness Control */}
      <div className="flex items-center mb-4">
        <span className="mr-2">🔆</span>
        <input
          type="range"
          min="0"
          max="100"
          value={brightness}
          onChange={(e) => setBrightness(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Toggle Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setWifi(!wifi)}
          className={`py-2 rounded-lg ${
            wifi ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Wi-Fi
        </button>
        <button
          onClick={() => setBluetooth(!bluetooth)}
          className={`py-2 rounded-lg ${
            bluetooth ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Bluetooth
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`py-2 rounded-lg ${
            darkMode ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Dark Mode
        </button>
        <button className="py-2 rounded-lg bg-gray-700">Night Light</button>
      </div>
    </div>
  );
};

export default SettingsMenu;
