import React, { useEffect, useState } from "react";
import profilePicture from "../assets/duc-portrait.png"
import githubLogo from "../assets/github-logo.png"
import linkedInLogo from "../assets/linkedin-logo.png";
import emailLogo from "../assets/email-logo.png";
import contentCopy from "../assets/content-copy.svg";

const githubLink = "https://github.com/DucLUT"
const linkedInLink = "https://www.linkedin.com/in/ducduong16032004/";
const emailAddress = "minhduc16032004@gmail.com";

const Profile = () => {
    return (
    <div className="w-24 h-24 border-2 border-blue-500 rounded-lg overflow-hidden">
        <img
            src = {profilePicture} 
            alt="Profile"
            className="w-full h-full object-cover"
        />
    </div>
    )
}

const ProfileSummary = () => {
    return (
        <div className="flex-1">
        <h1 className="text-blue-500 text-3xl font-bold mb-1">Duc Duong</h1>
        <p className="text-sm flex items-center mb-2">
            <span role="img" aria-label="location" className="mr-1">
                📍
            </span>
            Finland
        </p>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            Hi, I'm Duong Minh Duc, third year student at LUT University majoring in Software and System Engineering. If 
            yoy have any questions, feel free to contact me via email or LinkedIn.
        </p>
        </div>
    )
}

const SocialLinks = () => {
    const [githubLoading, setGithubLoading] = useState(true);
    const [linkedInLoading, setLinkedInLoading] = useState(true);
    const [emailLoading, setEmailLoading] = useState(true);
    const [showEmail, setShowEmail] = useState(false);

    useEffect(() => {
        const githubImg = new Image();
        githubImg.src = githubLogo;
        githubImg.onload = () => setGithubLoading(false);

        const linkedInImg = new Image();
        linkedInImg.src = linkedInLogo;
        linkedInImg.onload = () => setLinkedInLoading(false);

        const emailImg = new Image();
        emailImg.src = emailLogo;
        emailImg.onload = () => setEmailLoading(false);
    }, []);
    const handleEmailClick = () => {
        setShowEmail(!showEmail);
    };

    const copyEmailToClipboard = () => {
        navigator.clipboard.writeText(emailAddress);
    };

    return (
        <div className="flex flex-row gap-4">
            <a
                className="select-none"
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
            >
                {githubLoading ? (
                    <div className="w-32px h-32px rounded-full bg-gray-200"></div>
                ) : (
                    <img
                        className="w-32px hover:animate-spin-slow h-auto hover:brightness-75"
                        src={githubLogo}
                        alt="Github logo"
                        width="32"
                        height="32"
                    />
                )}
            </a>
            <a
                className="select-none"
                href={linkedInLink}
                target="_blank"
                rel="noopener noreferrer"
            >
                {linkedInLoading ? (
                    <div className="w-32px h-32px rounded-full bg-gray-200"></div>
                ) : (
                    <img
                        className="w-32px hover:animate-spin-slow h-auto hover:brightness-75"
                        src={linkedInLogo}
                        alt="LinkedIn logo"
                        width="32"
                        height="32"
                    />
                )}
            </a>
            {/* Email button -> reveal email */}
            <div className="flex flex-row justify-center gap-4">
                <button
                    className="h-auto w-[32px] cursor-pointer rounded-none border-none bg-transparent p-0"
                    onClick={handleEmailClick}
                >
                    {emailLoading ? (
                        <div className="w-32px h-32px rounded-full bg-gray-200"></div>
                    ) : (
                        <img
                            className="w-32px hover:animate-spin-slow h-auto hover:brightness-75"
                            src={emailLogo}
                            alt="Email logo"
                            width="32"
                            height="32"
                        />
                    )}
                </button>
                {showEmail && (
                    <div className="flex flex-row items-center justify-center gap-4 text-center">
                        <div className="flex flex-col justify-center text-lg text-gray-400">
                            {emailAddress}
                        </div>
                        <button
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-400 bg-transparent p-0 hover:border-white"
                            onClick={copyEmailToClipboard}
                        >
                            <img
                                className="h-auto w-[16px] select-none"
                                src={contentCopy}
                                alt="Copy email to clipboard"
                                width="16"
                                height="16"
                            />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};




const AboutMe = () => {
    return (
        <div className="bg-gray-900 text-white p-4 rounded-lg flex items-center space-x-4">
            {/* Profile Image */}
            <Profile/>

            {/* About Text */}
            <ProfileSummary/>

            {/* Social Links */}
            <SocialLinks/>
        </div>
        
    );
};

export default AboutMe;
