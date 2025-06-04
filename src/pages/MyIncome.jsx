import React, { useEffect, useState } from "react";
import API from "../utils/axios";
import { Icon } from "@iconify/react";

const MyIncome = () => {
  const [commissions, setCommissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const res = await API.get("/user/commissions");
        setCommissions(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching commissions:", err);
      }
    };
    fetchCommissions();
  }, []);

  useEffect(() => {
    let temp = [...commissions];
    if (searchTerm) {
      temp = temp.filter((c) => {
        const name = c.referralUser?.fullName?.toLowerCase() || "";
        const mobile = c.referralUser?.mobileNumber || "";
        return (
          name.includes(searchTerm.toLowerCase()) ||
          mobile.includes(searchTerm)
        );
      });
    }
    if (statusFilter !== "all") {
      temp = temp.filter((c) => c.status === statusFilter);
    }
    if (sortOption === "newest") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "oldest") {
      temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === "amountHigh") {
      temp.sort((a, b) => b.amount - a.amount);
    } else if (sortOption === "amountLow") {
      temp.sort((a, b) => a.amount - b.amount);
    }
    setFiltered(temp);
  }, [searchTerm, statusFilter, sortOption, commissions]);

  return (
    <div className="min-h-screen pb-24">

    <div className="w-full px-3 sm:px-6 md:px-10 py-6">
      

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name or mobile..."
            className="w-full border rounded-md py-2 pl-10 pr-4"
            onChange={(e) => setSearchTerm(e.target.value)}
            />
          <Icon icon="akar-icons:search" className="absolute left-3 top-2.5 text-gray-400" width={18} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Icon icon="solar:sort-vertical-bold-duotone" className="text-gray-500" width={20} />
            <select
              className="border rounded-md px-3 py-2"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="amountHigh">High to Low</option>
              <option value="amountLow">Low to High</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Icon icon="iconoir:filter" className="text-gray-500" width={20} />
            <select
              className="border rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="unpaid">Unpaid</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">S.No.</th>
              <th className="p-3">Name & Joining Date</th>
              <th className="p-3">Mobile No.</th>
              <th className="p-3">STX ID</th>
              <th className="p-3">Package</th>
              <th className="p-3">Commission</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c._id} className="border-t">
                <td className="p-3 text-center font-bold text-gray-700">{i + 1}</td>
                <td className="p-3 flex items-center gap-3">
                  <Icon
                    icon={c.referralUser?.profileImage ? undefined : "ix:user-profile-filled"}
                    className="w-8 h-8 rounded-full text-gray-500"
                    />
                  <div>
                    <p className="font-medium">{c.referralUser?.fullName || "N/A"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                </td>
                <td className="p-3">{c.referralUser?.mobileNumber || "N/A"}</td>
                <td className="p-3">{c.referralUser?.affiliateCode || "N/A"}</td>
                <td className="p-3">{c.bundleCourseId?.title || "N/A"}</td>
                <td className="p-3 font-semibold text-green-600">₹{c.amount}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    c.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : c.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-600"
                  }`}>
                    {c.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filtered.map((c, i) => (
          <div key={c._id} className="border rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Icon
                icon={c.referralUser?.profileImage ? undefined : "ix:user-profile-filled"}
                className="w-10 h-10 text-gray-400"
                />
              <div>
                <p className="font-semibold text-sm">{c.referralUser?.fullName || "N/A"}</p>
                <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs mb-1">MT ID: {c.referralUser?.affiliateCode || "N/A"}</p>
            <p className="text-xs mb-1">Mobile No.: {c.referralUser?.mobileNumber || "N/A"}</p>
            <p className="text-xs mb-1">Package: {c.bundleCourseId?.title || "N/A"}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium">Commission</span>
              <span className="font-semibold text-green-700">₹{c.amount}</span>
            </div>
            <div className="mt-1">
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                c.status === "paid"
                ? "bg-green-100 text-green-700"
                : c.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-200 text-gray-600"
              }`}>
                {c.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
        </div>
  );
};

export default MyIncome;
