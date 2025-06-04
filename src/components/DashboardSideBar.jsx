import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

const DashboardSideBar = () => {
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // only affects mobile

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640); // sm breakpoint
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const [expanded, setExpanded] = useState({ education: false, profile: false });
  const toggleExpand = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const navItems = [
    { name: "Dashboard", icon: "material-symbols:dashboard-rounded", path: "/dashboard" },
    { name: "My Income", icon: "healthicons:low-income-level", path: "/my-income" },
    { name: "Lead Management", icon: "ph:network-fill", path: "/leads-management" },
    {
      name: "Education Hub", icon: "wpf:books", submenu: true, key: "education", children: [
        { name: "My Courses", path: "/my-courses" },
        { name: "My Certificates", path: "/my-certificates" },
        { name: "Webinars/Trainings", path: "/webinars" },
      ]
    },
    {
      name: "My Profile", icon: "ix:user-profile-filled", submenu: true, key: "profile", children: [
        { name: "Personal Details", path: "/my-profile" },
        { name: "KYC", path: "/profile/kyc" },
      ]
    },
    { name: "Referral Link", icon: "zondicons:link", path: "/referral-link" },
    { name: "StraviX Community", icon: "ri:team-fill", path: "/community" },
    { name: "Support Hub", icon: "fluent:person-support-28-filled", path: "/support" },
  ];

  const isActive = (path) => pathname.startsWith(path);

  const showText = !isMobile || (isMobile && !isCollapsed);

  return (
    <aside
      className={`bg-white border-r h-full flex flex-col transition-all duration-300
        ${isMobile ? (isCollapsed ? "w-[60px]" : "w-64") : "w-64"}`}
    >

      {/* Nav Items */}
      <nav className="flex-1 w-full overflow-y-auto px-1 sm:px-4 py-4 space-y-1">
        {navItems.map((item, idx) =>
          item.submenu ? (
            <div key={idx}>
              <button
                onClick={() => toggleExpand(item.key)}
                className={`flex items-center justify-between w-full px-2 py-2 rounded-md text-left hover:bg-gray-100 ${
                  item.children.some((c) => isActive(c.path)) ? "bg-[#EFF4FF] text-blue-600" : "text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon icon={item.icon} className="w-5 h-5" />
                  {showText && item.name}
                </span>
                {showText && <span>{expanded[item.key] ? "▲" : "▼"}</span>}
              </button>
              {expanded[item.key] && showText && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child, idc) => (
                    <NavLink
                      key={idc}
                      to={child.path}
                      className={({ isActive }) =>
                        `block px-3 py-1.5 rounded-md text-sm ${
                          isActive ? "bg-[#EFF4FF] text-blue-600" : "text-gray-600 hover:bg-gray-100"
                        }`
                      }
                    >
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 rounded-md font-medium ${
                  isActive ? "bg-[#EFF4FF] text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon icon={item.icon} className="w-5 h-5" />
              {showText && item.name}
            </NavLink>
          )
        )}
      </nav>

      {/* Collapse Button - ONLY on Mobile */}
      {isMobile && (
        <div className="w-full py-3 flex justify-center border-t">
          <button onClick={toggleCollapse} className="text-blue-600 flex items-center gap-1 text-sm">
            <Icon
              icon={
                isCollapsed
                  ? "material-symbols:chevron-right-rounded"
                  : "material-symbols:chevron-left-rounded"
              }
              className="w-6 h-6"
            />
          </button>
        </div>
      )}
    </aside>
  );
};

export default DashboardSideBar;
