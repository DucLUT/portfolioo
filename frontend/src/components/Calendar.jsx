import React, { useState } from "react";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const CalendarCustom = ({ onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: firstDay }, () => null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    const handleMonthChange = (offset, event) => {
        event.preventDefault();
        event.stopPropagation(); // Stop event propagation
        setCurrentDate(new Date(year, month + offset, 1));
    };

    const handleDateClick = (day, event) => {
        event.stopPropagation(); // Stop event propagation
        if (!day) return;
        const selectedDate = new Date(year, month, day);
        if (onDateSelect) onDateSelect(selectedDate);
    };

    return (
        <div
            className="w-72 bg-gray-900 text-gray-300 rounded-lg shadow-lg p-4 z-50"
            onClick={(e) => e.stopPropagation()} // Stop event propagation
        >
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={(event) => handleMonthChange(-1, event)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700"
                >
                    &#9664;
                </button>
                <div className="text-lg font-semibold">
                    {currentDate.toLocaleString("default", { month: "long" })} {year}
                </div>
                <button
                    onClick={(event) => handleMonthChange(1, event)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700"
                >
                    &#9654;
                </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 text-center text-gray-400 mb-2">
                {daysOfWeek.map((day, idx) => (
                    <div key={idx} className="text-sm">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 text-center">
                {days.map((day, index) => {
                    const isToday =
                        day === today.getDate() &&
                        year === today.getFullYear() &&
                        month === today.getMonth();

                    return (
                        <div
                            key={index}
                            onClick={(event) => handleDateClick(day, event)}
                            className={`p-2 rounded-full cursor-pointer transition ${
                                isToday
                                    ? "bg-yellow-500 text-black font-bold" // Highlight today's date
                                    : "hover:bg-gray-700"
                            } ${day ? "text-gray-300" : ""}`}
                        >
                            {day || ""}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarCustom;