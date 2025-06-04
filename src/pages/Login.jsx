import React, { useState, useContext } from 'react';
import Header from '../components/Header';
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from '../contexts/UserContext';

function Login() {
  const navigate = useNavigate();
  const { fetchUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login`,
        { email, password },
        { withCredentials: true }
      );

      await fetchUser(); // 🔁 Refresh context
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <Header />
      <section className="lg:h-[80vh] m-auto bg-color flex items-center justify-center px-4">
        <div className="w-full my-6 max-w-4xl bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
          {/* Left: Form */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-xl font-semibold mb-6 text-color1">
              Login to StraviX
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm block mb-1 text-gray-700">Email Address</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:ring focus:ring-[#0163F8]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm block mb-1 text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-gray-300 rounded px-4 py-2 pr-10 outline-none focus:ring focus:ring-[#0163F8]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                  >
                    <Icon icon={showPassword ? "ooui:eye-closed" : "ooui:eye"} className="text-[20px]" />
                  </button>
                </div>
              </div>

              <div>
                <a href="/forgot-password" className="text-xs !text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="bg-color1 text-white font-semibold w-full py-2 rounded-full hover:opacity-90 transition"
              >
                Login
              </button>
            </form>
          </div>

          {/* Right: Illustration */}
          <div className="w-full md:w-1/2 bg-primary flex items-center justify-center p-6">
            <img
              src="/assets/images/login-page.png"
              alt="Login Illustration"
              className="max-w-xs w-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
