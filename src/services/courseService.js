import API from "../utils/axios";

// ✅ Fetch all published courses
export const fetchAllCourses = async () => {
  try {
    const res = await API.get("/courses");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch courses:", err.response?.data?.message || err.message);
    throw err; // Re-throw to handle it in components
  }
};

// ✅ Fetch a single course by slug
export const fetchCourseBySlug = async (slug) => {
  try {
    const res = await API.get(`/courses/${slug}`);
    return res.data;
  } catch (err) {
    console.error(`❌ Failed to fetch course (${slug}):`, err.response?.data?.message || err.message);
    throw err;
  }
};
