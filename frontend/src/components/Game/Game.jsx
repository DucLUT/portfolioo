import React, { useState } from "react";
import Lobby from "./Lobby";
import OfflineGame from "./OfflineGame";
import OnlineGame from "./OnlineGame";

const Game = () => {
    const [mode, setMode] = useState(null);
    const [startOnlineGame, setStartOnlineGame] = useState(false);
    const [role, setRole] = useState(null);
    const [opponentName, setOpponentName] = useState(null);

    const handleModeSelection = (selectedMode) => {
        setMode(selectedMode);
    };

    const handleStartGame = (role, opponentName) => {
        setRole(role);
        setOpponentName(opponentName);
        setStartOnlineGame(true);
    };

    return (
        <div className="w-full h-full flex flex-col">
            {mode === null && (
                <div>
                    <button onClick={() => handleModeSelection("offline")}>
                        Play with bot
                    </button>
                    <button onClick={() => handleModeSelection("online")}>
                        Play Online
                    </button>
                </div>
            )}
            {mode === "offline" && <OfflineGame />}
            {mode === "online" && (
                <>
                    {startOnlineGame ? (
                        <OnlineGame role={role} opponentName={opponentName} />
                    ) : (
                        <Lobby onStartGame={handleStartGame} />
                    )}
                </>
            )}
        </div>
    );
};

export default Game;