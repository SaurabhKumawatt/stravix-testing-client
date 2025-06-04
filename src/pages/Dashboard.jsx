import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../contexts/UserContext";
import FullDashboard from "./FullDashboard";
import LogoutButton from "../components/logoutButton";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardSideBar from "../components/DashboardSideBar";

const Dashboard = () => {
  const { user, fetchUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser(); // Refetch on dashboard load to get latest user details
  }, []);

  const handleUpdateKYC = () => navigate("/kyc-form");
  const handleStartTraining = () => navigate("/courses");
  const handleMyCourses = () => navigate("/my-courses");

  if (!user) return <p className="p-6">Loading user...</p>;

  const kycStatus = user.kycStatus || "not-submitted";
  const statusDisplay = kycStatus.toUpperCase();

  return (
    <>
    <div className="flex">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Dashboard Content */}
      <section className="flex-1 bg-white p-6">
      <LogoutButton />
        <h2 className="text-2xl font-semibold mb-2">
          Welcome <span className="text-primary">{user.fullName}</span>!
        </h2>
        <p className="text-md text-gray-700 mb-4">
          STX ID:{" "}
          <strong>{user.affiliateCode || "STX0000001"}</strong>
        </p>
        <p className="text-md mb-6">
          KYC Status:{" "}
          <span
            className={`font-semibold ${
              kycStatus === "approved"
              ? "text-green-600"
              : kycStatus === "rejected"
              ? "text-red-600"
              : "text-yellow-600"
            }`}
            >
            {statusDisplay}
          </span>
        </p>

        {kycStatus !== "approved" ? (
          <>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleUpdateKYC}
                className="bg-yellow-400 text-black font-semibold px-6 py-4 rounded-md shadow hover:opacity-90"
                >
                Update KYC
              </button>
              <button
                onClick={handleStartTraining}
                className="bg-primary text-white font-semibold px-6 py-4 rounded-md shadow hover:opacity-90"
                >
                Start Training
              </button>
              <button
                onClick={handleMyCourses}
                className="bg-accent text-white font-semibold px-6 py-4 rounded-md shadow hover:opacity-90"
                >
                My Courses
              </button>
            </div>
            <p className="mt-8 text-center text-primary font-medium">
              Update your KYC to see your full dashboard
            </p>
          </>
        ) : (
          <>
            <FullDashboard />
          </>
        )}
      </section>
    </div>
        </>
  );
};

export default Dashboard;
