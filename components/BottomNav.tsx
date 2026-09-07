"use client";

import { IconHome, IconBag, IconStore, IconUser } from "./icons";
import { useAuth } from "@/context/AuthContext";

export default function BottomNav() {
  const { user, isAuthenticated, openLoginModal } = useAuth();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#EAE3F7] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        <a
          href="/"
          className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[#FF4D6D]"
        >
          <IconHome className="w-[22px] h-[22px]" />
          <span className="text-[10.5px] font-bold">Home</span>
        </a>

        <a
          href="#"
          className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[#736E9B]"
        >
          <span className="relative">
            <IconBag className="w-[22px] h-[22px]" />
            <span className="absolute -top-1.5 -right-2 w-[15px] h-[15px] rounded-full bg-[#FF4D6D] text-white text-[8.5px] font-extrabold flex items-center justify-center">
              2
            </span>
          </span>
          <span className="text-[10.5px] font-medium">Cart</span>
        </a>

        <a
          href="/shop"
          className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[#736E9B] hover:text-[#FF4D6D]"
        >
          <IconStore className="w-[22px] h-[22px]" />
          <span className="text-[10.5px] font-medium">Shop</span>
        </a>

        {isAuthenticated ? (
          <a
            href="/dashboard"
            className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[#736E9B]"
          >
            <span className="relative">
              <IconUser
                className={`w-[22px] h-[22px] ${
                  user?.role === "admin" ? "text-[#7B5CFF]" : "text-[#FF4D6D]"
                }`}
              />
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: user?.role === "admin" ? "#7B5CFF" : "#FF4D6D" }}
              />
            </span>
            <span className="text-[10.5px] font-medium truncate max-w-[70px]">
              {[user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.first_name || user?.email?.split("@")[0]}
            </span>
          </a>
        ) : (
          <button
            onClick={openLoginModal}
            className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[#736E9B] cursor-pointer"
          >
            <span className="relative">
              <IconUser className="w-[22px] h-[22px]" />
            </span>
            <span className="text-[10.5px] font-medium">Account</span>
          </button>
        )}
      </div>
    </nav>
  );
}
