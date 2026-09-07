"use client";

import { useState } from "react";
import Image from "next/image";
import { IconChevronRight, IconSearch, IconHeart, IconBag, IconUser, IconShield } from "./icons";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-white border-b border-[#EAE3F7] relative z-40">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-[100px] py-3 sm:py-4 flex items-center gap-2 sm:gap-4 flex-wrap lg:flex-nowrap">
        <MobileMenu />
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <Image src="/images/logo-mark.svg" alt="Brickverse" width={40} height={40} />
          <span className="flex flex-col leading-tight">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-xl tracking-tight text-[#171136]">
              Brickverse
            </span>
            <span className="font-[family-name:var(--font-body)] text-[10.5px] font-medium text-[#736E9B]">
              figures · bricks · code kits
            </span>
          </span>
        </a>

        <div className="order-3 lg:order-none w-full lg:w-auto lg:flex-1 lg:mx-6 flex items-center bg-[#F6F1FF] border border-[#EAE3F7] rounded-full h-13 px-5 gap-2 min-w-0">
          <span className="hidden sm:flex items-center gap-1.5 text-[13px] font-semibold text-[#171136] shrink-0">
            All categories
            <IconChevronRight className="w-3.5 h-3.5 text-[#736E9B]" />
          </span>
          <span className="hidden sm:block w-px h-6 bg-[#EAE3F7] shrink-0" />
          <IconSearch className="w-4 h-4 text-[#736E9B] shrink-0" />
          <input
            placeholder="Search figures, brick sets, coding kits…"
            className="bg-transparent outline-none text-[13.5px] text-[#3B3468] placeholder:text-[#736E9B] flex-1 min-w-0"
          />
          <button
            aria-label="Search"
            className="w-11 h-11 rounded-full bg-[#FF4D6D] flex items-center justify-center shrink-0"
          >
            <IconSearch className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-4 sm:gap-5 shrink-0 ml-auto lg:ml-0">
          <button aria-label="Wishlist" className="relative flex items-center justify-center p-1">
            <IconHeart className="w-5 h-5 text-[#171136]" />
            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#FFC93C] text-[9.5px] font-extrabold text-[#171136] flex items-center justify-center">
              3
            </span>
          </button>
          <button aria-label="Bag" className="relative flex items-center gap-2 p-1">
            <span className="relative flex items-center justify-center">
              <IconBag className="w-5 h-5 text-[#171136]" />
              <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#FF4D6D] text-[9.5px] font-extrabold text-white flex items-center justify-center">
                2
              </span>
            </span>
            <span className="hidden md:inline text-[12.5px] font-semibold text-[#736E9B]">
              ৳1,420
            </span>
          </button>

          {/* User Sign In / Profile Section */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-[#F6F1FF] hover:bg-[#EFE9FF] border border-[#EAE3F7] rounded-full h-11 px-3.5 transition-all"
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: user.role === "admin" ? "#7B5CFF" : "#FF4D6D" }}
                >
                  {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
                </span>
                <span className="hidden sm:flex flex-col items-start leading-none text-left">
                  <span className="text-xs font-bold text-[#171136]">
                    {user.first_name || user.email.split("@")[0]}
                  </span>
                  <span
                    className="text-[9.5px] font-bold uppercase mt-0.5 tracking-wider"
                    style={{ color: user.role === "admin" ? "#7B5CFF" : "#FF4D6D" }}
                  >
                    {user.role}
                  </span>
                </span>
                <IconChevronRight
                  className={`w-3.5 h-3.5 text-[#736E9B] transition-transform duration-200 ${
                    dropdownOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Dropdown Card */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-13 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-[#EAE3F7] p-3 z-40 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-[#EAE3F7] mb-2">
                      <p className="text-xs font-bold text-[#171136] truncate">
                        {user.first_name ? `${user.first_name} ${user.last_name || ""}` : user.email}
                      </p>
                      <p className="text-[11px] text-[#736E9B] truncate">{user.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F6F1FF] text-[#171136]">
                        {user.role === "admin" ? (
                          <>
                            <IconShield className="w-3 h-3 text-[#7B5CFF]" /> Admin Access
                          </>
                        ) : (
                          <>
                            <IconUser className="w-3 h-3 text-[#FF4D6D]" /> Customer Account
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <a
                        href={user.role === "admin" ? "/en/admin" : "/dashboard"}
                        onClick={() => setDropdownOpen(false)}
                        className="px-3 py-2 rounded-xl text-[#171136] font-bold hover:bg-[#F6F1FF] flex items-center justify-between"
                      >
                        <span>📊 {user.role === "admin" ? "Admin Dashboard" : "Customer Dashboard"}</span>
                        <IconChevronRight className="w-3.5 h-3.5 text-[#736E9B]" />
                      </a>

                      {user.role === "admin" && (
                        <a
                          href="http://127.0.0.1:8000/admin/"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl text-[#7B5CFF] font-bold hover:bg-[#F6F1FF] flex items-center justify-between"
                        >
                          <span>Django Admin Panel ↗</span>
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 bg-[#171136] hover:bg-[#251c4a] active:scale-95 transition-all text-white rounded-full h-11 px-5 shadow-sm cursor-pointer"
            >
              <IconUser className="w-4 h-4" />
              <span className="text-sm font-semibold">Sign in</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
