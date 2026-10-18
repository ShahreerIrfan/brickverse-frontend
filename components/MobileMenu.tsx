"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconMenu,
  IconClose,
  IconChevronRight,
  IconUser,
  IconShield,
  IconPhone,
  IconArrowRight,
} from "./icons";
import { CategoryGlyph } from "./CategoryRail";
import type { Category } from "./productData";
import { useAuth } from "@/context/AuthContext";
import { getApiBaseUrl, getCategories } from "@/lib/api";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Shop all", href: "/shop" },
  { label: "Deals", href: "/shop?deals=true", hot: true },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Module-level in-memory cache to ensure instant drawer opening across route transitions
let cachedCategories: Category[] | null = null;

interface MobileMenuProps {
  initialCategories?: Category[];
}

export default function MobileMenu({ initialCategories }: MobileMenuProps = {}) {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();

  const [categories, setCategories] = useState<Category[]>(() => {
    if (initialCategories && initialCategories.length > 0) return initialCategories;
    if (cachedCategories && cachedCategories.length > 0) return cachedCategories;
    return [];
  });
  const [loading, setLoading] = useState<boolean>(
    !initialCategories?.length && !cachedCategories?.length
  );
  const [expandedCatIds, setExpandedCatIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
      cachedCategories = initialCategories;
      setLoading(false);
      return;
    }

    if (cachedCategories && cachedCategories.length > 0) {
      setCategories(cachedCategories);
      setLoading(false);
      return;
    }

    let isMounted = true;
    getCategories()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          cachedCategories = data;
        }
      })
      .catch((err) => {
        console.warn("[MobileMenu] Failed to load categories:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialCategories]);

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

  const activeCategories = categories.filter((c) => c.is_active !== false);

  const totalCategoriesCount = activeCategories.reduce(
    (sum, c) => sum + 1 + (c.subcategories?.length || 0),
    0
  );

  return (
    <>
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#171136] shrink-0 -ml-1 cursor-pointer active:scale-95 transition-transform"
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
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 bg-white px-5 py-4 border-b border-[#EAE3F7] shrink-0">
          <Link href="/" prefetch={true} className="flex items-center" onClick={() => setOpen(false)}>
            <Image src="/logo.png" alt="Kawaii Subete" width={120} height={38} className="h-8 w-auto object-contain" />
          </Link>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center text-[#171136] shrink-0 cursor-pointer active:scale-95 transition-all"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
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
                <Link
                  href="/dashboard"
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between font-bold text-[#171136] hover:text-[#FF4D6D]"
                >
                  <span>📊 {user.role === "admin" ? "Admin Dashboard" : "Customer Dashboard"}</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-[#736E9B]" />
                </Link>

                <div className="flex items-center justify-between pt-1">
                  {user.role === "admin" ? (
                    <a
                      href={getApiBaseUrl().replace(/\/api\/?$/, "") + "/admin/"}
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
                    className="text-red-500 font-bold hover:underline cursor-pointer"
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
                <span className="block text-[11.5px] text-[#736E9B]">Join Kawaii Subete rewards</span>
              </span>
              <IconChevronRight className="w-4 h-4 text-[#736E9B]" />
            </button>
          )}

          {/* Categories Section */}
          <div className="mt-5">
            <div className="flex items-center justify-between px-5 mb-2">
              <p className="text-[11px] font-bold tracking-wider text-[#736E9B] uppercase">
                Categories
              </p>
              {totalCategoriesCount > 0 && (
                <span className="text-[10px] font-bold text-[#FF4D6D] bg-[#FFF0F3] px-2 py-0.5 rounded-full">
                  {totalCategoriesCount} items
                </span>
              )}
            </div>

            {loading && activeCategories.length === 0 ? (
              <div className="px-4 py-2 flex flex-col gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/50 animate-pulse">
                    <div className="w-8 h-8 rounded-[10px] bg-[#EAE3F7]/80 shrink-0" />
                    <div className="h-4 bg-[#EAE3F7]/80 rounded-md w-3/5" />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="px-3 flex flex-col gap-0.5">
                {activeCategories.map((cat) => {
                  const hasSubcategories = Boolean(cat.subcategories && cat.subcategories.length > 0);
                  const isExpanded = Boolean(expandedCatIds[cat.id]);
                  const catHref = `/shop?category=${encodeURIComponent(cat.slug || cat.id)}`;

                  return (
                    <li key={cat.id} className="flex flex-col">
                      <div className="flex items-center justify-between rounded-xl hover:bg-white/80 active:bg-white transition-all group">
                        <Link
                          href={catHref}
                          prefetch={true}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 flex-1 min-w-0"
                        >
                          <span
                            className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                            style={{
                              backgroundColor: `${cat.color || "#FF4D6D"}1A`,
                            }}
                          >
                            <CategoryGlyph
                              id={cat.id}
                              color={cat.color || "#FF4D6D"}
                              icon={cat.category_icon || cat.categoryIcon || cat.icon_type}
                            />
                          </span>
                          <span className="text-[13.5px] font-medium text-[#2E2856] group-hover:text-[#FF4D6D] transition-colors truncate">
                            {cat.label}
                          </span>
                        </Link>

                        {hasSubcategories && (
                          <button
                            type="button"
                            aria-label={`Toggle ${cat.label} subcategories`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setExpandedCatIds((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }));
                            }}
                            className="w-9 h-9 mr-1 rounded-lg flex items-center justify-center text-[#736E9B] hover:text-[#FF4D6D] hover:bg-white/90 active:scale-95 transition-all shrink-0 cursor-pointer"
                          >
                            <span className="text-[10px] font-bold text-[#736E9B] bg-white/80 px-1.5 py-0.5 rounded-full mr-1.5 border border-[#EAE3F7]">
                              {cat.subcategories!.length}
                            </span>
                            <IconChevronRight
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isExpanded ? "rotate-90 text-[#FF4D6D]" : "text-[#736E9B]"
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Expandable Subcategories Accordion */}
                      {hasSubcategories && isExpanded && (
                        <ul className="pl-11 pr-2 py-1.5 flex flex-col gap-1 my-1 bg-white/70 rounded-xl border border-[#EAE3F7]/70">
                          <li>
                            <Link
                              href={catHref}
                              prefetch={true}
                              onClick={() => setOpen(false)}
                              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] font-bold text-[#FF4D6D] hover:bg-white transition-colors"
                            >
                              <span>All {cat.label}</span>
                              <IconArrowRight className="w-3 h-3" />
                            </Link>
                          </li>
                          {cat.subcategories!.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/shop?category=${encodeURIComponent(cat.slug || cat.id)}&subcategory=${encodeURIComponent(sub.slug || sub.id)}`}
                                prefetch={true}
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium text-[#4A4270] hover:text-[#FF4D6D] hover:bg-white transition-colors"
                              >
                                <span className="truncate">{sub.label}</span>
                                <IconChevronRight className="w-2.5 h-2.5 text-[#B0A9CC] shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <Link
              href="/shop"
              prefetch={true}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 mx-5 mt-3 mb-5 text-[13px] font-bold text-[#FF4D6D] hover:text-[#e03859] transition-colors"
            >
              <span>
                See all {totalCategoriesCount > 0 ? `${totalCategoriesCount} ` : ""}categories
              </span>
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="border-t border-[#EAE3F7] mx-5" />

          {/* Navigation Links */}
          <nav className="flex flex-col px-5 py-5 gap-3.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                prefetch={true}
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
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Phone Footer */}
        <div className="shrink-0 border-t border-[#EAE3F7] bg-white px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <IconPhone className="w-4 h-4 text-[#FF4D6D]" />
            <span className="text-[13px] font-semibold text-[#3B3468]">01402494401</span>
          </div>
        </div>
      </div>
    </>
  );
}
