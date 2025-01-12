import { useState } from 'react';
import Icon from './Icon';
import Taskbar from './Taskbar';
import TopBar from './TopBar';
import Window from './Window';
import AboutMe from './AboutMe';
import ubuntuLogo from "../assets/ubuntu-logo.png"
import Project from './Project'
import aboutMeIcon from "../assets/duc-portrait.png"
import Chat from "./Chat/Chat"
import Game from "./Game/Game"


const Desktop = () => {
    const [positions, setPositions] = useState([
        { name: "About me", x: 0, y: 40 , imgSrc: aboutMeIcon},
        { name: "Projects", x: 150, y: 40 ,imgSrc: ""}, // Adjusted x position to avoid overlap
        {name: "Chat", x:0, y: 200, imgSrc: ""},
        {name: "Game", x: 150,y:200,imgSrc: ""}
    ]);
    const [openWindows, setOpenWindows] = useState([]);

    const windowContent = {
        "About me": <AboutMe />,
        "Projects": <Project/>,
        "Chat": <Chat/>,
        "Game": <Game/>
    };

    const updatePosition = (name, x, y) => {
        setPositions((prevPositions) =>
            prevPositions.map((pos) =>
                pos.name === name ? { ...pos, x, y } : pos
            )
        );
    };

    const handleIconDoubleClick = (name) => {
        if (!openWindows.some((win) => win.name === name)) {
            const centerX = window.innerWidth / 2 - 200; // Adjust the offset as needed
            const centerY = window.innerHeight / 2 - 150; // Adjust the offset as needed
            setOpenWindows([...openWindows, { name, content: windowContent[name], x: centerX, y: centerY }]);
        }
    };

    const handleCloseWindow = (name) => {
        setOpenWindows(openWindows.filter((win) => win.name !== name));
    };

    return (
        <div className="h-screen w-screen bg-cover bg-center bg-gradient-to-r from-melanzane via-turkishRose to-monarch relative" >
        <img src={ubuntuLogo} alt="Ubuntu Logo" className="absolute w-32 h-32 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <TopBar />
            {positions.map((app, idx) => (
                <Icon
                    key={idx}
                    name={app.name}
                    x={app.x}
                    y={app.y}
                    imgSrc={app.imgSrc}
                    positions={positions}
                    updatePosition={updatePosition}
                    onDoubleClick={handleIconDoubleClick}
                />
            ))}
            {openWindows.map((win, idx) => (
                <Window
                    key={idx}
                    title={win.name}
                    content={win.content}
                    x={win.x}
                    y={win.y}
                    onClose={() => handleCloseWindow(win.name)}
                />
            ))}
            <Taskbar />
        </div>
    );
};

export default Desktop;