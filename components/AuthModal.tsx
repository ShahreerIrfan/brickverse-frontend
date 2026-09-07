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
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, signup } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
  }, [authMode]);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    const res = await login(loginEmail, loginPassword);
    setLoading(false);

    if (res.success) {
      closeAuthModal();
      router.push("/dashboard");
    } else {
      setErrorMsg(res.message || "Invalid credentials. Please try again.");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
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

    const res = await signup({
      email: signupEmail,
      password: signupPassword,
      first_name: signupFirstName,
      last_name: signupLastName,
    });
    setLoading(false);

    if (res.success) {
      closeAuthModal();
      router.push("/dashboard");
    } else {
      setErrorMsg(res.message || "Registration failed. Please try again.");
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

      {/* Modal Popup Card - Brickverse Design System */}
      <div className="relative w-full max-w-[400px] bg-white rounded-[28px] shadow-2xl border border-[#EAE3F7] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200">
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
          <div className="flex items-center gap-2.5">
            <Image src="/images/logo-mark.svg" alt="Brickverse" width={38} height={38} />
            <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl tracking-tight text-[#171136]">
              Brickverse
            </span>
          </div>
          <span className="font-[family-name:var(--font-body)] text-[11px] font-medium text-[#736E9B] mt-0.5">
            figures · bricks · code kits
          </span>
        </div>

        {/* Tab Headers: Sign In & Sign Up with Brickverse Pink Underline */}
        <div className="flex border-b border-[#EAE3F7] mb-5 relative">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setErrorMsg("");
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

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[10px]">
              !
            </span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM (Image 1 Style with Brickverse Palette) */}
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
        ) : (
          /* SIGN UP FORM (Image 2 Style with Brickverse Palette) */
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
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
                placeholder="At least 8 characters"
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
              {loading ? "Creating account..." : "Sign up"}
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
