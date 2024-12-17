import { useState, useEffect, useRef } from "react";
import CalendarCustom from "./Calendar";
import { WifiIcon, Battery100Icon, SpeakerWaveIcon } from "@heroicons/react/24/solid";
import SettingsMenu from "./SettingsMenu";

const TopBar = () => {
    const [dateTime, setDateTime] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const hideTimeoutRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleMouseEnter = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        setShowCalendar(true);
    };

    const handleMouseLeave = () => {
        hideTimeoutRef.current = setTimeout(() => {
            setShowCalendar(false);
        }, 50);
    };
    
    const handleMouseEnterSetting = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        setShowSettings(true);
    }

    const handleMouseLeaveSetting = () => {
        hideTimeoutRef.current = setTimeout(() => {
            setShowSettings(false);
        }, 50);
    }

    const handleDateSelect = (selectedDate) => {
        setDateTime(selectedDate);
        setShowCalendar(false);
    };

    return (
        <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white py-1 px-2 flex justify-between items-center h-10 z-50">
            <div></div>
            <div
                className="text-sm font-light cursor-pointer relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <span>
                {dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {dateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </span>
                {/* Calendar Dropdown */}
                {showCalendar && (
                    <div
                        className="absolute top-10 left-0 z-50"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <CalendarCustom onDateSelect={handleDateSelect} />
                    </div>
                )}
            </div>
            <div className="text-sm font-light cursor-pointer relative"
                onMouseEnter={handleMouseEnterSetting}
                onMouseLeave={handleMouseLeaveSetting}>
                    <div className="flex space-x-2">
                        <WifiIcon className="w-5 h-5 text-white" /> {/* Wi-Fi Icon */}
                        <SpeakerWaveIcon className="w-5 h-5 text-white" /> {/* Volume Icon */}
                        <Battery100Icon className="w-5 h-5 text-green-500" /> {/* Battery Icon */}
                    </div>
                    {showSettings && <SettingsMenu />}
            </div>
        </div>
    );
};

export default TopBar;