"use client";

import Link from "next/link";
import Image from "next/image";
import { IconHeart, IconBag, IconUser } from "./icons";
import MobileMenu from "./MobileMenu";
import SearchBox from "./SearchBox";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const { totalItems, subtotalFormatted, openCart } = useCart();

  return (
    <div className="bg-white border-b border-[#EAE3F7] relative z-40">
      <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-col lg:flex-row items-center gap-2.5 sm:gap-4">
        
        {/* Top bar on Mobile (Row 1) / Left + Right wrapper on Desktop */}
        <div className="flex items-center justify-between w-full lg:w-auto shrink-0 gap-2">
          {/* Brand Logo & Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <MobileMenu />
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo.png"
                alt="Brickverse"
                width={130}
                height={42}
                className="h-8 sm:h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Mobile Right Action Icons (Row 1 Right on Mobile, Hidden on Desktop) */}
          <div className="flex lg:hidden items-center gap-1.5 shrink-0">
            <button
              aria-label="Wishlist"
              className="w-9 h-9 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center relative cursor-pointer"
            >
              <IconHeart className="w-3.5 h-3.5 text-[#171136]" />
              <span className="absolute -top-1 -right-1 bg-[#FFB800] text-[#171136] text-[9.5px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                3
              </span>
            </button>

            <button
              onClick={openCart}
              aria-label="Cart"
              className="w-9 h-9 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center relative cursor-pointer"
            >
              <IconBag className="w-3.5 h-3.5 text-[#171136]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF0055] text-white text-[9.5px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {isAuthenticated && user ? (
              <Link
                href={user.role === "admin" ? "/en/admin" : "/dashboard"}
                title={`Go to ${user.role === "admin" ? "Admin Dashboard" : "Dashboard"}`}
                className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] border border-[#EAE3F7] flex items-center justify-center cursor-pointer transition-transform active:scale-95"
              >
                <span
                  className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: user.role === "admin" ? "#7B5CFF" : "#FF4D6D" }}
                >
                  {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
                </span>
              </Link>
            ) : (
              <button
                onClick={openLoginModal}
                aria-label="Sign in"
                className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#171136] hover:bg-[#251c4a] active:scale-95 text-white flex items-center justify-center shadow-xs cursor-pointer"
              >
                <IconUser className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar (Row 2 on Mobile, Center column on Desktop) */}
        <SearchBox />

        {/* Desktop Right Action Icons (Hidden on Mobile, Displayed on Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5 sm:gap-3 shrink-0 ml-auto">
          <button
            aria-label="Wishlist"
            className="w-11 h-11 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center relative cursor-pointer transition-colors"
          >
            <IconHeart className="w-4 h-4 text-[#171136]" />
            <span className="absolute -top-1 -right-1 bg-[#FFB800] text-[#171136] text-[10.5px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          <button
            onClick={openCart}
            aria-label="Open Cart"
            className="flex items-center gap-2 bg-[#F6F1FF] hover:bg-[#EFE9FF] rounded-full h-11 px-3.5 cursor-pointer transition-colors"
          >
            <span className="relative flex items-center">
              <IconBag className="w-4 h-4 text-[#171136]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#FF0055] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </span>
            <span className="hidden md:inline text-[12.5px] font-bold text-[#171136] font-mono">
              {subtotalFormatted}
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
  