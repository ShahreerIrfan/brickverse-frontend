import Image from "next/image";
import { IconArrowRight, IconArrowLeft, IconArrowRightSlim } from "./icons";

export default function Hero() {
  return (
    <div className="relative w-full bg-grad-hero rounded-2xl sm:rounded-[24px] overflow-hidden h-[190px] sm:h-[290px] lg:h-[360px] xl:h-[375px] flex items-center">
      {/* Background ambient shapes */}
      <div className="absolute -right-10 -top-10 w-[280px] h-[280px] rounded-full bg-white/[0.06] pointer-events-none" />
      <div className="absolute left-[120px] bottom-[-60px] w-[240px] h-[240px] rounded-full bg-white/[0.05] pointer-events-none" />
      <div className="absolute right-[140px] top-[40px] w-[300px] h-[300px] rounded-full border border-white/15 hidden lg:block pointer-events-none" />

      {/* Top right pagination indicator badge */}
      <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-5 z-20 bg-black/35 backdrop-blur-md text-white/95 text-[9px] sm:text-[11.5px] font-bold px-2 sm:px-3.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFC93C]" />
        01 / 03
      </div>

      <div className="relative z-10 px-4 py-3.5 sm:px-9 sm:py-7 lg:px-12 lg:py-9 w-full max-w-[68%] sm:max-w-[62%] lg:max-w-[540px]">
        <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/15 rounded-full px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-white text-[9px] sm:text-[11.5px] font-bold tracking-wide">
          <span className="text-[#FFC93C]">✦</span> New season drop
        </span>
        <h1 className="font-[family-name:var(--font-display)] font-extrabold text-white text-[16.5px] sm:text-[28px] lg:text-[36px] xl:text-[40px] leading-[1.12] tracking-tight mt-1.5 sm:mt-3">
          Build your own <span className="text-[#FFC93C]">universe.</span>
        </h1>
        <p className="text-[#DCD3F5] text-[10px] sm:text-[13px] lg:text-[14.5px] mt-1.5 sm:mt-2.5 leading-tight sm:leading-snug line-clamp-2">
          Anime figures, cartoon collectibles, brick sets & coding kits — shipped in 48h.
        </p>
        <div className="flex items-center gap-2 sm:gap-3.5 mt-2.5 sm:mt-5">
          <button className="flex items-center gap-1.5 sm:gap-2 bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-bold text-[10px] sm:text-[13.5px] rounded-full h-7 sm:h-10 lg:h-11 px-3 sm:px-6 shadow-sm active:scale-95 transition-all">
            Shop now <IconArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button className="hidden sm:flex items-center border border-white/70 hover:border-white text-white font-semibold text-[13.5px] rounded-full h-10 lg:h-11 px-5 active:scale-95 transition-all">
            Explore sets
          </button>
        </div>
      </div>

      {/* Desktop slide arrows */}
      <div className="hidden lg:flex absolute right-7 bottom-5 items-center gap-2.5 z-10">
        <button
          aria-label="Previous slide"
          className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button
          aria-label="Next slide"
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#171136] hover:bg-white/90 transition-colors"
        >
          <IconArrowRightSlim className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Character illustration */}
      <div className="absolute right-1 sm:right-6 lg:right-10 bottom-0 w-[80px] sm:w-[155px] lg:w-[200px] xl:w-[220px] pointer-events-none">
        <Image
          src="/images/figure-samurai-red.svg"
          alt="Neo Samurai figure"
          width={220}
          height={300}
          className="w-full h-auto drop-shadow-lg"
          priority
        />
      </div>
      <div className="hidden lg:block absolute right-[23%] bottom-3 w-[85px] pointer-events-none opacity-90">
        <Image
          src="/images/bricks-stack-purple.svg"
          alt="Brick stack"
          width={85}
          height={105}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
