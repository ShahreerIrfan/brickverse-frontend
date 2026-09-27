"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  IconClose,
  IconMail,
  IconLock,
  IconUser,
  IconEye,
  IconEyeOff,
  IconGoogle,
} from "./icons";

export default function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    login,
    sendOtp,
    verifyAndSignup,
    resendOtp,
  } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [signupStep, setSignupStep] = useState<"details" | "otp">("details");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Resend Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Close on Escape key
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAuthModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isAuthModalOpen, closeAuthModal]);

  // Reset errors on tab switch
  useEffect(() => {
    setErrorMsg("");
    setSuccessMsg("");
    setSignupStep("details");
  }, [authMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await login(loginEmail, loginPassword);
    setLoading(false);

    if (res.success) {
      closeAuthModal();
      router.push("/dashboard");
    } else {
      setErrorMsg(res.message || "Invalid credentials. Please try again.");
    }
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupFirstName.trim() || !signupLastName.trim()) {
      setErrorMsg("First name and last name are required.");
      return;
    }
    if (!signupEmail || !signupPassword) {
      setErrorMsg("Email and password are required.");
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await sendOtp(signupEmail);
    setLoading(false);

    if (res.success) {
      setSignupStep("otp");
      setSuccessMsg(res.message || `Verification code sent to ${signupEmail}`);
      setResendTimer(60);
    } else {
      setErrorMsg(res.error || res.message || "Failed to send verification code.");
    }
  };

  // Step 2: Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6);
      if (pasted.length > 0) {
        const newOtp = [...otpCode];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = pasted[i] || "";
        }
        setOtpCode(newOtp);
        const nextIndex = Math.min(pasted.length, 5);
        document.getElementById(`modal-otp-box-${nextIndex}`)?.focus();
        return;
      }
    }

    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = digit;
    setOtpCode(newOtp);

    if (digit && index < 5) {
      document.getElementById(`modal-otp-box-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      document.getElementById(`modal-otp-box-${index - 1}`)?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join("").trim();
    if (fullCode.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await verifyAndSignup({
      email: signupEmail,
      otp: fullCode,
      password: signupPassword,
      first_name: signupFirstName,
      last_name: signupLastName,
    });
    setLoading(false);

    if (res.success) {
      closeAuthModal();
      router.push("/dashboard");
    } else {
      setErrorMsg(res.error || res.message || "Invalid verification code. Please try again.");
    }
  };

  // Resend OTP in Modal
  const handleResendCode = async () => {
    if (resendTimer > 0 || loading) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await resendOtp(signupEmail);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || "A new verification code has been sent!");
      setResendTimer(60);
      setOtpCode(["", "", "", "", "", ""]);
      document.getElementById("modal-otp-box-0")?.focus();
    } else {
      setErrorMsg(res.error || res.message || "Failed to resend code.");
    }
  };

  const handleGoogleAuth = () => {
    setErrorMsg("Google OAuth sign in will be available shortly.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Dimmed Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-[#171136]/60 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* Modal Popup Card - Kawaii Subete Design System */}
      <div className="relative w-full max-w-[420px] bg-white rounded-[28px] shadow-2xl border border-[#EAE3F7] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button Top Right */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center text-[#736E9B] hover:text-[#171136] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <IconClose className="w-4 h-4" />
        </button>

        {/* Brand Logo Header */}
        <div className="flex flex-col items-center justify-center mb-5">
          <Image src="/logo.png" alt="Kawaii Subete" width={140} height={44} className="h-11 w-auto object-contain" />
        </div>

        {/* Tab Headers: Sign In & Sign Up with Pink Underline */}
        <div className="flex border-b border-[#EAE3F7] mb-5 relative">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setSignupStep("details");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 pb-3 text-center text-[14.5px] font-extrabold transition-colors relative cursor-pointer ${
              authMode === "login" ? "text-[#171136]" : "text-[#736E9B] hover:text-[#171136]"
            }`}
          >
            Sign in
            {authMode === "login" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF4D6D] rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("signup");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 pb-3 text-center text-[14.5px] font-extrabold transition-colors relative cursor-pointer ${
              authMode === "signup" ? "text-[#171136]" : "text-[#736E9B] hover:text-[#171136]"
            }`}
          >
            Sign up
            {authMode === "signup" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF4D6D] rounded-full" />
            )}
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
              ✓
            </span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[10px]">
              !
            </span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {authMode === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
            {/* Email Input */}
            <div className="flex items-center gap-3 px-3.5 h-12 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7] focus-within:border-[#FF4D6D] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF4D6D]/15 transition-all">
              <IconMail className="w-4 h-4 text-[#736E9B] shrink-0" />
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="customer@gmail.com"
                className="w-full bg-transparent outline-none text-sm font-medium text-[#171136] placeholder:text-[#736E9B]/80"
              />
            </div>

            {/* Password Input */}
            <div className="flex items-center gap-3 px-3.5 h-12 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7] focus-within:border-[#FF4D6D] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF4D6D]/15 transition-all">
              <IconLock className="w-4 h-4 text-[#736E9B] shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-sm font-medium text-[#171136] placeholder:text-[#736E9B]/80"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#736E9B] hover:text-[#171136] p-1 shrink-0 cursor-pointer"
              >
                {showPassword ? (
                  <IconEyeOff className="w-4 h-4" />
                ) : (
                  <IconEye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between mt-0.5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#3B3468] font-semibold">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#FF4D6D] rounded cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setErrorMsg("Please contact support to reset your password.")}
                className="text-[#FF4D6D] font-bold hover:underline hover:text-[#ff2a54] cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1.5 w-full h-12 bg-[#FF4D6D] hover:bg-[#ff3358] active:scale-[0.99] disabled:opacity-75 transition-all text-white font-bold text-[15px] rounded-2xl shadow-md shadow-[#FF4D6D]/20 flex items-center justify-center cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : signupStep === "details" ? (
          /* SIGN UP STEP 1: Details */
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-3">
            {/* First Name & Last Name 2 Columns */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2 px-3 h-12 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7] focus-within:border-[#FF4D6D] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF4D6D]/15 transition-all">
                <IconUser className="w-4 h-4 text-[#736E9B] shrink-0" />
                <input
                  type="text"
                  required
                  value={signupFirstName}
                  onChange={(e) => setSignupFirstName(e.target.value)}
                  placeholder="First Name *"
                  className="w-full bg-transparent outline-none text-sm font-medium text-[#171136] placeholder:text-[#736E9B]/80"
                />
              </div>

              <div className="flex items-center gap-2 px-3 h-12 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7] focus-within:border-[#FF4D6D] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF4D6D]/15 transition-all">
                <IconUser className="w-4 h-4 text-[#736E9B] shrink-0" />
                <input
                  type="text"
                  required
                  value={signupLastName}
                  onChange={(e) => setSignupLastName(e.target.value)}
                  placeholder="Last Name *"
                  className="w-full bg-transparent outline-none text-sm font-medium text-[#171136] placeholder:text-[#736E9B]/80"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="flex items-center gap-3 px-3.5 h-12 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7] focus-within:border-[#FF4D6D] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF4D6D]/15 transition-all">
              <IconMail className="w-4 h-4 text-[#736E9B] shrink-0" />
              <input
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none text-sm font-medium text-[#171136] placeholder:text-[#736E9B]/80"
              />
            </div>

            {/* Password Input */}
            <div className="flex items-center gap-3 px-3.5 h-12 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7] focus-within:border-[#FF4D6D] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF4D6D]/15 transition-all">
              <IconLock className="w-4 h-4 text-[#736E9B] shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-transparent outline-none text-sm font-medium text-[#171136] placeholder:text-[#736E9B]/80"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#736E9B] hover:text-[#171136] p-1 shrink-0 cursor-pointer"
              >
                {showPassword ? (
                  <IconEyeOff className="w-4 h-4" />
                ) : (
                  <IconEye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Primary Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1.5 w-full h-12 bg-[#FF4D6D] hover:bg-[#ff3358] active:scale-[0.99] disabled:opacity-75 transition-all text-white font-bold text-[15px] rounded-2xl shadow-md shadow-[#FF4D6D]/20 flex items-center justify-center cursor-pointer"
            >
              {loading ? "Sending verification code..." : "Get Verification Code →"}
            </button>
          </form>
        ) : (
          /* SIGN UP STEP 2: 6-Digit Email OTP Verification */
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFF0F3] text-[#FF4D6D] mb-2">
                <IconMail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#171136]">
                Enter Verification Code
              </h3>
              <p className="text-xs text-[#736E9B] mt-1 leading-relaxed">
                We sent a 6-digit code to <strong className="text-[#171136]">{signupEmail}</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setSignupStep("details");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="mt-1 text-xs text-[#FF4D6D] font-bold hover:underline inline-block cursor-pointer"
              >
                Edit email
              </button>
            </div>

            {/* 6 Digit Inputs */}
            <div className="flex justify-between gap-1.5 sm:gap-2">
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  id={`modal-otp-box-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-11 h-12 sm:w-12 sm:h-13 text-center text-xl font-bold bg-[#F8F6FD] border border-[#EAE3F7] rounded-xl focus:border-[#FF4D6D] focus:bg-white focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all text-[#171136]"
                />
              ))}
            </div>

            {/* Resend Timer / Action */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[#736E9B]">Didn&apos;t receive code?</span>
              {resendTimer > 0 ? (
                <span className="text-[#736E9B] font-semibold">
                  Resend in <span className="text-[#FF4D6D] font-bold">{resendTimer}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-[#FF4D6D] font-bold hover:underline cursor-pointer disabled:opacity-50"
                >
                  Resend Code
                </button>
              )}
            </div>

            {/* Verify & Create Account Button */}
            <button
              type="submit"
              disabled={loading || otpCode.join("").length !== 6}
              className="w-full h-12 bg-[#FF4D6D] hover:bg-[#ff3358] active:scale-[0.99] disabled:opacity-60 transition-all text-white font-bold text-[15px] rounded-2xl shadow-md shadow-[#FF4D6D]/20 flex items-center justify-center cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify & Complete Signup"}
            </button>

            <button
              type="button"
              onClick={() => {
                setSignupStep("details");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-xs text-[#736E9B] hover:text-[#171136] text-center font-semibold cursor-pointer"
            >
              ← Back to details
            </button>
          </form>
        )}

        {/* Divider: Or continue with */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-[#EAE3F7] w-full" />
          <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#736E9B] absolute">
            Or continue with
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full h-12 bg-[#F8F6FD] hover:bg-[#F0ECF8] border border-[#EAE3F7] active:scale-[0.99] rounded-2xl flex items-center justify-center gap-2.5 text-sm font-bold text-[#171136] transition-all cursor-pointer shadow-2xs"
        >
          <IconGoogle className="w-5 h-5 shrink-0" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}

