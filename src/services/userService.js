import API from "../utils/axios";

/**
 * 🧾 Get industry earnings (array of { label, currentTotal })
 */
export const fetchIndustryEarnings = async () => {
  try {
    const res = await API.get("/user/industry-earnings");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch industry earnings:", err);
    throw err;
  }
};


export const fetchSalesStats = async (filter = "daily") => {
  const res = await API.get(`/user/sales-stats?type=${filter}`);
  return res.data;
};
