import React, { Suspense, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import MyIncome from "../pages/MyIncome";
import Kyc from "../pages/Home/Kyc";
import LeadManagement from "../pages/LeadManagement";
import CertificatePage from "../pages/CertificatePage";
import MyProfile from "../pages/MyProfile";
import ReferralLink from "../pages/ReferralLink";
import CommunityPage from "../pages/CommunityPage";
import SupportHub from "../pages/SupportHub";
import KycForm from "../pages/KycForm";



// Lazy-loaded Pages
const Home = React.lazy(() => import("../pages/Home"));
const Login = React.lazy(() => import("../pages/Login"));
const Register = React.lazy(() => import("../pages/Register"));
const BundleCoursesPage = React.lazy(() => import("../pages/BundleCoursesPage"));
const CoursesPage = React.lazy(() => import("../pages/CoursesPage"));
const BundleDetailsPage = React.lazy(() => import("../pages/BundleDetailsPage"));
const CourseDetailPage = React.lazy(() => import("../pages/CourseDetailPage"));
const AboutUs = React.lazy(() => import("../pages/AboutUs"));
const ContactUs = React.lazy(() => import("../pages/ContactUs"));
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const PrivacyPolicy = React.lazy(() => import("../pages/PrivacyPolicy"));
const TermsAndConditions = React.lazy(() => import("../pages/TermsAndConditions"));
const RefundPolicy = React.lazy(() => import("../pages/RefundPolicy"));
const Disclaimer = React.lazy(() => import("../pages/Disclaimer"));
const TransactionIdPage = React.lazy(() => import("../pages/TransactionIdPage"));
const MyCourses = React.lazy(() => import("../pages/MyCourses"));
const CoursePlayer = React.lazy(() => import("../pages/CoursePlayer"));
const ComingSoon = React.lazy(() => import("../pages/ComingSoon"));
const EnrollNow = React.lazy(() => import("../pages/EnrollNow"));

// Protected Route Wrapper
const RequireAuth = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  if (loading) return <div className="text-center py-10">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <Routes>
        {/* Public Routes under App Layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/bundle-courses" element={<BundleCoursesPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/bundle-courses/:slug" element={<BundleDetailsPage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Route>

        {/* Auth Routes under Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup/:slug" element={<Register />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/transaction-id" element={<TransactionIdPage />} />
          <Route path="/enroll/:slug" element={<EnrollNow />} />
          <Route path="/enroll" element={<EnrollNow />} />
          <Route path="/course/:slug/player" element={<CoursePlayer />} />
        </Route>

        {/* Protected Routes under App Layout */}
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-income" element={<MyIncome />} />
          <Route path="/leads-management" element={<LeadManagement />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/my-certificates" element={<CertificatePage />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/profile/Kyc" element={<KycForm />} />
          <Route path="/referral-link" element={<ReferralLink />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/support" element={<SupportHub />} />
        </Route>

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
