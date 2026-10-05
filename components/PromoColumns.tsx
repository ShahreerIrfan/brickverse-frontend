"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "./icons";
import { getPromoBanners, getMediaUrl } from "@/lib/api";
import type { PromoBanner, PromoBannerGradient } from "./productData";

const DEFAULT_BANNERS: PromoBanner[] = [
  {
    id: 1,
    banner_type: "category",
    badge_text: "New arrivals",
    title: "Anime figure collection",
    highlight_word: "collection",
    subtitle: "Limited runs · From ৳2,499",
    button_text: "Shop now",
    button_url: "/shop",
    gradient_type: "purple",
    image: null,
    order: 0,
    is_active: true,
  },
  {
    id: 2,
    banner_type: "offer",
    badge_text: "Deal of the week",
    title: "Up to 40% off brick sets",
    highlight_word: "",
    subtitle: "Limited weekly offer",
    button_text: "Grab deal",
    button_url: "/shop?deals=true",
    gradient_type: "yellow",
    image: null,
    order: 1,
    is_active: true,
  },
];

function calculateTimeLeft(endDateStr?: string | null) {
  if (!endDateStr) {
    return [
      { value: "02", label: "days" },
      { value: "14", label: "hrs" },
      { value: "36", label: "min" },
      { value: "09", label: "sec" },
    ];
  }

  const diff = new Date(endDateStr).getTime() - Date.now();
  if (diff <= 0) {
    return [
      { value: "00", label: "days" },
      { value: "00", label: "hrs" },
      { value: "00", label: "min" },
      { value: "00", label: "sec" },
    ];
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const min = Math.floor((diff / 1000 / 60) % 60);
  const sec = Math.floor((diff / 1000) % 60);

  return [
    { value: String(days).padStart(2, "0"), label: "days" },
    { value: String(hrs).padStart(2, "0"), label: "hrs" },
    { value: String(min).padStart(2, "0"), label: "min" },
    { value: String(sec).padStart(2, "0"), label: "sec" },
  ];
}

function getGradientClasses(grad?: PromoBannerGradient, isOffer?: boolean) {
  const resolved = grad || (isOffer ? "yellow" : "purple");
  switch (resolved) {
    case "yellow":
      return { bg: "bg-grad-yellow", textDark: true };
    case "pink":
      return { bg: "bg-gradient-to-br from-[#FF6584] to-[#FF4D6D]", textDark: false };
    case "blue":
      return { bg: "bg-gradient-to-br from-[#38B6FF] to-[#0070F3]", textDark: false };
    case "dark":
      return { bg: "bg-gradient-to-br from-[#2D225A] to-[#171136]", textDark: false };
    case "purple":
    default:
      return { bg: "bg-grad-purple", textDark: false };
  }
}

function renderHighlightTitle(fullTitle: string, highlight?: string, isDarkText?: boolean) {
  if (!highlight || !fullTitle.toLowerCase().includes(highlight.toLowerCase())) {
    return <span>{fullTitle}</span>;
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
}

function PromoCard({ banner, isSecond }: { banner: PromoBanner; isSecond?: boolean }) {
  const isOffer = (banner.banner_type || banner.bannerType) === "offer";
  const grad = banner.gradient_type || banner.gradientType;
  const { bg, textDark } = getGradientClasses(grad, isOffer);
  const badge = banner.badge_text || banner.badgeText || (isOffer ? "Deal of the week" : "New arrivals");
  const btnText = banner.button_text || banner.buttonText || (isOffer ? "Grab deal" : "Shop now");
  const btnUrl = banner.button_url || banner.buttonUrl || "/shop";
  const countdownEndDate = banner.countdown_end || banner.countdownEnd;

  const [timerValues, setTimerValues] = useState(() => calculateTimeLeft(countdownEndDate));

  useEffect(() => {
    if (!isOffer) return;
    const interval = setInterval(() => {
      setTimerValues(calculateTimeLeft(countdownEndDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOffer, countdownEndDate]);

  const defaultImg = isSecond ? "/images/bricks-stack-navy.svg" : "/images/figure-newarrivals.svg";
  const customImg = banner.image ? getMediaUrl(banner.image) : null;

  return (
    <div
      className={`relative ${bg} rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden p-3 sm:p-5 lg:p-6 min-h-[135px] sm:min-h-[170px] lg:h-[225px] flex flex-col justify-between shadow-xs`}
    >
      <div
        className={`absolute -right-6 -top-6 w-[140px] h-[140px] lg:w-[180px] lg:h-[180px] rounded-full pointer-events-none ${
          textDark ? "bg-white/25 -bottom-10 -top-auto -right-4" : "bg-white/[0.08]"
        }`}
      />

      {/* Text Info Column */}
      <div className="relative z-10 pr-12 sm:pr-20 md:pr-24 lg:pr-28">
        <span
          className={`inline-block text-[8px] sm:text-[10px] lg:text-[11.5px] font-bold rounded-full px-2 sm:px-3 lg:px-3.5 py-0.5 lg:py-1 ${
            textDark ? "bg-[#171136] text-white" : "bg-white/20 text-white"
          }`}
        >
          {badge}
        </span>

        {/* 2-line responsive title */}
        <h3
          className={`font-[family-name:var(--font-display)] font-extrabold text-[11px] sm:text-[15px] md:text-[18px] lg:text-[21px] xl:text-[23px] leading-[1.18] mt-1 sm:mt-1.5 lg:mt-2 line-clamp-2 tracking-tight ${
            textDark ? "text-[#171136]" : "text-white"
          }`}
        >
          {renderHighlightTitle(banner.title, banner.highlight_word || banner.highlightWord, textDark)}
        </h3>

        {/* Offer timer or Category subtitle */}
        {isOffer ? (
          <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5 lg:mt-2.5">
            {timerValues.map((t) => (
              <div
                key={t.label}
                className="bg-white/95 rounded sm:rounded-md lg:rounded-lg px-1 py-0.5 sm:px-1.5 sm:py-0.5 lg:px-2 lg:py-0.5 flex flex-col items-center justify-center min-w-[16px] sm:min-w-[24px] lg:min-w-[34px] shadow-2xs"
              >
                <span className="font-[family-name:var(--font-display)] font-extrabold text-[7.5px] sm:text-[10.5px] lg:text-[13px] text-[#171136] leading-none">
                  {t.value}
                </span>
                <span className="text-[4.5px] sm:text-[7px] lg:text-[8.5px] font-semibold text-[#736E9B] leading-none mt-0.5">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          banner.subtitle && (
            <p
              className={`text-[8px] sm:text-[11px] lg:text-[12.5px] mt-0.5 sm:mt-1 lg:mt-1.5 leading-tight line-clamp-1 ${
                textDark ? "text-[#171136]/80 font-medium" : "text-[#E4DAFF]"
              }`}
            >
              {banner.subtitle}
            </p>
          )
        )}
      </div>

      {/* Button CTA */}
      <div className="relative z-10 mt-1.5 sm:mt-2.5 lg:mt-3">
        <Link
          href={btnUrl}
          className={`inline-flex items-center gap-1 sm:gap-1.5 font-bold text-[8.5px] sm:text-[11.5px] lg:text-[13px] rounded-full h-5 sm:h-7 lg:h-8.5 px-2.5 sm:px-3.5 lg:px-4.5 shadow-sm active:scale-95 transition-all ${
            textDark
              ? "bg-[#171136] hover:bg-[#251c4a] text-white"
              : "bg-white hover:bg-white/95 text-[#5B22B8]"
          }`}
        >
          {btnText} <IconArrowRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3" />
        </Link>
      </div>

      {/* Illustration Image */}
      <div
        className={`absolute pointer-events-none ${
          isSecond
            ? "right-0.5 sm:right-2 lg:right-3.5 bottom-0 w-[42px] sm:w-[68px] lg:w-[98px]"
            : "right-0.5 sm:right-1.5 lg:right-2.5 bottom-0 w-[48px] sm:w-[75px] lg:w-[110px]"
        }`}
      >
        {customImg ? (
          <img
            src={customImg}
            alt={banner.title}
            className="w-full h-auto max-h-[110px] sm:max-h-[145px] lg:max-h-[195px] object-contain drop-shadow-sm"
          />
        ) : (
          <Image
            src={defaultImg}
            alt={banner.title}
            width={isSecond ? 98 : 110}
            height={isSecond ? 118 : 200}
            className="w-full h-auto drop-shadow-sm"
          />
        )}
      </div>
    </div>
  );
}

export default function PromoColumns() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void getPromoBanners()
      .then((data) => {
        if (active && data && data.length > 0) {
          setBanners(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const displayBanners = banners.length > 0 ? banners.slice(0, 2) : DEFAULT_BANNERS;

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full items-stretch">
      {displayBanners.map((b, idx) => (
        <PromoCard key={b.id || idx} banner={b} isSecond={idx === 1} />
      ))}
    </div>
  );
}
