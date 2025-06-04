import API from "../utils/axios";

/**
 * 🔐 Initiate Razorpay Payment (Course/Bundle)
 * @param {number} amount - Total amount in ₹ (not paisa)
 * @param {string} courseId - ID of the course user is buying
 * @param {string|null} forBundleCourseId - Optional: If part of a bundle
 */
export const initiatePayment = async (amount, courseId, forBundleCourseId = null) => {
  try {
    if (!amount || !courseId) {
      throw new Error("Amount and Course ID are required for payment.");
    }

    const res = await API.post("/payments/initiate", {
      amount,
      courseId,
      forBundleCourseId: forBundleCourseId || courseId, // fallback if null
    });

    return res.data; // { order }
  } catch (err) {
    console.error("❌ Payment initiation failed:", err.response?.data?.message || err.message);
    throw err;
  }
};


/**
 * ✅ Fetch all user payments
 */
export const fetchUserPayments = async () => {
  try {
    const res = await API.get("/payments/my-payments");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch payments:", err.response?.data?.message || err.message);
    throw err;
  }
};
