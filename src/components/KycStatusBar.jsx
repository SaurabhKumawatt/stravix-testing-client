import { Icon } from "@iconify/react";

const KycStatusBar = ({ kycStatus }) => {
  return (
    <div className="max-w-4xl mx-auto my-4  bg-[#f8f8f8] rounded p-4 shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
      {/* Left Label */}
      <p className="text-sm sm:text-base font-semibold text-black">KYC Status</p>

      {/* Right Status Section */}
      {kycStatus === "approved" && (
        <div className="flex items-center gap-2">
          <span className="bg-[#00a85a] text-white px-4 py-1.5 text-xs sm:text-sm font-medium rounded shadow">
            Approved
          </span>
          <Icon icon="ix:certificate-success-filled" className="text-[#00a85a] text-lg sm:text-xl" />
        </div>
      )}

      {kycStatus === "pending" && (
        <span className="bg-[#f8c900] text-white px-4 py-1.5 text-xs sm:text-sm font-medium rounded shadow">
          Approval Pending
        </span>
      )}

      {(kycStatus === "not-submitted" || kycStatus === "rejected") && (
        <span className="bg-[#2177f6] text-white px-4 py-1.5 text-xs sm:text-sm font-medium rounded shadow">
          Update KYC
        </span>
      )}
    </div>
  );
};

export default KycStatusBar;