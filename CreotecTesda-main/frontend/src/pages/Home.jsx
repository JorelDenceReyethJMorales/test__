import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#1f1f1f] text-white ml-59">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content with spacing from the sidebar */}
      <div className="flex-1 p-6 ml-6 overflow-y-auto">
        {" "}
        {/* 👈 add ml-6 here */}
        {/* Logout Button */}
        <div className="flex justify-end mb-4">
          <button
            className="rounded-md bg-red-600 px-4 py-2 font-medium hover:bg-red-700 transition"
            onClick={logout}
          >
            Logout
          </button>
        </div>
        {/* Welcome Container */}
        <div className="bg-[#292929] rounded-2xl px-10 py-8 shadow-xl text-center m-20 p-40">
          <h1
            className="text-[4rem] font-bold leading-none"
            style={{ fontFamily: "Arkitype" }}
          >
            CREOTEC
          </h1>
          <p className="text-base mt-1 tracking-widest">
            P H I L I P P I N E S &nbsp; I N C .
          </p>

          <p className="text-2xl font-semibold mt-6">
            Welcome to our internal certificate and training records system.
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mt-4">
            This platform allows you to automatically generate certificates for
            OJT and Immersion programs and conveniently create TESDA records by
            uploading an Excel file. It’s a fast and efficient way to manage
            your documents.
          </p>

          {/* Feature Cards */}
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <div className="bg-[#3e3e3e] hover:scale-[1.03] transition-all p-6 rounded-xl shadow-md w-72">
              <h2 className="text-xl font-semibold text-purple-300 mb-2">
                Fast Certificate Generator
              </h2>
              <p className="text-sm text-gray-400">
                Easily generate and download certificates with template-based
                automation.
              </p>
            </div>
            <div className="bg-[#3e3e3e] hover:scale-[1.03] transition-all p-6 rounded-xl shadow-md w-72">
              <h2 className="text-xl font-semibold text-purple-300 mb-2">
                TESDA Integration
              </h2>
              <p className="text-sm text-gray-400">
                Manage TESDA-related records, training documents, and
                performance tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
