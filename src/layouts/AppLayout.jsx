// src/layouts/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header"; // adjust if needed
import Footer from "../components/Footer"; // optional

const AppLayout = () => {
  return (
    <>
      {/* <Header /> */}
      <div className="">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default AppLayout;
