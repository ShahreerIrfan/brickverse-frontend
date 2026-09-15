"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getMediaUrl } from "@/lib/api";
import type { HeroSlide } from "./productData";
import { IconArrowRight, IconArrowLeft, IconArrowRightSlim } from "./icons";

const fallbackSlide: HeroSlide = {
  id: -1,
  title: "Build your own universe.",
  subtitle: "Anime figures, cartoon collectibles, brick sets & coding kits — shipped in 48h.",
  button_text: "Shop now",
  button_link: "/shop",
  image: null,
};

const AUTOPLAY_MS = 6000;

function SlideContent({ slide }: { slide: HeroSlide }) {
  const hasCustomImage = !!slide.image;
  return (
    <>
      {hasCustomImage ? (
        <Image
          src={getMediaUrl(slide.image)}
          alt=""
          fill
          priority
          className="object-cover pointer-events-none"
        />
      ) : (
        <>
          {/* Background ambient shapes (default look, no slide image set) */}
          <div className="absolute -right-10 -top-10 w-[280px] h-[280px] rounded-full bg-white/[0.06] pointer-events-none" />
          <div className="absolute left-[120px] bottom-[-60px] w-[240px] h-[240px] rounded-full bg-white/[0.05] pointer-events-none" />
          <div className="absolute right-[140px] top-[40px] w-[300px] h-[300px] rounded-full border border-white/15 hidden lg:block pointer-events-none" />
          <div className="absolute right-1 sm:right-6 lg:right-12 bottom-0 w-[80px] sm:w-[155px] lg:w-[250px] xl:w-[270px] pointer-events-none">
            <Image
              src="/images/figure-samurai-red.svg"
              alt=""
              width={270}
              height={370}
              className="w-full h-auto drop-shadow-lg"
              priority
            />
          </div>
          <div className="hidden lg:block absolute right-[24%] bottom-4 w-[105px] pointer-events-none opacity-90">
            <Image
              src="/images/bricks-stack-purple.svg"
              alt=""
              width={105}
              height={130}
              className="w-full h-auto"
            />
          </div>
        </>
      )}

      <div className="relative z-10 px-4 py-3.5 sm:px-9 sm:py-7 lg:px-12 lg:py-10 w-full max-w-[68%] sm:max-w-[62%] lg:max-w-[560px]">
        <h1 className="hero-content-in font-[family-name:var(--font-display)] font-extrabold text-white text-[16.5px] sm:text-[28px] lg:text-[42px] xl:text-[46px] leading-[1.12] tracking-tight">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p
            className="hero-content-in text-[#DCD3F5] text-[10px] sm:text-[13px] lg:text-[16px] mt-1.5 sm:mt-2.5 lg:mt-4 leading-tight sm:leading-snug line-clamp-2"
            style={{ animationDelay: "70ms" }}
          >
            {slide.subtitle}
          </p>
        )}
        {(slide.button_text || slide.buttonText) && (
          <div
            className="hero-content-in flex items-center gap-2 sm:gap-3.5 mt-2.5 sm:mt-5 lg:mt-8"
            style={{ animationDelay: "140ms" }}
          >
            <a
              href={slide.button_link || slide.buttonLink || "#"}
              className="flex items-center gap-1.5 sm:gap-2 bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-bold text-[10px] sm:text-[13.5px] lg:text-[15px] rounded-full h-7 sm:h-10 lg:h-13 px-3 sm:px-6 lg:px-7 shadow-sm active:scale-95 transition-all"
            >
              {slide.button_text || slide.buttonText}
              <IconArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default function Hero({ slides }: { slides?: HeroSlide[] }) {
  const activeSlides = slides && slides.length > 0 ? slides : [fallbackSlide];
  const count = activeSlides.length;
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goPrev = useCallback(
    () => setCurrent((i) => (i - 1 + count) % count),
    [count]
  );
  const goNext = useCallback(() => setCurrent((i) => (i + 1) % count), [count]);

  useEffect(() => {
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count]);

  const restartAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
  };

  const handlePrev = () => {
    goPrev();
    restartAutoplay();
  };
  const handleNext = () => {
    goNext();
    restartAutoplay();
  };
  const handleDot = (i: number) => {
    setCurrent(i);
    restartAutoplay();
  };

  return (
    <div className="relative w-full bg-grad-hero rounded-2xl sm:rounded-[24px] overflow-hidden h-[190px] sm:h-[290px] lg:h-[440px] xl:h-[460px] flex items-center">
      {/* Slide track: each slide is absolutely stacked and cross-fades + drifts into place */}
      {activeSlides.map((s, i) => {
        const offset = i - current;
        const isActive = i === current;
        return (
          <div
            key={s.id}
            aria-hidden={!isActive}
            className="absolute inset-0 flex items-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateX(0)" : `translateX(${offset > 0 ? 3 : -3}%)`,
              zIndex: isActive ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            {isActive ? <SlideContent key={s.id} slide={s} /> : <SlideContent slide={s} />}
          </div>
        );
      })}

      {/* Pagination indicator badge */}
      {count > 1 && (
        <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-5 z-20 bg-black/35 backdrop-blur-md text-white/95 text-[9px] sm:text-[11.5px] font-bold px-2 sm:px-3.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC93C]" />
          {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </div>
      )}

      {count > 1 && (
        <>
          {/* Desktop slide arrows */}
          <div className="hidden lg:flex absolute right-7 bottom-5 items-center gap-2.5 z-20">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <IconArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#171136] hover:bg-white/90 transition-colors cursor-pointer"
            >
              <IconArrowRightSlim className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="absolute left-4 sm:left-9 lg:left-12 bottom-3 sm:bottom-5 z-20 flex items-center gap-1.5">
            {activeSlides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => handleDot(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  i === current ? "w-5 bg-[#FFC93C]" : "w-1.5 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
