import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";


const EnrollCourseCard = ({ course, progress = 0 }) => {
    const navigate = useNavigate();
    const formattedSlug = course?.slug?.replace(/\s+/g, "-");
    const [imageURL, setImageURL] = useState("");

    useEffect(() => {
        const loadImage = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`, {
                    mode: "cors",
                });
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setImageURL(url);
            } catch (err) {
                console.error("Failed to load course thumbnail:", err);
            }
        };

        if (course.thumbnail) loadImage();
    }, [course.thumbnail]);

    return (
        <div className="flex flex-col items-center bg-white rounded-2xl p-4 w-full max-w-xs shadow">
            <div className="relative w-full h-auto drop-shadow-md">
                {imageURL && (
                    <svg
                        viewBox="0 0 253 253"
                        className="w-full h-40 mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id={`shapeImage-${formattedSlug}`}
                                patternUnits="userSpaceOnUse"
                                width="253"
                                height="253"
                            >
                                <image
                                    href={imageURL}
                                    x="0"
                                    y="0"
                                    width="253"
                                    height="253"
                                    preserveAspectRatio="xMidYMid slice"
                                />
                            </pattern>
                        </defs>
                        <path
                            d="M225 0H28C12.536 0 0 12.536 0 28V225C0 240.464 12.536 253 28 253H162.246C177.748 253 189.404 240.193 192.676 225.04C196.83 205.805 206.937 196.157 226.192 191.76C240.886 188.405 253 176.82 253 161.748V28C253 12.536 240.464 0 225 0Z"
                            fill={`url(#shapeImage-${formattedSlug})`}
                        />
                    </svg>
                )}
                <div className="absolute bottom-[-12px] right-[-12px]">
                    <Link
                        to={`/course/${formattedSlug}/player`}
                        className="relative group block bg-[#15202B] p-1 rounded-full shadow-lg overflow-hidden transition duration-300 ease-in-out hover:bg-primary"
                    >
                        <div className="absolute left-0 top-0 w-full h-full">
                            <div className="w-full h-full origin-center rotate-[-30deg] transform opacity-0 -translate-x-full group-hover:translate-x-0 group-hover:opacity-100 transition-transform duration-500 ease-in-out">
                                <div className="w-1/2 h-full bg-[#C69C5D] rounded-l-full"></div>
                            </div>
                        </div>
                        <img
                            src="/assets/icons/Arrow.svg"
                            alt="arrow"
                            className="w-6 h-6 relative z-10 group-hover:rotate-[30deg]"
                        />
                    </Link>
                </div>
            </div>

            <h3 className="text-base font-semibold mt-4 text-center">{course.title}</h3>

            <div className="w-full mt-2">
                <div className="bg-gray-300 h-2 rounded-full">
                    <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <button
                onClick={() => navigate(`/course/${course.slug}/player`)}
                className="mt-3 bg-secondary text-white font-semibold py-2 px-6 rounded-full w-full"
            >
                Continue Learning
            </button>
        </div>
    );
};

export default EnrollCourseCard;
