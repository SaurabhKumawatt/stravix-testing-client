import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import { Icon } from "@iconify/react";
import KycStatusBar from "../components/KycStatusBar";

const KycForm = () => {
    const [formData, setFormData] = useState({
        accountHolderName: "",
        accountNumber: "",
        bankName: "",
        ifscCode: "",
        branch: "",
        upiId: "",
        aadhaarNumber: "",
        panCard: "",
        aadhaarFrontImage: null,
        aadhaarBackImage: null,
        panProofImage: null,
    });
    
    const [kycStatus, setKycStatus] = useState(null);
    
    useEffect(() => {
        const fetchKyc = async () => {
            try {
                const res = await API.get("/user/kyc-status");
                console.log("📥 KYC response:", res.data); // ✅ Check this in devtools
                
                const { status, kyc } = res.data;
                console.log("📥 KYC response:", kyc); // ✅ Check this in devtools
                
                setKycStatus(status);
                
                if (kyc) {
                    setFormData({
                        accountHolderName: kyc.accountHolderName || "",
                        accountNumber: kyc.accountNumber || "",
                        bankName: kyc.bankName || "",
                        ifscCode: kyc.ifscCode || "",
                        branch: kyc.branch || "",
                        upiId: kyc.upiId || "",
                        aadhaarNumber: kyc.aadhaarNumber || "",
                        panCard: kyc.panCard || "",
                        aadhaarFrontImage: kyc.aadhaarFrontImage || null,
                        aadhaarBackImage: kyc.aadhaarBackImage || null,
                        panProofImage: kyc.panProofImage || null,
                    });
                }
            } catch (err) {
                console.error("❌ KYC fetch failed:", err);
            }
        };
        
        fetchKyc();
    }, []);
    
    
    const isDisabled = kycStatus === "approved";
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = new FormData();
        for (const key in formData) {
            body.append(key, formData[key]);
        }
        
        try {
            const res = await API.post("/user/submit-kyc", body, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.message || "KYC submission failed");
        }
    };
    
    return (
        <><KycStatusBar kycStatus={kycStatus} /><form
            className="max-w-4xl mx-auto bg-white p-6 rounded shadow min-h-screen pb-24"
            onSubmit={handleSubmit}
        >
            <h2 className="text-xl font-bold mb-4">Bank Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Account Holder Name" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} disabled={isDisabled} />
                <Input label="Bank Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} disabled={isDisabled} />
                <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} disabled={isDisabled} />
                <Input label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} disabled={isDisabled} />
                <Input label="Branch" name="branch" value={formData.branch} onChange={handleChange} disabled={isDisabled} />
                <Input label="UPI ID" name="upiId" value={formData.upiId} onChange={handleChange} disabled={isDisabled} />
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4">Document Upload</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Aadhaar Number" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} disabled={isDisabled} />
                <Input label="PAN Number" name="panCard" value={formData.panCard} onChange={handleChange} disabled={isDisabled} />
                <FileInput label="Aadhaar Front" name="aadhaarFrontImage" file={formData.aadhaarFrontImage} onChange={handleChange} disabled={isDisabled} />
                <FileInput label="Aadhaar Back" name="aadhaarBackImage" file={formData.aadhaarBackImage} onChange={handleChange} disabled={isDisabled} />
                <FileInput label="PAN Card Image" name="panProofImage" file={formData.panProofImage} onChange={handleChange} disabled={isDisabled} />
            </div>

            <button
                type="submit"
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                disabled={isDisabled}
            >
                {isDisabled ? "KYC Already Approved" : "Submit KYC"}
            </button>
        </form></>
    );
};

const Input = ({ label, name, value, onChange, disabled }) => (
    <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
            {label} <span className="text-red-600">*</span>
        </label>
        <input
            type="text"
            name={name}
            value={value || ""}
            onChange={onChange}
            required
            disabled={disabled}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            />
    </div>
);

const FileInput = ({ label, name, file, onChange, disabled }) => {
    const baseURL = import.meta.env.VITE_API_URL.replace("/api", ""); // Remove /api for file access
    const fileURL =
    typeof file === "string"
    ? `${baseURL}/${file.replace(/\\/g, "/")}`
    : null;
    
    return (
        <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label} <span className="text-red-600">*</span>
      </label>

      {fileURL && disabled && (
          <img
          src={fileURL}
          alt={`${label} Preview`}
          className="w-40 h-auto rounded border mb-2"
          crossOrigin="anonymous"
          />
        )}

      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={onChange}
        required={!disabled}
        disabled={disabled}
        className="w-full"
        />
    </div>
  );
};


export default KycForm;
