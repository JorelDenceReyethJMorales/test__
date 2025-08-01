import React, { useState } from "react";
import { useAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

import TemplateSelection from "../components/TemplateSelection";
import CertificateDetails from "../components/DetailsForm";
import Signatories from "../components/SignatoriesForm";
import ExcelUploader from "../components/ExcelUploader";
import DownloadLinks from "../components/DownloadLinks";
import Sidebar from "../components/Sidebar";

function CertificateGenerator() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState("ojt");
  const [excelData, setExcelData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState([]);

  const handleExcelParsed = async (data) => {
    setExcelData(data);
    try {
      const response = await fetch("http://localhost:5000/upload/excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: data }),
      });
      if (!response.ok) throw new Error("Upload failed");
      const result = await response.json();
      console.log("Upload success:", result);
    } catch (error) {
      console.error("Error uploading excel data:", error);
    }
  };

  const detectedColumns = excelData.length > 0 ? Object.keys(excelData[0]) : [];

  const handleGenerate = async () => {
    if (excelData.length === 0) {
      alert("No data loaded. Please upload an Excel file first.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/generate/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: selectedTemplate,
          rows: excelData,
        }),
      });

      const result = await response.json();
      setGeneratedFiles((prev) => [...prev, ...(result.files || [])]);
      setPreviewLoading(false);
    } catch (err) {
      console.error("Error generating certificates:", err);
    }
  };

  const handlePreview = async () => {
    if (excelData.length === 0) {
      alert("No data loaded. Please upload an Excel file first.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/generate/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: selectedTemplate, rows: excelData }),
      });
      const html = await response.text();
      const previewWindow = window.open("", "_blank");
      previewWindow.document.write(html);
    } catch (err) {
      console.error("Error previewing certificate:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1f1f1f] text-white">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main Content on the right */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Logout */}
        <div className="flex justify-end mb-4">
          <button
            className="rounded-md bg-red-600 text-white px-3 py-1 hover:bg-red-700"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

        {/* Excel Upload */}
        <div className="container rounded-md">
          <h3 className="section-header">Upload Data File</h3>
          <ExcelUploader onDataParsed={handleExcelParsed} />

          {detectedColumns.length > 0 && (
            <div className="mt-4 bg-zinc-700 p-4 rounded-md text-white">
              <h4 className="font-semibold mb-2">Detected Columns:</h4>
              <div className="flex flex-wrap gap-2">
                {detectedColumns.map((col, idx) => (
                  <div
                    key={idx}
                    className="bg-violet-600 text-white text-sm px-3 py-1 rounded-full shadow-sm max-w-max"
                  >
                    {col}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Template Selection */}
        <div className="container rounded-md">
          <h3 className="section-header">Select a Template</h3>
          <TemplateSelection selected={selectedTemplate} onChange={setSelectedTemplate} />
        </div>

        {/* Custom Template Details */}
        {selectedTemplate === "custom" && (
          <div className="container rounded-md">
            <h3 className="section-header">Certificate Customization</h3>
            <CertificateDetails />
            <Signatories />
          </div>
        )}

        {/* Generate Buttons */}
        <div className="container rounded-md w-full flex gap-2">
          <button
            className="rounded-md bg-[#3737ff7e] p-2"
            onClick={handlePreview}
            disabled={previewLoading}
          >
            {previewLoading ? "Loading..." : "Preview"}
          </button>
          <button
            className="rounded-md bg-[#a361ef] p-2"
            id="generate-btn"
            onClick={handleGenerate}
          >
            Generate Certificates
          </button>
        </div>

        {/* Download Links */}
        {generatedFiles.length > 0 && <DownloadLinks files={generatedFiles} />}
      </div>
    </div>
  );
}

export default CertificateGenerator;
