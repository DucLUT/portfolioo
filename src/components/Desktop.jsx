import { useState } from 'react';
import Icon from './Icon';
import Taskbar from './Taskbar';
import TopBar from './TopBar';

const Desktop = () => {
    const [positions, setPositions] = useState([
        { name: "About me", x: 0, y: 60 },
        { name: "Projects", x: 150, y: 60 } // Adjusted x position to avoid overlap
    ]);

    const updatePosition = (name, x, y) => {
        setPositions((prevPositions) =>
            prevPositions.map((pos) =>
                pos.name === name ? { ...pos, x, y } : pos
            )
        );
    };

    return (
        <div className="h-screen w-screen bg-cover bg-center bg-black relative">
            <TopBar/>
            {positions.map((app, idx) => (
                <Icon
                    key={idx}
                    name={app.name}
                    x={app.x}
                    y={app.y}
                    positions={positions}
                    updatePosition={updatePosition}
                />
            ))}
            <Taskbar/>
        </div>
        
    );
};

export default Desktop;