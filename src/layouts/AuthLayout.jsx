// src/layouts/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="">
      <div className="">
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
