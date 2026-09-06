import Image from "next/image";
import { IconArrowRight, IconArrowLeft, IconArrowRightSlim } from "./icons";

export default function Hero() {
  return (
    <div className="relative flex-1 bg-grad-hero rounded-2xl sm:rounded-[24px] overflow-hidden min-h-[148px] sm:min-h-[220px] lg:min-h-[240px] flex items-center">
      {/* Background ambient shapes */}
      <div className="absolute -right-10 -top-10 w-[240px] h-[240px] rounded-full bg-white/[0.06] pointer-events-none" />
      <div className="absolute left-[120px] bottom-[-60px] w-[200px] h-[200px] rounded-full bg-white/[0.05] pointer-events-none" />
      <div className="absolute right-[140px] top-[40px] w-[260px] h-[260px] rounded-full border border-white/15 hidden lg:block pointer-events-none" />

      {/* Top right pagination indicator badge */}
      <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-4 z-20 bg-black/35 backdrop-blur-md text-white/95 text-[8.5px] sm:text-[11px] font-bold px-2 sm:px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFC93C]" />
        01 / 03
      </div>

      <div className="relative z-10 px-3.5 py-3 sm:px-8 sm:py-6 lg:px-10 lg:py-7 w-full max-w-[68%] sm:max-w-[58%] lg:max-w-[480px]">
        <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/15 rounded-full px-2 sm:px-3 py-0.5 text-white text-[8.5px] sm:text-[11px] font-bold tracking-wide">
          <span className="text-[#FFC93C]">✦</span> New season drop
        </span>
        <h1 className="font-[family-name:var(--font-display)] font-extrabold text-white text-[15px] sm:text-[26px] lg:text-[30px] leading-[1.15] tracking-tight mt-1 sm:mt-2.5">
          Build your own <span className="text-[#FFC93C]">universe.</span>
        </h1>
        <p className="text-[#DCD3F5] text-[9.5px] sm:text-[12px] lg:text-[13px] mt-1 sm:mt-2 leading-tight sm:leading-snug line-clamp-2">
          Anime figures, cartoon collectibles, brick sets & coding kits — shipped in 48h.
        </p>
        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-4">
          <button className="flex items-center gap-1 sm:gap-1.5 bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-bold text-[9.5px] sm:text-[13px] rounded-full h-6 sm:h-9 px-2.5 sm:px-5 shadow-sm active:scale-95 transition-all">
            Shop now <IconArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </button>
          <button className="hidden sm:flex items-center border border-white/70 hover:border-white text-white font-semibold text-[13px] rounded-full h-9 px-4 active:scale-95 transition-all">
            Explore sets
          </button>
        </div>
      </div>

      {/* Desktop slide arrows */}
      <div className="hidden lg:flex absolute right-6 bottom-4 items-center gap-2 z-10">
        <button
          aria-label="Previous slide"
          className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <IconArrowLeft className="w-3 h-3" />
        </button>
        <button
          aria-label="Next slide"
          className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#171136] hover:bg-white/90 transition-colors"
        >
          <IconArrowRightSlim className="w-3 h-3" />
        </button>
      </div>

      {/* Character illustration */}
      <div className="absolute right-1 sm:right-4 lg:right-8 bottom-0 w-[72px] sm:w-[125px] lg:w-[155px] pointer-events-none">
        <Image
          src="/images/figure-samurai-red.svg"
          alt="Neo Samurai figure"
          width={155}
          height={210}
          className="w-full h-auto drop-shadow-md"
          priority
        />
      </div>
      <div className="hidden lg:block absolute right-[21%] bottom-2 w-[70px] pointer-events-none opacity-90">
        <Image
          src="/images/bricks-stack-purple.svg"
          alt="Brick stack"
          width={70}
          height={85}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
