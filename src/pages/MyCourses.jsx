import React, { useEffect, useState } from "react";
import EnrollCourseCard from "../components/EnrollCourseCard";
import BundleCard from "../components/BundleCard";
import API from "../utils/axios";

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [notEnrolledCourses, setNotEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [enrolledRes, allCoursesRes] = await Promise.all([
          API.get("/enrollments/my-enrollments"),
          API.get("/courses")
        ]);

        const enrolledCourseObjects = enrolledRes.data
          .filter((enroll) => enroll.courseId && enroll.courseId._id) // ✅ safeguard
          .map((enroll) => ({
            course: enroll.courseId,
            progress: enroll.progress || 0
          }));

        const enrolledCourseIds = enrolledCourseObjects.map(
          (item) => item.course._id
        );

        const notEnrolled = allCoursesRes.data.filter(
          (course) => !enrolledCourseIds.includes(course._id)
        );

        setEnrolledCourses(enrolledCourseObjects);
        setNotEnrolledCourses(notEnrolled);
      } catch (error) {
        console.error("❌ Error fetching My Courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto min-h-screen pb-24">
      <h2 className="text-2xl font-semibold mb-4">My Courses</h2>

      {enrolledCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {enrolledCourses.map(({ course, progress }) => (
            <EnrollCourseCard key={course._id} course={course} progress={progress} />
          ))}
        </div>
      )}

      {notEnrolledCourses.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-4 mb-4">Explore More Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notEnrolledCourses.map((course) => (
              <BundleCard
                key={course._id}
                title={course.title}
                image={course.thumbnail}
                price={course.discountedPrice || course.price}
                originalPrice={course.price}
                rating={0}
                slug={course.slug}
                enrolled={false}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyCourses;
