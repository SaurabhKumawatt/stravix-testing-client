import React, { useContext, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { UserContext } from "../contexts/UserContext";
import API from "../utils/axios";
import { fetchIndustryEarnings } from "../services/userService";
import { fetchSalesStats } from "../services/userService";
import { Icon } from "@iconify/react/dist/iconify.js";



const pieColors = ["#1f3bb3", "#a66bd0", "#06d6a0", "#00aaff", "#f43f5e", "#f59e0b"];

const FullDashboard = () => {
    const [loading, setLoading] = useState(true);

    const { user } = useContext(UserContext);
    const [commissions, setCommissions] = useState([]);
    const [earnings, setEarnings] = useState([]);
    const [leads, setLeads] = useState([]);
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [filterType, setFilterType] = useState("daily"); // toggle: daily, weekly, monthly

    useEffect(() => {
        const loadStats = async () => {
            const { pieData, barData } = await fetchSalesStats(filterType);
            console.log("📊 barData:", barData);
            setBarData(barData);
            setPieData(pieData);
        };
        loadStats();
    }, [filterType]);


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const commissionRes = await API.get("/user/commissions");
                const leadRes = await API.get("/user/leads");
                setCommissions(commissionRes.data);
                setLeads(leadRes.data);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            }
        };

        fetchDashboardData();
    }, []);
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchIndustryEarnings();
                setEarnings(data);
            } catch (err) {
                console.error("Error loading industry earnings:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);
    const totalEarning = commissions.reduce((sum, c) => sum + c.amount, 0);
    const todaysEarning = commissions.filter(c => new Date(c.createdAt).toDateString() === new Date().toDateString()).reduce((sum, c) => sum + c.amount, 0);

    const last7DaysEarning = commissions
        .filter(c => {
            const created = new Date(c.createdAt);
            const now = new Date();
            const diffInDays = (now - created) / (1000 * 60 * 60 * 24);
            return diffInDays <= 7;
        })
        .reduce((sum, c) => sum + c.amount, 0);
    const thisMonthEarning = commissions.filter(c => {
        const created = new Date(c.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).reduce((sum, c) => sum + c.amount, 0);

    const topLeads = leads.slice(0, 5).map(l => l.name);

    if (!user) {
        return <p className="p-6">Loading dashboard...</p>;
    }

    return (
        <>
            <section className="p-4 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-md">
                    {user?.profileImage ? (
                              <img
                                src={`${import.meta.env.VITE_BACKEND_URL}${user.profileImage}`}
                                alt="User"
                                className="w-35 h-35 rounded-full object-cover border"
                                crossOrigin="anonymous"
                              />
                            ) : (
                              <div className="w-35 h-35 rounded-full bg-gray-100 flex items-center justify-center border">
                                <Icon icon="ix:user-profile-filled" className="text-gray-500 w-full h-full" />
                              </div>
                            )}
                    <p className="text-gray-500">Welcome</p>
                    <h2 className="text-xl font-bold text-primary">{user.fullName}</h2>
                    <p className="text-sm font-semibold mt-1">{user.affiliateCode}</p>
                    <p className="text-sm font-semibold mt-1">{user.affiliateCode}</p>
                    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-md text-center">
                        <div className="text-secondary text-2xl font-bold">₹{todaysEarning}</div>
                        <p className="mt-2">Today's Earning</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-md text-center">
                        <div className="text-primary text-2xl font-bold">₹{last7DaysEarning}</div>
                        <p className="mt-2">Last 7 Days</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-md text-center">
                        <div className="text-primary text-2xl font-bold">₹{thisMonthEarning}</div>
                        <p className="mt-2">This Month</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-md text-center">
                        <div className="text-green-600 text-2xl font-bold">₹{totalEarning}</div>
                        <p className="mt-2">Total Earning</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow">
                        <h3 className="text-lg font-bold mb-4">📈 Industry Earnings</h3>
                        {loading ? (
                            <p>Loading...</p>
                        ) : earnings.length === 0 ? (
                            <p className="text-sm text-gray-500">No earnings available.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200 text-sm">
                                {earnings.map((item, index) => (
                                    <li key={index} className="flex justify-between py-2">
                                        <span className="text-gray-700">{item.label}</span>
                                        <span className="font-medium text-green-600">₹{item.currentTotal.toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md">
                    <div className="font-semibold text-primary mb-4">Sales Tracker</div>
                    <div className="mb-4">
                        <label className="mr-2 font-semibold">Select Filter:</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="border px-3 py-1 rounded-md"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>

                        <BarChart data={barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="earnings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md">
                    <div className="font-semibold text-primary mb-4">Bundlewise Tracker</div>
                    {pieData.length === 0 ? (
                        <p className="text-sm text-gray-500">No sales data available.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    cx="50%" cy="50%"
                                    outerRadius={90}
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={index} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    )}

                </div>

                <div className="bg-white p-4 rounded-xl shadow-md">
                    <div className="font-semibold text-primary mb-4">My Top Leads</div>
                    <ul className="space-y-2">
                        {topLeads.map((lead, i) => (
                            <li key={i} className="flex items-center gap-2 border p-2 rounded-md text-gray-800">
                                <span className="text-lg">👤</span>
                                {lead}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
};

export default FullDashboard;
