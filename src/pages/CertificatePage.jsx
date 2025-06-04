import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CertificateCard from "../components/CertificateCard";

const CertificatePage = () => {
  const certificateRef = useRef();

const handleDownload = async () => {
  const input = certificateRef.current;

  try {
    const canvas = await html2canvas(input, {
      scale: 3,          // ⬅️ High resolution
      useCORS: true,     // ⬅️ Required for local images (e.g., certificate background)
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("stravix-certificate.pdf");
  } catch (err) {
    console.error("❌ Error generating PDF:", err);
    alert("Certificate download failed. Try again.");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10 pb-24">
      {/* CertificateCard wrapped with ref */}
      <div ref={certificateRef} className="w-full max-w-4xl aspect-video mx-auto">
        <CertificateCard />
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
      >
        Download My Certificate
      </button>
    </div>
  );
};

export default CertificatePage;
