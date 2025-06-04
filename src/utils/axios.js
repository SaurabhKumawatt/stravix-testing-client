// axios.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ✅ Critical for sending JWT cookies across domains
});

// ✅ Optional: Global response error handler
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data?.message || err.message);
    return Promise.reject(err);
  }
);

export default API;
