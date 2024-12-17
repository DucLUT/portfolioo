import ubuntuLogo from "../assets/ubuntu-logo.png";

const Taskbar = () => {
    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer">
                <img src={ubuntuLogo} alt="Ubuntu Logo" className="w-8 h-8" />
            </div>

            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer">
                <img src={ubuntuLogo} alt="Ubuntu Logo" className="w-8 h-8" />
            </div>
        </div>
    );
};

export default Taskbar;