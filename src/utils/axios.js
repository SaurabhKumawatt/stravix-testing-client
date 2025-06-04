// axios.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 🔐 Allows sending cookies
});

// Optional: intercept responses for global error handling
API.interceptors.response.use(
  (res) => res,
  (err) => {
    // Optional: global error logging or redirect
    console.error("API Error:", err.response?.data?.message || err.message);
    return Promise.reject(err);
  }
);

export default API;
