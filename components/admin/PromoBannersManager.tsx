"use client";

import React, { useState, useEffect } from "react";
import {
  getPromoBannersAdmin,
  createPromoBanner,
  updatePromoBanner,
  deletePromoBanner,
  getMediaUrl,
} from "@/lib/api";
import type { PromoBanner, PromoBannerType, PromoBannerGradient } from "../productData";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconPhoto,
  IconArrowRight,
  IconClock,
  IconTag,
  IconSparkles,
  IconChevronLeft,
  IconCheck,
} from "../icons";

const GRADIENT_OPTIONS: { id: PromoBannerGradient; label: string; classBg: string; textDark: boolean }[] = [
  { id: "purple", label: "Purple Gradient (Anime / Figures)", classBg: "bg-gradient-to-br from-[#7B5CFF] to-[#5B22B8]", textDark: false },
  { id: "yellow", label: "Yellow Gradient (Deals / Bricks)", classBg: "bg-gradient-to-br from-[#FFD15C] to-[#FFAE1A]", textDark: true },
  { id: "pink", label: "Pink Gradient (Kawaii / Cute)", classBg: "bg-gradient-to-br from-[#FF6584] to-[#FF4D6D]", textDark: false },
  { id: "blue", label: "Blue Gradient (Cyber / Kits)", classBg: "bg-gradient-to-br from-[#38B6FF] to-[#0070F3]", textDark: false },
  { id: "dark", label: "Dark Night Gradient (Premium)", classBg: "bg-gradient-to-br from-[#2D225A] to-[#171136]", textDark: false },
];

