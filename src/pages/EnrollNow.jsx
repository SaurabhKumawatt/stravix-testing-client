import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Header from '../components/Header';
import { Icon } from '@iconify/react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchAllCourses } from '../services/courseService';
import { initiatePayment } from '../services/paymentService';
import { registerUser } from "../services/authService";

const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email().required("Email is required"),
  confirmEmail: yup.string()
    .oneOf([yup.ref("email")], "Emails do not match")
    .required("Confirm Email is required"),
  state: yup.string().required("State is required"),
  dob: yup.date().max(new Date(), "DOB cannot be in the future").required("DOB is required"),
  mobile: yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .required("Mobile number is required"),
  password: yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/^\S+$/, "No spaces allowed")
    .required("Password is required"),
  referralCode: yup.string().notRequired(),
  terms: yup.bool().oneOf([true], "You must accept terms & conditions"),
});

function EnrollNow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { slug } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const refCode = searchParams.get("stx_id") || searchParams.get("ref");
    if (refCode) setValue("referralCode", refCode);
  }, [searchParams, setValue]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const all = await fetchAllCourses();
        setCourses(all);

        if (!selectedCourse && all.length) {
          if (slug) {
            const match = all.find(c => c.slug === slug);
            if (match) return setSelectedCourse(match._id);
          }
          setSelectedCourse(all[0]._id);
        }
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };
    loadCourses();
  }, [slug, selectedCourse]);

  const onSubmit = async (data) => {
    try {
      const selected = courses.find(c => c._id === selectedCourse);
      if (!selected) return alert("Please select a course");

      await registerUser({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        mobileNumber: data.mobile,
        password: data.password,
        sponsorCode: data.referralCode,
        address: data.state,
        state: data.state,
        dob: data.dob,
      });

      const { order } = await initiatePayment(
        selected.discountedPrice || selected.price,
        selectedCourse,
        selectedCourse
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Stravix",
        description: selected.title,
        order_id: order.id,
        handler: () => window.location.href = "/dashboard",
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.mobile
        },
        theme: { color: "#3B82F6" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Registration or Payment failed:", err);
      alert(err?.response?.data?.message || "Something went wrong.");
    }
  };

  const allIndianRegions = [..."Andaman and Nicobar Islands,Andra Pradesh,Arunachal Pradesh,Assam,Bihar,Chandigarh,Chhattisgarh,Dadar and Nagar Haveli,Daman and Diu,Delhi,Goa,Gujarat,Haryana,Himachal Pradesh,Jammu and Kashmir,Jharkhand,Karnataka,Kerala,Lakshadeep,Madya Pradesh,Maharashtra,Manipur,Meghalaya,Mizoram,Nagaland,Orissa,Pondicherry,Punjab,Rajasthan,Sikkim,Tamil Nadu,Telangana,Tripura,Uttar Pradesh,Uttaranchal,West Bengal".split(',')].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <Header />
      <section className="min-h-screen bg-color py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Select Your Bundle</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {courses
                .filter(course => !slug || course.slug === slug)
                .map((course) => (
                  <label key={course._id} className={`relative border p-3 rounded-lg cursor-pointer hover:shadow-md transition ${selectedCourse === course._id ? 'ring-2 ring-yellow-500' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      name="course"
                      value={course._id}
                      className="absolute top-2 left-2 accent-yellow-500"
                      checked={selectedCourse === course._id}
                      onChange={() => !slug && setSelectedCourse(course._id)}
                      disabled={!!slug}
                    />
                    <img
                    src={
                      course.thumbnail
                        ? `${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`
                        : "/assets/course-default.jpg"
                    }
                    alt={course.title}
                    className="w-full h-28 object-cover rounded-md"
                    crossOrigin="anonymous"
                  />
                    <p className="font-medium text-sm">{course.title}</p>
                    <p className="text-xs text-gray-500">₹{course.discountedPrice || course.price}</p>
                  </label>
                ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="lg:w-1/2 bg-white p-6 rounded-xl shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Full Name</label>
                <input {...register("fullName")} className="input" />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Username</label>
                <input {...register("username")} className="input" />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input {...register("email")} className="input" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Confirm Email</label>
                <input {...register("confirmEmail")} className="input" />
                {errors.confirmEmail && <p className="text-red-500 text-sm">{errors.confirmEmail.message}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">State</label>
                <select {...register("state")} className="input">
                  <option value="">Select State</option>
                  {allIndianRegions.map(region => <option key={region} value={region}>{region}</option>)}
                </select>
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">DOB</label>
                <DatePicker
                  className="input"
                  selected={watch("dob")}
                  onChange={date => setValue("dob", date)}
                  placeholderText="Select date"
                  dateFormat="MM/dd/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  maxDate={new Date()}
                  dropdownMode="select"
                />
                {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Mobile</label>
                <input {...register("mobile")} className="input" />
                {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
              </div>
              <div className="relative">
                <label className="block mb-1 text-sm font-medium">Password</label>
                <input type={showPassword ? "text" : "password"} {...register("password")} className="input pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500 text-lg">
                  <Icon icon={showPassword ? "ooui:eye-closed" : "ooui:eye"} />
                </button>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-1 text-sm font-medium">Referral Code</label>
              <input {...register("referralCode")} className="input" />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input type="checkbox" {...register("terms")} className="w-4 h-4" />
              <p className="text-sm">
                I agree with <a href="/terms-and-conditions" className="text-primary underline">Terms & Conditions</a> and <a href="/refund-policy" className="text-primary underline">Refund Policy</a>
              </p>
            </div>
            {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>}

            <button type="submit" className="bg-primary text-white font-semibold mt-6 w-full py-3 rounded-full hover:opacity-90 transition">
              Enroll Now
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default EnrollNow;
