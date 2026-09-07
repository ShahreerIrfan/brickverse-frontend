"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  IconMenu,
  IconClose,
  IconChevronRight,
  IconUser,
  IconShield,
  IconPhone,
  IconTruck,
  IconArrowRight,
} from "./icons";
import { CategoryGlyph } from "./CategoryRail";
import { categories } from "./productData";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", active: true },
  { label: "Shop all" },
  { label: "Anime figures" },
  { label: "Cartoon toys" },
  { label: "Bricks & sets" },
  { label: "Coding kits" },
  { label: "Deals", hot: true },
  { label: "Blog" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#171136] shrink-0 -ml-1"
      >
        <IconMenu className="w-6 h-6" />
      </button>

      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-[#171136]/50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-y-0 left-0 z-50 w-[86%] max-w-[340px] bg-[#FFF6EE] shadow-2xl transition-transform duration-300 ease-out flex flex-col lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 bg-white px-5 py-4 border-b border-[#EAE3F7] shrink-0">
          <a href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <Image src="/images/logo-mark.svg" alt="Brickverse" width={34} height={34} />
            <span className="font-[family-name:var(--font-display)] font-extrabold text-lg tracking-tight text-[#171136]">
              Brickverse
            </span>
          </a>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-full bg-[#F6F1FF] flex items-center justify-center text-[#171136] shrink-0"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* User Auth Card */}
          {isAuthenticated && user ? (
            <div className="mx-4 mt-4 rounded-2xl bg-white border border-[#EAE3F7] p-3.5 shadow-sm">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: user.role === "admin" ? "#7B5CFF" : "#FF4D6D" }}
                >
                  {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#171136] truncate">
                    {user.first_name ? `${user.first_name} ${user.last_name || ""}` : user.email}
                  </p>
                  <p className="text-[11px] text-[#736E9B] truncate">{user.email}</p>
                </div>
                <span
                  className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: user.role === "admin" ? "#EFE9FF" : "#FFF1F4",
                    color: user.role === "admin" ? "#7B5CFF" : "#FF4D6D",
                  }}
                >
                  {user.role}
                </span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#EAE3F7] flex flex-col gap-2 text-xs">
                <a
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between font-bold text-[#171136] hover:text-[#FF4D6D]"
                >
                  <span>📊 {user.role === "admin" ? "Admin Dashboard" : "Customer Dashboard"}</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-[#736E9B]" />
                </a>

                <div className="flex items-center justify-between pt-1">
                  {user.role === "admin" ? (
                    <a
                      href="http://127.0.0.1:8000/admin/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#7B5CFF] hover:underline flex items-center gap-1"
                    >
                      <IconShield className="w-3.5 h-3.5" /> Django Admin
                    </a>
                  ) : (
                    <span className="text-[11.5px] text-[#736E9B]">VIP Member</span>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="text-red-500 font-bold hover:underline"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                openLoginModal();
              }}
              className="flex items-center gap-3 mx-4 mt-4 w-[calc(100%-32px)] text-left rounded-2xl bg-white border border-[#EAE3F7] px-4 py-3 shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <span className="w-10 h-10 rounded-full bg-[#FFF1F4] flex items-center justify-center shrink-0">
                <IconUser className="w-4 h-4 text-[#FF4D6D]" />
              </span>
              <span className="flex-1">
                <span className="block text-[13.5px] font-bold text-[#171136]">Sign in / Sign up</span>
                <span className="block text-[11.5px] text-[#736E9B]">Join Brickverse rewards</span>
              </span>
              <IconChevronRight className="w-4 h-4 text-[#736E9B]" />
            </button>
          )}

          <p className="px-5 mt-6 mb-2 text-[11px] font-bold tracking-wider text-[#736E9B]">
            CATEGORIES
          </p>
          <ul className="px-2.5">
            {categories.map((cat) => (
              <li key={cat.id}>
                <a
                  href="#"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 relative ${
                    cat.featured ? "bg-[#FFF1F4]" : ""
                  }`}
                >
                  {cat.featured && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-[#FF4D6D]" />
                  )}
                  <span
                    className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cat.color}24` }}
                  >
                    <CategoryGlyph id={cat.id} color={cat.color} />
                  </span>
                  <span
                    className={`text-[13.5px] flex-1 ${
                      cat.featured ? "font-bold text-[#171136]" : "font-medium text-[#3B3468]"
                    }`}
                  >
                    {cat.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="flex items-center gap-2 mx-5 mt-2 mb-6 text-[13px] font-bold text-[#FF4D6D]"
          >
            See all 48 categories
            <IconArrowRight className="w-4 h-4" />
          </a>

          <div className="border-t border-[#EAE3F7] mx-5" />

          <nav className="flex flex-col px-5 py-5 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 text-[14px] ${
                  link.active ? "font-bold text-[#FF4D6D]" : "font-medium text-[#3B3468]"
                }`}
              >
                {link.label}
                {link.hot && (
                  <span className="bg-[#FF4D6D] text-white text-[9px] font-extrabold rounded-full px-1.5 py-0.5">
                    HOT
                  </span>
                )}
              </a>
            ))}
          </nav>
        </div>

        <div className="shrink-0 border-t border-[#EAE3F7] bg-white px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <IconPhone className="w-4 h-4 text-[#FF4D6D]" />
            <span className="text-[13px] font-semibold text-[#3B3468]">1800 246 010</span>
          </div>
          <div className="flex items-center gap-2 text-[#736E9B]">
            <IconTruck className="w-4 h-4" />
            <span className="text-[13px] font-medium">Track order</span>
          </div>
        </div>
      </div>
    </>
  );
}
