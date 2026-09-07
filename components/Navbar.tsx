"use client";

import Link from "next/link";
import Image from "next/image";
import { IconChevronRight, IconSearch, IconHeart, IconBag, IconUser } from "./icons";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, openLoginModal } = useAuth();

  return (
    <div className="bg-white border-b border-[#EAE3F7] relative z-40">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center gap-2 sm:gap-4 flex-wrap lg:flex-nowrap">
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

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          <button
            aria-label="Wishlist"
            className="w-11 h-11 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center relative cursor-pointer"
          >
            <IconHeart className="w-4 h-4 text-[#171136]" />
            <span className="absolute -top-1 -right-1 bg-[#FFB800] text-[#171136] text-[10.5px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          <button className="flex items-center gap-2 bg-[#F6F1FF] hover:bg-[#EFE9FF] rounded-full h-11 px-3.5 cursor-pointer">
            <span className="relative flex items-center">
              <IconBag className="w-4 h-4 text-[#171136]" />
              <span className="absolute -top-1.5 -right-2 bg-[#FF4D6D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </span>
            <span className="hidden md:inline text-[12.5px] font-semibold text-[#736E9B]">
              ৳1,420
            </span>
          </button>

          {/* User Sign In / Direct Dashboard Redirect */}
          {isAuthenticated && user ? (
            <Link
              href={user.role === "admin" ? "/en/admin" : "/dashboard"}
              title={`Go to ${user.role === "admin" ? "Admin Dashboard" : "Dashboard"}`}
              className="flex items-center gap-2 bg-[#F6F1FF] hover:bg-[#EFE9FF] hover:border-[#FF4D6D]/40 border border-[#EAE3F7] rounded-full h-11 px-3.5 sm:px-4 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                style={{ backgroundColor: user.role === "admin" ? "#7B5CFF" : "#FF4D6D" }}
              >
                {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
              </span>
              <span className="hidden sm:flex flex-col items-start leading-none text-left">
                <span className="text-xs font-bold text-[#171136]">
                  {[user.first_name, user.last_name].filter(Boolean).join(" ") || user.first_name || user.email.split("@")[0]}
                </span>
                <span
                  className="text-[9.5px] font-bold uppercase mt-0.5 tracking-wider"
                  style={{ color: user.role === "admin" ? "#7B5CFF" : "#FF4D6D" }}
                >
                  {user.role}
                </span>
              </span>
            </Link>
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
