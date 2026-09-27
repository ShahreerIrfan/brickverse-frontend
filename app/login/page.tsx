"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  IconClose,
  IconMail,
  IconLock,
  IconUser,
  IconEye,
  IconEyeOff,
  IconGoogle,
  IconStore,
} from "@/components/icons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "/dashboard";

  const { user, isAuthenticated, isLoading, login, sendOtp, verifyAndSignup, resendOtp } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [signupStep, setSignupStep] = useState<"details" | "otp">("details");

  // Form state - Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Form state - Signup
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // OTP Countdown timer
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

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(redirectParam);
    }
  }, [isLoading, isAuthenticated, user, router, redirectParam]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await login(loginEmail, loginPassword);
    setSubmitting(false);

    if (res.success) {
      router.push(redirectParam);
    } else {
      setErrorMsg(res.message || "Invalid credentials. Please try again.");
    }
  };

  // Step 1: Send OTP to email
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

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await sendOtp(signupEmail);
    setSubmitting(false);

    if (res.success) {
      setSignupStep("otp");
      setSuccessMsg(res.message || `Verification code sent to ${signupEmail}`);
      setResendTimer(60);
    } else {
      setErrorMsg(res.error || res.message || "Failed to send verification code. Please check your email.");
    }
  };

  // Step 2: Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Handle paste of full 6 digits
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6);
      if (pasted.length > 0) {
        const newOtp = [...otpCode];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = pasted[i] || "";
        }
        setOtpCode(newOtp);
        const nextIndex = Math.min(pasted.length, 5);
        document.getElementById(`login-otp-box-${nextIndex}`)?.focus();
        return;
      }
    }

    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = digit;
    setOtpCode(newOtp);

    // Auto focus next input
    if (digit && index < 5) {
      document.getElementById(`login-otp-box-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      document.getElementById(`login-otp-box-${index - 1}`)?.focus();
    }
  };

  // Step 2: Verify OTP and complete registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join("").trim();
    if (fullCode.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await verifyAndSignup({
      email: signupEmail,
      otp: fullCode,
      password: signupPassword,
      first_name: signupFirstName,
      last_name: signupLastName,
    });
    setSubmitting(false);

    if (res.success) {
      router.push(redirectParam);
    } else {
      setErrorMsg(res.error || res.message || "Invalid verification code. Please try again.");
    }
  };

  // Resend OTP
  const handleResendCode = async () => {
    if (resendTimer > 0 || submitting) return;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await resendOtp(signupEmail);
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg(res.message || "A new verification code has been sent!");
      setResendTimer(60);
      setOtpCode(["", "", "", "", "", ""]);
      document.getElementById("login-otp-box-0")?.focus();
    } else {
      setErrorMsg(res.error || res.message || "Failed to resend code.");
    }
  };

  const handleGoogleAuth = () => {
    setErrorMsg("Google OAuth sign in will be available shortly.");
  };

  return (
    <div className="min-h-screen bg-[#FFF6EE] flex flex-col justify-between p-4">
      {/* Top Header */}
      <header className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Kawaii Subete" width={120} height={38} className="h-8 sm:h-9 w-auto object-contain" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171136] bg-white border border-[#EAE3F7] hover:bg-[#F6F1FF] px-3.5 py-1.5 rounded-full transition-colors shadow-xs"
        >
          <IconStore className="w-3.5 h-3.5 text-[#FF4D6D]" />
          Back to store
        </Link>
      </header>

      {/* Main Form Center Box - Styled in Kawaii Subete palette */}
      <main className="flex-1 flex items-center justify-center py-6">
        <div className="relative w-full max-w-[420px] bg-white rounded-[28px] shadow-2xl p-6 sm:p-7 border border-[#EAE3F7]">
          {/* Brand Logo Header */}
          <div className="flex flex-col items-center justify-center mb-5">
            <Image src="/logo.png" alt="Kawaii Subete" width={130} height={42} className="h-10 sm:h-11 w-auto object-contain" />
          </div>

          {/* Tab Headers: Sign In & Sign Up */}
          <div className="flex border-b border-[#EAE3F7] mb-5 relative">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setSignupStep("details");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 pb-3 text-center text-[14.5px] font-extrabold transition-colors relative cursor-pointer ${
                mode === "login" ? "text-[#171136]" : "text-[#736E9B] hover:text-[#171136]"
              }`}
            >
              Sign in
              {mode === "login" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF4D6D] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 pb-3 text-center text-[14.5px] font-extrabold transition-colors relative cursor-pointer ${
                mode === "signup" ? "text-[#171136]" : "text-[#736E9B] hover:text-[#171136]"
              }`}
            >
              Sign up
              {mode === "signup" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF4D6D] rounded-full" />
              )}
            </button>
          </div>

          {/* Success / Info Message */}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
              <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                ✓
              </span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
              <span className="shrink-0 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[10px]">
                !
              </span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-1.5 w-full h-12 bg-[#FF4D6D] hover:bg-[#ff3358] active:scale-[0.99] disabled:opacity-75 transition-all text-white font-bold text-[15px] rounded-2xl shadow-md shadow-[#FF4D6D]/20 flex items-center justify-center cursor-pointer"
              >
                {submitting ? "Signing in..." : "Sign in"}
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

              {/* Continue to OTP verification Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-1.5 w-full h-12 bg-[#FF4D6D] hover:bg-[#ff3358] active:scale-[0.99] disabled:opacity-75 transition-all text-white font-bold text-[15px] rounded-2xl shadow-md shadow-[#FF4D6D]/20 flex items-center justify-center cursor-pointer"
              >
                {submitting ? "Sending verification code..." : "Get Verification Code →"}
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
                    id={`login-otp-box-${index}`}
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
                    disabled={submitting}
                    className="text-[#FF4D6D] font-bold hover:underline cursor-pointer disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {/* Verify & Create Account Button */}
              <button
                type="submit"
                disabled={submitting || otpCode.join("").length !== 6}
                className="w-full h-12 bg-[#FF4D6D] hover:bg-[#ff3358] active:scale-[0.99] disabled:opacity-60 transition-all text-white font-bold text-[15px] rounded-2xl shadow-md shadow-[#FF4D6D]/20 flex items-center justify-center cursor-pointer"
              >
                {submitting ? "Verifying..." : "Verify & Complete Signup"}
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
      </main>

      {/* Footer copyright */}
      <footer className="py-2 text-center text-xs text-[#736E9B]">
        &copy; {new Date().getFullYear()} Kawaii Subete. All rights reserved.
      </footer>
    </div>
  );
}


export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF6EE] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
