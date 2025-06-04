import React from "react";
import { Icon } from "@iconify/react";

const CommunityPage = () => {
    return (
        <div className="flex flex-col w-full h-full bg-white">
            {/* Header */}
            <div className="text-center mt-10 px-4">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                    Welcome to the
                </h1>
                <h2 className="text-xl md:text-3xl font-bold text-yellow-600 mt-1">
                    StraviX Community
                </h2>
                <p className="text-sm md:text-base text-gray-600 mt-4 max-w-xl mx-auto">
                    Join our 1K+ strong tribe to connect, learn, and grow in the world of
                    digital skills, affiliate success, and mindset mastery.
                </p>
            </div>

            {/* CTA Button */}
            <div className="mt-6 mb-4 text-center">
                <a
                    href="https://t.me/stravixcommunity" 
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 !text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition inline-flex items-center gap-2"
                >
                    Click Here To Join
                    <Icon icon="mdi:arrow-down-bold" className="text-lg" />
                </a>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 mb-6">
                <a href="https://facebook.com/stravixofficial" target="_blank" rel="noreferrer">
                    <Icon icon="ic:baseline-facebook" className="text-yellow-700 text-3xl md:text-7xl hover:scale-110 transition" />
                </a>
                <a href="https://youtube.com/@stravix" target="_blank" rel="noreferrer">
                    <Icon icon="mdi:youtube" className="text-yellow-700 text-3xl md:text-7xl hover:scale-110 transition" />
                </a>
                <a href="https://twitter.com/stravixhq" target="_blank" rel="noreferrer">
                    <Icon icon="mdi:twitter" className="text-yellow-700 text-3xl md:text-7xl hover:scale-110 transition" />
                </a>
                <a href="https://instagram.com/stravix_official" target="_blank" rel="noreferrer">
                    <Icon icon="mdi:instagram" className="text-yellow-700 text-3xl md:text-7xl hover:scale-110 transition" />
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                    <Icon icon="mdi:telegram" className="text-yellow-700 text-3xl md:text-7xl hover:scale-110 transition" />
                </a>
            </div>


            {/* Illustration */}
            <div className="w-full flex justify-center px-6 pb-10">
                <img
                    src="/assets/images/community-page.jpg" // replace with actual path
                    alt="StraviX Community"
                    className="w-full max-w-md md:max-w-xl"
                />
            </div>
        </div>
    );
};

export default CommunityPage;
