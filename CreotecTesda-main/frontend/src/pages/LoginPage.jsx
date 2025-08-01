// File: src/pages/LoginPage.jsx
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import LoadingSpinner from '../components/LoadingSpinner';
import '../index.css';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordActive, setForgotPasswordActive] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-[#5e5b71] p-5 overflow-hidden">
      {isLoading && <LoadingSpinner overlay size={50} color="white" />}
      <div className="fixed inset-0 z-0 pointer-events-none" id="backgroundAnimation"></div>

      <div className="login-container flex flex-col md:flex-row w-full max-w-[1100px] h-auto md:h-[650px] bg-[#2d2b38] rounded-[20px] overflow-hidden shadow-xl relative z-10">
        <div className="hidden md:flex w-full md:w-[48%] relative p-10 flex-col justify-between bg-gradient-to-br from-[#6b55c7] to-[#4c3a91]">
          {/* Optional: Insert building image */}
          {/* <div className="absolute inset-0 z-0 overflow-hidden">
            <img src="../assets/CREOTEC_BUILDING.jpg" alt="Creotec Building" className="w-full h-full object-cover object-center" />
          </div> */}
          <div className="z-10 text-white mt-auto pt-[90px]">
            {/* Optional banner content here */}
          </div>
        </div>

          <div className="form-section w-full md:w-[60%] p-[50px] md:p-[70px] flex flex-col justify-center items-center">
          <div className="w-full flex flex-col justify-center items-center mb-10">
            <img
              src="/logo-violet.svg"
              alt="Logo"
              className="h-25 w-25 object-contain mb-2"
              style={{ minWidth: 48 }}
            />
            <h1 className="text-white font-bold text-3xl text-center">Certificate Generator</h1>
          </div>
            {forgotPasswordActive ? (
              <ForgotPasswordForm
                onBackToLogin={() => setForgotPasswordActive(false)}
              />
            ) : (
              <LoginForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onForgotPassword={() => setForgotPasswordActive(true)}
                onSignUp={() => setShowSignUp(true)}
              />
            )}
          </div>
       
      </div>
    </div>
  );
}
