// File: ReferralLink.jsx
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import API from "../utils/axios";

const ReferralLink = () => {
  const [bundles, setBundles] = useState([]);
  const [selected, setSelected] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUserAndBundles = async () => {
      try {
        const userRes = await API.get("/user/me");
        setAffiliateCode(userRes.data.affiliateCode);
        const bundlesRes = await API.get("/courses");
        const onlyBundles = bundlesRes.data.filter(c => c.isBundle);
        setBundles(onlyBundles);
        generateReferralLink(null, userRes.data.affiliateCode);
      } catch (err) {
        console.error("Failed to load bundles or user", err);
      }
    };

    fetchUserAndBundles();
  }, []);

  const generateReferralLink = (course, affCode) => {
    const baseUrl = window.location.origin;
    if (course && course.slug) {
      setReferralLink(`${baseUrl}/enroll/${course.slug}?ref=${affCode}`);
    } else {
      setReferralLink(`${baseUrl}/enroll?ref=${affCode}`);
    }
  };

  const handleSelect = (courseId) => {
    const selectedCourse = bundles.find(b => b._id === courseId);
    setSelected(courseId);
    generateReferralLink(selectedCourse, affiliateCode);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  return (
    <div className="w-full min-h-screen p-6 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">Referral Link</h2>

        <label className="block mb-1 text-sm font-medium">Select Bundle Course</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={selected}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">All Courses</option>
          {bundles.map(course => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>

        <label className="block mb-1 text-sm font-medium">Referral Link</label>
        <div className="flex">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-grow border rounded-l px-3 py-2 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
          >
            Copy Link
          </button>
        </div>

        {copied && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded shadow text-sm animate-fade-in-out">
            Link copied!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralLink;