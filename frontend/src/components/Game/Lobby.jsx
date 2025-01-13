import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Lobby = ({ onStartGame }) => {
    const [socket, setSocket] = useState(null);
    const [players, setPlayers] = useState([]);
    const [receivedInvite, setReceivedInvite] = useState(null);

    useEffect(() => {
        const newSocket = io("https://portfolio-duc-app-39771e993c9d.herokuapp.com/game", { transports: ["websocket"] });
        setSocket(newSocket);

        // Listen for updates to the player list
        newSocket.on("updatePlayers", (data) => {
            console.log("ppl in game: " + JSON.stringify(data, null, 2));
            setPlayers(data);
        });

        // Listen for invites
        newSocket.on("receiveInvite", (invite) => {
            setReceivedInvite(invite);
        });

        // Listen for start game event
        newSocket.on("startGame", (data) => {
            console.log("Game starting with role:", data.role);
            onStartGame(data.role, data.opponentName);
        });

        return () => newSocket.close();
    }, [onStartGame]);

    const sendInvite = (opponentId) => {
        if (socket) {
            console.log(`Sending invite to ${opponentId}`);
            socket.emit("sendInvite", opponentId);
        }
    };
    
    const respondToInvite = (accepted) => {
        if (socket && receivedInvite) {
            console.log(`Responding to invite from ${receivedInvite.inviterId} with ${accepted}`);
            socket.emit("respondInvite", { inviterId: receivedInvite.inviterId, accepted });
            if (accepted) {
                onStartGame("right", receivedInvite.inviterName); // Start the game with role and opponentName
            }
            setReceivedInvite(null);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h2>Lobby</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        {player.name}
                        <button onClick={() => sendInvite(player.id)}>Invite</button>
                    </li>
                ))}
            </ul>

            {receivedInvite && (
                <div>
                    <p>{receivedInvite.inviterName} has invited you to play!</p>
                    <button onClick={() => respondToInvite(true)}>Accept</button>
                    <button onClick={() => respondToInvite(false)}>Decline</button>
                </div>
            )}
        </div>
    );
};

export default Lobby;