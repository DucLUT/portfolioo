import { useState, useEffect } from 'react';

const TopBar = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white py-1 px-2 flex justify-between items-center h-10">
            <div className="text-sm font-light cursor-pointer relative">
                <span>
                    {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
};

export default TopBar;