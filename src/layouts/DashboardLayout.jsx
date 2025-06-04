import React from 'react'
import Sidebar from "../components/DashboardSideBar";
import Header from "../components/DashboardNavbar";
import { Outlet } from "react-router-dom";


function DashboardLayout() {
    return (
 <div className="h-screen flex flex-col overflow-hidden">
      {/* ✅ Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <Header />
      </header>

      {/* ✅ Main Layout */}
      <div className="flex flex-1 h-full">
        <Sidebar />

        {/* Main content scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
    )
}

export default DashboardLayout