export default function PromoBannersManager() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // View state: "list" for banner overview, "form" for full-page add/edit
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PromoBanner | null>(null);

  // Form states
  const [bannerType, setBannerType] = useState<PromoBannerType>("category");
  const [badgeText, setBadgeText] = useState("");
  const [title, setTitle] = useState("");
  const [highlightWord, setHighlightWord] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("Shop now");
  const [buttonUrl, setButtonUrl] = useState("/shop");
  const [gradientType, setGradientType] = useState<PromoBannerGradient>("purple");
  const [countdownEnd, setCountdownEnd] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const load = async () => {
    const data = await getPromoBannersAdmin();
    setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const openCreate = () => {
    if (banners.length >= 2) {
      setToast("Maximum 2 promo banners allowed. Please edit or delete an existing banner.");
      return;
    }
    setFormMode("create");
    setEditingBanner(null);
    setBannerType("category");
    setBadgeText("New arrivals");
    setTitle("");
    setHighlightWord("");
    setSubtitle("");
    setButtonText("Shop now");
    setButtonUrl("/shop");
    setGradientType("purple");
    setCountdownEnd("");
    setOrder(banners.length);
    setIsActive(true);
    setImageFile(null);
    setImagePreview(null);
    setViewMode("form");
  };

  const openEdit = (banner: PromoBanner) => {
    const type = (banner.banner_type || banner.bannerType || "category") as PromoBannerType;
    setFormMode("edit");
    setEditingBanner(banner);
    setBannerType(type);
    setBadgeText(banner.badge_text || banner.badgeText || (type === "offer" ? "Deal of the week" : "New arrivals"));
    setTitle(banner.title || "");
    setHighlightWord(banner.highlight_word || banner.highlightWord || "");
    setSubtitle(banner.subtitle || "");
    setButtonText(banner.button_text || banner.buttonText || (type === "offer" ? "Grab deal" : "Shop now"));
    setButtonUrl(banner.button_url || banner.buttonUrl || (type === "offer" ? "/shop?deals=true" : "/shop"));
    setGradientType((banner.gradient_type || banner.gradientType || (type === "offer" ? "yellow" : "purple")) as PromoBannerGradient);

    const cd = banner.countdown_end || banner.countdownEnd;
    if (cd) {
      const d = new Date(cd);
      const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setCountdownEnd(iso);
    } else {
      setCountdownEnd("");
    }

    setOrder(banner.order ?? 0);
    setIsActive(banner.is_active !== false && banner.isActive !== false);
    setImageFile(null);
    setImagePreview(banner.image ? getMediaUrl(banner.image) : null);
    setViewMode("form");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setEditingBanner(null);
  };

  const handleTypeChange = (type: PromoBannerType) => {
    setBannerType(type);
    if (type === "category") {
      if (badgeText === "Deal of the week" || !badgeText) setBadgeText("New arrivals");
      if (buttonText === "Grab deal") setButtonText("Shop now");
      if (gradientType === "yellow") setGradientType("purple");
      if (buttonUrl === "/shop?deals=true") setButtonUrl("/shop");
    } else {
      if (badgeText === "New arrivals" || !badgeText) setBadgeText("Deal of the week");
      if (buttonText === "Shop now") setButtonText("Grab deal");
      if (gradientType === "purple") setGradientType("yellow");
      if (buttonUrl === "/shop") setButtonUrl("/shop?deals=true");
      if (!countdownEnd) {
        const d = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setCountdownEnd(iso);
      }
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setToast("Banner title is required.");
      return;
    }
    setSaving(true);

    const data = new FormData();
    data.append("banner_type", bannerType);
    data.append("badge_text", badgeText.trim());
    data.append("title", title.trim());
    data.append("highlight_word", highlightWord.trim());
    data.append("subtitle", subtitle.trim());
    data.append("button_text", buttonText.trim());
    data.append("button_url", buttonUrl.trim());
    data.append("gradient_type", gradientType);
    data.append("order", String(order));
    data.append("is_active", String(isActive));

    if (bannerType === "offer" && countdownEnd) {
      data.append("countdown_end", new Date(countdownEnd).toISOString());
    } else {
      data.append("countdown_end", "");
    }

    if (imageFile) {
      data.append("image_file", imageFile);
    }

    let res;
    if (formMode === "edit" && editingBanner) {
      res = await updatePromoBanner(editingBanner.id, data);
    } else {
      res = await createPromoBanner(data);
    }

    setSaving(false);
    if (res.success) {
      setToast(formMode === "edit" ? `"${title}" updated successfully.` : `"${title}" added successfully.`);
      setViewMode("list");
      await load();
    } else {
      setToast(res.error || "Failed to save promo banner.");
    }
  };

  const toggleActive = async (banner: PromoBanner) => {
    const currentActive = banner.is_active !== false && banner.isActive !== false;
    const data = new FormData();
    data.append("is_active", String(!currentActive));
    const res = await updatePromoBanner(banner.id, data);
    if (res.success) {
      await load();
    } else {
      setToast("Couldn't update this banner status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deletePromoBanner(deleteTarget.id);
    if (res.success) {
      setToast(`Banner "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      await load();
    } else {
      setToast("Couldn't delete this banner.");
    }
  };

  const renderHighlightTitle = (fullTitle: string, highlight?: string, isDarkText?: boolean) => {
    if (!highlight || !fullTitle.toLowerCase().includes(highlight.toLowerCase())) {
      return <span>{fullTitle || "Banner Title Here"}</span>;
    }
    const idx = fullTitle.toLowerCase().indexOf(highlight.toLowerCase());
    const before = fullTitle.slice(0, idx);
    const match = fullTitle.slice(idx, idx + highlight.length);
    const after = fullTitle.slice(idx + highlight.length);
    return (
      <span>
        {before}
        <span className={isDarkText ? "text-[#5B22B8]" : "text-[#FFC93C]"}>{match}</span>
        {after}
      </span>
    );
  };

  const currentGradConfig = GRADIENT_OPTIONS.find((g) => g.id === gradientType) || GRADIENT_OPTIONS[0];

  // =========================================================================
  // VIEW 2: PLAIN PAGE FORM (NO POPUP / NO MODAL)
  // =========================================================================
  if (viewMode === "form") {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Top Navigation & Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE3F7] shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackToList}
              className="p-2.5 rounded-2xl bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Back to Promo Banners List"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
                  {formMode === "edit" ? "Edit Promo Banner" : "Add New Promo Banner"}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    bannerType === "offer" ? "bg-amber-100 text-amber-900" : "bg-purple-100 text-purple-900"
                  }`}
                >
                  {bannerType === "offer" ? "Deal / Offer" : "Category"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#736E9B] mt-0.5">
                Configure banner attributes, countdown ticker, action button, and illustration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={handleBackToList}
              className="px-4 py-2.5 rounded-2xl bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#5C5478] text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                const form = document.getElementById("promo-banner-plain-form") as HTMLFormElement;
                if (form) form.requestSubmit();
              }}
              disabled={saving}
              className="px-5 py-2.5 rounded-2xl bg-[#171136] hover:bg-[#251c4a] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <IconCheck className="w-4 h-4" />
                  <span>{formMode === "edit" ? "Save Changes" : "Create Banner"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Form on Left (65%), Sticky Live Preview on Right (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Form Fields Column */}
          <form
            id="promo-banner-plain-form"
            onSubmit={handleSubmit}
            className="lg:col-span-7 space-y-6"
          >
            {/* Step 1: Banner Type Selector */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE3F7] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#171136] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#7B5CFF] text-white text-xs flex items-center justify-center font-extrabold">
                      1
                    </span>
                    <span>Banner Type</span>
                    <span className="text-[#FF4D6D]">*</span>
                  </h3>
                  <p className="text-xs text-[#736E9B] mt-0.5">
                    Select whether this is a category spotlight banner or a timed promotional deal.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleTypeChange("category")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    bannerType === "category"
                      ? "border-[#7B5CFF] bg-[#F6F1FF] ring-2 ring-[#7B5CFF]/30 shadow-xs"
                      : "border-[#EAE3F7] bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <IconTag className="w-4 h-4" />
                    </div>
                    {bannerType === "category" && (
                      <span className="w-5 h-5 rounded-full bg-[#7B5CFF] text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="font-extrabold text-sm text-[#171136]">Normal Category Banner</p>
                    <p className="text-[11px] text-[#736E9B] mt-0.5">
                      Highlights a specific collection or product category. No countdown timer.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("offer")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    bannerType === "offer"
                      ? "border-[#FFB703] bg-amber-50/70 ring-2 ring-[#FFB703]/40 shadow-xs"
                      : "border-[#EAE3F7] bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <IconClock className="w-4 h-4" />
                    </div>
                    {bannerType === "offer" && (
                      <span className="w-5 h-5 rounded-full bg-[#FFB703] text-[#171136] flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="font-extrabold text-sm text-[#171136]">Deal of the Week / Offer</p>
                    <p className="text-[11px] text-[#736E9B] mt-0.5">
                      Includes live countdown clock (Days, Hours, Minutes, Seconds) and special offer tags.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Content & Copywriting */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE3F7] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#171136] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#7B5CFF] text-white text-xs flex items-center justify-center font-extrabold">
                  2
                </span>
                <span>Banner Content</span>
              </h3>

              {/* Badge Text */}
              <div>
                <label className="font-bold text-xs text-[#171136] block mb-1.5">
                  {bannerType === "category" ? "Category Name / Badge Text" : "Deal Type / Badge Text"}
                </label>
                <input
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder={bannerType === "category" ? "e.g. New arrivals, Anime Figures" : "e.g. Deal of the week, Flash Deal"}
                  className="w-full p-3 rounded-2xl border border-[#EAE3F7] text-xs focus:outline-none focus:border-[#7B5CFF] bg-[#FAFAFD] focus:bg-white transition-all font-semibold"
                />
              </div>

              {/* Title & Highlight Word */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-xs text-[#171136] block mb-1.5">
                    Banner Title <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={bannerType === "category" ? "e.g. Anime figure collection" : "e.g. Up to 40% off brick sets"}
                    className="w-full p-3 rounded-2xl border border-[#EAE3F7] text-xs focus:outline-none focus:border-[#7B5CFF] bg-[#FAFAFD] focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-xs text-[#171136] block mb-1.5">
                    Highlight Word
                  </label>
                  <input
                    value={highlightWord}
                    onChange={(e) => setHighlightWord(e.target.value)}
                    placeholder={bannerType === "category" ? "e.g. collection" : "e.g. 40% off"}
                    className="w-full p-3 rounded-2xl border border-[#EAE3F7] text-xs focus:outline-none focus:border-[#7B5CFF] bg-[#FAFAFD] focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="font-bold text-xs text-[#171136] block mb-1.5">
                  Subtitle / Extra Note
                </label>
                <input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder={bannerType === "category" ? "e.g. Limited runs · From ৳2,499" : "e.g. Special weekly limited discount"}
                  className="w-full p-3 rounded-2xl border border-[#EAE3F7] text-xs focus:outline-none focus:border-[#7B5CFF] bg-[#FAFAFD] focus:bg-white transition-all font-semibold"
                />
              </div>

              {/* Countdown end date & time: ONLY FOR OFFER BANNER */}
              {bannerType === "offer" && (
                <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl space-y-2">
                  <label className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                    <IconClock className="w-4 h-4 text-amber-700" />
                    <span>Countdown End Date & Time (Live Ticker)</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={countdownEnd}
                    onChange={(e) => setCountdownEnd(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:border-amber-600 font-mono text-xs"
                  />
                  <p className="text-[11px] text-amber-800">
                    The live homepage card will dynamically display a real-time countdown (days, hrs, min, sec) ticking down to this moment.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Button & Link */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE3F7] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#171136] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#7B5CFF] text-white text-xs flex items-center justify-center font-extrabold">
                  3
                </span>
                <span>Call to Action Button</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-xs text-[#171136] block mb-1.5">Button Text</label>
                  <input
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder={bannerType === "offer" ? "Grab deal" : "Shop now"}
                    className="w-full p-3 rounded-2xl border border-[#EAE3F7] text-xs focus:outline-none focus:border-[#7B5CFF] bg-[#FAFAFD] focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-xs text-[#171136] block mb-1.5">Button Target URL</label>
                  <input
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="/shop"
                    className="w-full p-3 rounded-2xl border border-[#EAE3F7] font-mono text-xs focus:outline-none focus:border-[#7B5CFF] bg-[#FAFAFD] focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Styling & Illustration Image */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE3F7] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#171136] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#7B5CFF] text-white text-xs flex items-center justify-center font-extrabold">
                  4
                </span>
                <span>Theme & Illustration Image</span>
              </h3>

              {/* Gradient Options */}
              <div>
                <label className="font-bold text-xs text-[#171136] block mb-2">Background Gradient Theme</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {GRADIENT_OPTIONS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGradientType(g.id)}
                      className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left cursor-pointer transition-all ${
                        gradientType === g.id
                          ? "border-[#7B5CFF] ring-2 ring-[#7B5CFF]/30 bg-[#FAF8FE] shadow-xs"
                          : "border-[#EAE3F7] bg-white hover:bg-gray-50"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-xl shrink-0 shadow-xs ${g.classBg}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#171136] truncate">{g.label.split("(")[0].trim()}</p>
                        <p className="text-[10px] text-[#736E9B] truncate">{g.label.split("(")[1]?.replace(")", "") || ""}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="pt-2">
                <label className="font-bold text-xs text-[#171136] block mb-2">Banner Illustration / Character Image</label>
                {imagePreview ? (
                  <div className="relative w-full h-[150px] rounded-2xl overflow-hidden border border-[#EAE3F7] bg-[#FAF8FE] flex items-center justify-center p-3">
                    <img src={imagePreview} alt="" className="h-full w-auto object-contain" />
                    <label className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 border border-[#EAE3F7] text-xs font-bold text-[#7B5CFF] hover:bg-white cursor-pointer shadow-xs">
                      Change Image
                      <input type="file" accept="image/*,.svg" onChange={handleImageFile} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#D9CEEE] hover:border-[#7B5CFF] bg-[#FAF8FE] hover:bg-[#F6F1FF] transition-all cursor-pointer">
                    <input type="file" accept="image/*,.svg" onChange={handleImageFile} className="hidden" />
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7B5CFF] flex items-center justify-center shrink-0">
                      <IconPhoto className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#171136]">Upload character / product illustration</p>
                      <p className="text-[10.5px] text-[#736E9B]">PNG, SVG, or JPG with transparent or clean background</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Step 5: Display Order & Status */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE3F7] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#171136] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#7B5CFF] text-white text-xs flex items-center justify-center font-extrabold">
                  5
                </span>
                <span>Display & Storefront Visibility</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="font-bold text-xs text-[#171136] block mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl border border-[#EAE3F7] text-xs focus:outline-none focus:border-[#7B5CFF] bg-[#FAFAFD] focus:bg-white transition-all font-semibold"
                  />
                  <p className="text-[10.5px] text-[#736E9B] mt-1">Order 0 shows first (left card), Order 1 shows second (right card).</p>
                </div>

                <div className="p-3 bg-[#FAF8FE] rounded-2xl border border-[#EAE3F7]">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 accent-[#7B5CFF]"
                    />
                    <div>
                      <p className="font-bold text-xs text-[#171136]">Active on Storefront</p>
                      <p className="text-[10.5px] text-[#736E9B]">Show this banner on the homepage</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleBackToList}
                className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel & Return
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-2xl bg-[#171136] hover:bg-[#251c4a] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <IconCheck className="w-4 h-4" />
                    <span>{formMode === "edit" ? "Save Changes" : "Create Promo Banner"}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Column: Sticky Live Storefront Preview */}
          <div className="lg:col-span-5 sticky top-6 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-[#EAE3F7] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-[#171136] flex items-center gap-1.5">
                  <IconSparkles className="w-4 h-4 text-[#7B5CFF]" /> Live Storefront Preview
                </span>
                <span className="text-[10.5px] font-bold text-[#736E9B]">Homepage Card</span>
              </div>

              {/* Render Preview Card */}
              <div
                className={`relative ${currentGradConfig.classBg} rounded-2xl overflow-hidden p-4 sm:p-5 min-h-[180px] sm:min-h-[200px] flex flex-col justify-between shadow-md transition-all duration-300`}
              >
                <div
                  className={`absolute -right-6 -top-6 w-[130px] h-[130px] rounded-full pointer-events-none ${
                    currentGradConfig.textDark ? "bg-white/25 -bottom-10 -top-auto -right-4" : "bg-white/[0.08]"
                  }`}
                />

                <div className="relative z-10 pr-20">
                  <span
                    className={`inline-block text-[10px] font-bold rounded-full px-2.5 py-0.5 ${
                      currentGradConfig.textDark ? "bg-[#171136] text-white" : "bg-white/20 text-white"
                    }`}
                  >
                    {badgeText || (bannerType === "offer" ? "Deal of the week" : "Category")}
                  </span>

                  <h3
                    className={`font-[family-name:var(--font-display)] font-extrabold text-[15px] sm:text-[18px] leading-[1.18] mt-1.5 line-clamp-2 tracking-tight ${
                      currentGradConfig.textDark ? "text-[#171136]" : "text-white"
                    }`}
                  >
                    {renderHighlightTitle(title, highlightWord, currentGradConfig.textDark)}
                  </h3>

                  {bannerType === "offer" ? (
                    <div className="flex items-center gap-1.5 mt-2">
                      {["02d", "14h", "36m", "09s"].map((unit, i) => (
                        <div
                          key={i}
                          className={`rounded px-1.5 py-0.5 text-[9.5px] font-extrabold ${
                            currentGradConfig.textDark ? "bg-white/90 text-[#171136]" : "bg-[#171136]/60 text-white"
                          }`}
                        >
                          {unit}
                        </div>
                      ))}
                    </div>
                  ) : (
                    subtitle && (
                      <p
                        className={`text-[11px] mt-0.5 line-clamp-1 ${
                          currentGradConfig.textDark ? "text-[#171136]/80 font-medium" : "text-[#E4DAFF]"
                        }`}
                      >
                        {subtitle}
                      </p>
                    )
                  )}
                </div>

                <div className="relative z-10 mt-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold rounded-full h-7 px-3 shadow-xs ${
                      currentGradConfig.textDark
                        ? "bg-[#171136] text-white"
                        : "bg-white text-[#5B22B8]"
                    }`}
                  >
                    {buttonText || "Shop now"} <IconArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>

                {/* Illustration Image */}
                <div className="absolute right-2 bottom-0 w-[75px] sm:w-[90px] pointer-events-none">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt=""
                      className="w-full h-auto max-h-[140px] object-contain drop-shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-[100px] flex items-center justify-center text-white/30">
                      <IconPhoto className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#F0EBF8] text-[11px] text-[#736E9B] space-y-1">
                <div className="flex justify-between">
                  <span>Target Link:</span>
                  <span className="font-mono font-semibold text-[#171136]">{buttonUrl || "/shop"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={isActive ? "text-[#0FA968] font-bold" : "text-gray-400 font-bold"}>
                    {isActive ? "Active on storefront" : "Disabled (Hidden)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-[60] bg-[#171136] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl max-w-xs">
            {toast}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: PROMO BANNERS LIST OVERVIEW
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EAE3F7] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
              Promo Banners
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F6F1FF] text-[#7B5CFF]">
              {banners.length} / 2 Banners
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#736E9B] mt-1">
            Manage the two promotional banners below the hero section. Maximum 2 banners can be added (Category Promo & Deal of the Week).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {banners.length >= 2 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8A84A6] bg-[#FAF8FE] px-3 py-2 rounded-xl border border-[#EAE3F7]">
                Max limit (2/2) reached
              </span>
              <button
                disabled
                className="bg-gray-200 text-gray-400 text-xs font-bold px-4 py-2.5 rounded-2xl cursor-not-allowed flex items-center gap-1.5"
                title="Only 2 promo banners can exist at a time. Edit or delete one to add another."
              >
                <IconPlus className="w-4 h-4" />
                <span>Add Promo Banner</span>
              </button>
            </div>
          ) : (
            <button
              onClick={openCreate}
              className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <IconPlus className="w-4 h-4" />
              <span>Add Promo Banner</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Banners */}
      {loading ? (
        <p className="text-xs text-[#8A84A6] py-12 text-center">Loading promo banners...</p>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#D9CEEE] py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FAF8FE] text-[#7B5CFF] flex items-center justify-center mx-auto mb-3">
            <IconSparkles className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-[#171136]">No promo banners added yet.</p>
          <p className="text-xs text-[#8A84A6] mt-1 mb-4">Add up to 2 promo banners to highlight categories or special deals.</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 bg-[#7B5CFF] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#6846f6] cursor-pointer"
          >
            <IconPlus className="w-4 h-4" /> Add First Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map((banner, index) => {
            const active = banner.is_active !== false && banner.isActive !== false;
            const isOffer = (banner.banner_type || banner.bannerType) === "offer";
            const grad = (banner.gradient_type || banner.gradientType || (isOffer ? "yellow" : "purple")) as PromoBannerGradient;
            const gradConfig = GRADIENT_OPTIONS.find((g) => g.id === grad) || GRADIENT_OPTIONS[0];
            const isDarkText = gradConfig.textDark;
            const bText = banner.badge_text || banner.badgeText || (isOffer ? "Deal of the week" : "Category");

            return (
              <div
                key={banner.id}
                className="bg-white rounded-3xl border border-[#EAE3F7] p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                {/* Banner Mini Info Bar */}
                <div className="flex items-center justify-between gap-2 border-b border-[#F0EBF8] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FAF8FE] text-[#171136] text-xs font-bold flex items-center justify-center border border-[#EAE3F7]">
                      #{index + 1}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        isOffer ? "bg-amber-100 text-amber-900 border border-amber-200" : "bg-purple-100 text-purple-900 border border-purple-200"
                      }`}
                    >
                      {isOffer ? <IconClock className="w-3 h-3 text-amber-700" /> : <IconTag className="w-3 h-3 text-purple-700" />}
                      {isOffer ? "Offer / Deal Banner" : "Category Banner"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        active ? "bg-[#0FA968]/15 text-[#0FA968]" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {active ? "Active" : "Disabled"}
                    </span>
                    <button
                      onClick={() => toggleActive(banner)}
                      title={active ? "Deactivate" : "Activate"}
                      className={`relative w-8 h-4.5 rounded-full transition-colors cursor-pointer ${
                        active ? "bg-[#0FA968]" : "bg-[#E3DEF2]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${
                          active ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Banner Live Card Preview */}
                <div
                  className={`relative rounded-2xl overflow-hidden p-4 sm:p-5 min-h-[170px] sm:min-h-[190px] flex flex-col justify-between ${gradConfig.classBg}`}
                >
                  <div className="absolute -right-6 -top-6 w-[120px] h-[120px] rounded-full bg-white/10 pointer-events-none" />

                  <div className="relative z-10 pr-20">
                    <span
                      className={`inline-block text-[10px] font-bold rounded-full px-2.5 py-0.5 ${
                        isDarkText ? "bg-[#171136] text-white" : "bg-white/20 text-white"
                      }`}
                    >
                      {bText}
                    </span>
                    <h3
                      className={`font-[family-name:var(--font-display)] font-extrabold text-[15px] sm:text-[18px] leading-[1.18] mt-1.5 line-clamp-2 tracking-tight ${
                        isDarkText ? "text-[#171136]" : "text-white"
                      }`}
                    >
                      {renderHighlightTitle(banner.title, banner.highlight_word || banner.highlightWord, isDarkText)}
                    </h3>
                    {banner.subtitle && (
                      <p
                        className={`text-[11px] mt-0.5 line-clamp-1 ${
                          isDarkText ? "text-[#171136]/75 font-medium" : "text-[#E4DAFF]"
                        }`}
                      >
                        {banner.subtitle}
                      </p>
                    )}

                    {/* Countdown Preview if offer */}
                    {isOffer && (
                      <div className="flex items-center gap-1.5 mt-2">
                        {["02d", "14h", "36m", "09s"].map((unit, i) => (
                          <div
                            key={i}
                            className={`rounded px-1.5 py-0.5 text-[9.5px] font-extrabold ${
                              isDarkText ? "bg-white/90 text-[#171136]" : "bg-[#171136]/60 text-white"
                            }`}
                          >
                            {unit}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 mt-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold rounded-full h-7 px-3 shadow-xs ${
                        isDarkText
                          ? "bg-[#171136] text-white"
                          : "bg-white text-[#5B22B8]"
                      }`}
                    >
                      {banner.button_text || banner.buttonText || "Shop now"}
                      <IconArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  {/* Image illustration */}
                  <div className="absolute right-2 bottom-0 w-[70px] sm:w-[85px] pointer-events-none">
                    {banner.image ? (
                      <img
                        src={getMediaUrl(banner.image)}
                        alt=""
                        className="w-full h-auto max-h-[130px] object-contain drop-shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-[100px] flex items-center justify-center text-white/40">
                        <IconPhoto className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-[#736E9B] truncate max-w-[200px]">
                    <span className="font-semibold text-[#171136]">Link: </span>
                    <span className="font-mono">{banner.button_url || banner.buttonUrl || "/shop"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(banner)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] text-xs font-bold transition-all cursor-pointer"
                    >
                      <IconEdit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(banner)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all cursor-pointer"
                    >
                      <IconTrash className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <IconTrash className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136] mb-1">
              Delete Promo Banner?
            </h3>
            <p className="text-xs text-[#736E9B] mb-5">
              Are you sure you want to remove <strong>{deleteTarget.title}</strong>? The homepage will fall back to defaults if fewer than 2 banners are configured.
            </p>
            <div className="flex justify-center gap-2 text-xs font-bold">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#171136] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl max-w-xs animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
