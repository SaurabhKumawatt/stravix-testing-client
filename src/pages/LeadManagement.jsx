import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import API from "../utils/axios";

const LeadManagement = () => {
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date");

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await API.get("/user/leads");
                const newLeads = res.data.filter((lead) => lead.status === "new");
                setLeads(newLeads);
                setFilteredLeads(newLeads);
            } catch (err) {
                console.error("Failed to fetch leads:", err);
            }
        };
        fetchLeads();
    }, []);

    useEffect(() => {
        let temp = [...leads];
        if (searchTerm.trim()) {
            temp = temp.filter((lead) =>
                (lead.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (lead.mobileNumber || "").includes(searchTerm) ||
                (lead.affiliateCode || "").includes(searchTerm)
            );
        }
        if (sortBy === "name") {
            temp.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        } else {
            temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        setFilteredLeads(temp);
    }, [searchTerm, sortBy, leads]);

    const deleteLead = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead?")) return;
        try {
            await API.delete(`/user/leads/${id}`);
            setLeads((prev) => prev.filter((l) => l._id !== id));
        } catch (err) {
            console.error("Failed to delete lead:", err);
        }
    };

    return (
        <div className="w-full p-4 min-h-screen pb-24">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-4">
                <h2 className="text-xl font-bold"></h2>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Icon icon="akar-icons:search" className="absolute left-2 top-2.5 text-gray-500 text-lg" />
                        <input
                            type="text"
                            placeholder="Search by name, mobile, or MT ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 pr-4 py-2 border rounded-md text-sm"
                        />
                    </div>
                    <button
                        onClick={() => setSortBy(sortBy === "name" ? "date" : "name")}
                        className="p-2 border rounded-md flex items-center gap-1 text-sm"
                    >
                        <Icon icon="solar:sort-vertical-bold-duotone" className="text-lg" />
                        {sortBy === "name" ? "Sort by Name" : "Sort by Date"}
                    </button>
                </div>
            </div>

            {/* 📱 Mobile View */}
            <div className="md:hidden flex flex-col gap-4">
                {filteredLeads.map((lead, idx) => (
                    <div key={lead._id} className="bg-white shadow rounded p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <img
                                src={lead.profileImage || "https://api.iconify.design/ix:user-profile-filled.svg"}
                                alt="User"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-medium">{lead.name || "Unnamed"}</p>
                                <p className="text-xs text-gray-500">Reg: {new Date(lead.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-sm">📱 <strong>Mobile:</strong> {lead.leadUserId?.mobileNumber || "N/A"}</div>
                        <div className="text-sm">🆔 <strong>MT ID:</strong> {lead.leadUserId?.affiliateCode || "N/A"}</div>

                        <button
                            onClick={() => deleteLead(lead._id)}
                            className="text-red-500 text-sm flex items-center gap-1 mt-2 self-start"
                        >
                            <Icon icon="material-symbols-light:delete-outline-rounded" className="text-lg" />
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {/* 💻 Desktop Table */}
            <div className="hidden md:block overflow-auto border rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Mobile</th>
                            <th className="p-3">MT ID</th>
                            <th className="p-3">Registration Date</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map((lead, i) => (
                            <tr key={lead._id} className="border-b">
                                <td className="p-3">{i + 1}</td>
                                <td className="p-3 flex items-center gap-2">
                                    <img
                                        src={lead.profileImage || "https://api.iconify.design/ix:user-profile-filled.svg"}
                                        alt="User"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span>{lead.name || "Unnamed"}</span>
                                </td>
                                <td className="p-3">{lead.leadUserId?.mobileNumber || "N/A"}</td>
                                <td className="p-3">{lead.leadUserId?.affiliateCode || "N/A"}</td>

                                <td className="p-3">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => deleteLead(lead._id)}
                                        className="text-red-500 text-sm flex items-center gap-1"
                                    >
                                        <Icon icon="material-symbols-light:delete-outline-rounded" className="text-lg" />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeadManagement;
