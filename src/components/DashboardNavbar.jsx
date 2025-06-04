import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import API from "../utils/axios";

const getTitleFromPath = (pathname) => {
  const path = pathname.split("/").filter(Boolean).pop();
  return path ? path.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Dashboard";
};

const DashboardNavbar = () => {
  const { pathname } = useLocation();
  const pageTitle = getTitleFromPath(pathname);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/user/me");
        setUser(res.data);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="w-full px-4 sm:px-6 py-3 flex items-center justify-between bg-white border-b shadow-sm z-50">
      {/* Left - Logo and Title */}
      <div className="flex items-center gap-3">
        <img src="/assets/logos/logo.png" alt="Logo" className="h-8 sm:h-10" />
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{pageTitle}</h1>
      </div>

      {/* Right - Notifications + Profile */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Icon icon="clarity:notification-solid" className="text-gray-600 w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Image or Default Icon */}
        {user?.profileImage ? (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}${user.profileImage}`}
            alt="User"
            className="w-8 h-8 rounded-full object-cover border"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border">
            <Icon icon="ix:user-profile-filled" className="text-gray-500 w-full h-full" />
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardNavbar;
