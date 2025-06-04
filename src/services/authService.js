// src/services/authService.js
import API from "../utils/axios";

// ✅ Register a new user (sets HttpOnly cookie)
export const registerUser = async (userData) => {
  const res = await API.post("/user/register", userData);
  return res.data;
};

// ✅ Login user (sets HttpOnly cookie)
export const loginUser = async (credentials) => {
  const res = await API.post("/user/login", credentials);
  return res.data;
};

// ✅ Fetch authenticated user's profile
export const getProfile = async () => {
  const res = await API.get("/user/me");
  return res.data;
};

// ✅ Logout user (clears HttpOnly cookie on server)
export const logoutUser = async () => {
  try {
    await API.get("/user/logout");
  } catch (err) {
    console.error("Logout failed:", err.response?.data?.message || err.message);
  }
};
