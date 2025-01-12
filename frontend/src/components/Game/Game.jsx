import React, { useState } from "react";
import Lobby from "./Lobby";
import OfflineGame from "./OfflineGame";
import OnlineGame from "./OnlineGame";

const Game = () => {
    const [mode, setMode] = useState(null);
    const [startOnlineGame, setStartOnlineGame] = useState(false);
    const handleModeSelection = (selectedMode) => {
        setMode(selectedMode)
    }
    const handleStartGame = () => {
        setStartOnlineGame(true);
    }
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
            {mode === "offline" && <OfflineGame/>}
            {mode === "online" && (
                <>
                {startOnlineGame?(
                    <OnlineGame/>
                ): (
                    <Lobby onStartGame={handleStartGame}/>
                )}
                </>
            )}

        </div>
    )

}
export default Game;