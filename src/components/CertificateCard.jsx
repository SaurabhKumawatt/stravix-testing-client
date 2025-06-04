import React from "react";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const CertificateCard = () => {
  const { user } = useContext(UserContext); // assumes fullName is available
  const userName = user?.fullName || "Your Name";

  return (
    <div className="w-full flex justify-center items-center py-8 px-4">
      <div className="relative w-full max-w-4xl aspect-video">
        {/* Certificate Background */}
        <img
          src="/assets/images/tal.png"
          alt="Stravix Certificate"
          className="w-full h-full object-contain"
        />

        {/* Name Overlay */}
        <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center px-4">
          <h2 className="text-xl sm:text-3xl font-semibold text-black font-[cursive] tracking-wide">
            {userName}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
