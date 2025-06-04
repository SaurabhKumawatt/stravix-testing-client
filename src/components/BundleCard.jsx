import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const BundleCard = ({
  title,
  image,
  price,
  originalPrice,
  rating = 4,
  slug,
  enrolled = false,
}) => {
  const formattedSlug = slug || title.toLowerCase().replace(/\s+/g, "-");
  // const formattedSlug = slug?.replace(/\s+/g, "-");
  const [imageURL, setImageURL] = useState("");


  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${image}`, {
          mode: "cors",
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageURL(url);
      } catch (err) {
        console.error("Image load failed:", err);
      }
    };

    if (image) loadImage();
  }, [image]);

  return (
    <div className="bg-white rounded-2xl p-4 w-full max-w-xs">
      {/* SVG Image Mask */}
      <div className="relative w-full h-auto drop-shadow-lg">
        {imageURL && (
        <svg
          viewBox="0 0 253 253"
          className="w-full h-full"
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

        {/* Arrow Button */}
        <div className="absolute right-0 bottom-0 w-max h-min">
          <Link
            to={enrolled ? `/course/${formattedSlug}/player` : `/bundle-courses/${formattedSlug}`}
            className="relative group block bg-secondary p-1 rounded-full shadow-lg overflow-hidden transition duration-300 ease-in-out hover:bg-primary"
          >
            <div className="absolute left-0 top-0 w-full h-full">
              <div className="w-full h-full origin-center rotate-[-30deg] transform opacity-0 -translate-x-full group-hover:translate-x-0 group-hover:opacity-100 transition-transform duration-500 ease-in-out">
                <div className="w-1/2 h-full bg-color1 rounded-l-full"></div>
              </div>
            </div>
            <img
              src="/assets/icons/Arrow.svg"
              alt="arrow"
              className="w-8 h-8 relative z-10 group-hover:rotate-[30deg]"

            />
          </Link>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-black font-semibold text-lg mt-4">{title}</h3>

      {/* Rating and Price */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-secondary text-sm">
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </div>
        <div className="text-right text-sm">
          <span className="text-black font-bold mr-1">₹ {price}</span>
          <span className="line-through text-gray-400">₹ {originalPrice}</span>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        to={enrolled ? `/course/${formattedSlug}/player` : `/bundle-courses/${formattedSlug}`}
      >
        <button className="mt-4 bg-primary text-black font-semibold py-2 w-full rounded-full">
          {enrolled ? "Continue Learning" : "Buy Now"}
        </button>
      </Link>
    </div>
  );
};

export default BundleCard;
