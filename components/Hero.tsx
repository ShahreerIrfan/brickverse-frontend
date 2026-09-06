import Image from "next/image";
import { IconArrowRight, IconArrowLeft, IconArrowRightSlim } from "./icons";

export default function Hero() {
  return (
    <div className="relative flex-1 bg-grad-hero rounded-[26px] overflow-hidden min-h-[360px] lg:min-h-[420px]">
      <div className="absolute -right-10 -top-10 w-[300px] h-[300px] rounded-full bg-white/[0.06]" />
      <div className="absolute left-[120px] bottom-[-60px] w-[240px] h-[240px] rounded-full bg-white/[0.05]" />
      <div className="absolute right-[140px] top-[70px] w-[336px] h-[336px] rounded-full border border-white/20 hidden lg:block" />

      <div className="relative z-10 px-6 sm:px-10 lg:px-12 pt-10 pb-8 max-w-[440px]">
        <span className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-white text-[12.5px] font-bold tracking-wide">
          <span className="text-[#FFC93C]">✦</span> New season drop
        </span>
        <h1 className="font-[family-name:var(--font-display)] font-extrabold text-white text-[36px] sm:text-[44px] leading-[1.05] tracking-tight mt-6">
          Build your own <span className="text-[#FFC93C]">universe.</span>
        </h1>
        <p className="text-[#DCD3F5] text-[14.5px] mt-5 leading-relaxed">
          Anime figures, cartoon collectibles, brick sets and coding kits —
          shipped from Melbourne in 48 hours.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <button className="flex items-center gap-2 bg-[#FF4D6D] text-white font-bold text-[15.5px] rounded-full h-[54px] px-8">
            Shop now <IconArrowRight className="w-4 h-4" />
          </button>
          <button className="border border-white text-white font-semibold text-[15.5px] rounded-full h-[54px] px-8">
            Explore sets
          </button>
        </div>
        <div className="flex items-center gap-3 mt-10">
          <span className="w-[30px] h-2 rounded-full bg-[#FFC93C]" />
          <span className="w-2 h-2 rounded-full bg-white/45" />
          <span className="w-2 h-2 rounded-full bg-white/45" />
          <span className="text-white/70 text-[11.5px] font-semibold ml-2">01 / 03</span>
        </div>
      </div>

      <div className="hidden lg:flex absolute right-10 bottom-8 items-center gap-3">
        <button
          aria-label="Previous slide"
          className="w-[42px] h-[42px] rounded-full border border-white/55 flex items-center justify-center text-white"
        >
          <IconArrowLeft className="w-4 h-4" />
        </button>
        <button
          aria-label="Next slide"
          className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center text-[#171136]"
        >
          <IconArrowRightSlim className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute right-6 sm:right-16 top-6 w-[110px] h-[110px] sm:w-[150px] sm:h-[150px]">
        <Image src="/images/badge-starburst.svg" alt="" width={150} height={150} className="w-full h-full -rotate-6" />
        <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-6 text-[#171136]">
          <span className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-xl">40%</span>
          <span className="font-[family-name:var(--font-display)] font-extrabold text-[7px] sm:text-[9.5px]">
            OFF TODAY
          </span>
        </div>
      </div>

      <div className="hidden md:block absolute right-[8%] bottom-0 w-[150px] lg:w-[190px]">
        <Image
          src="/images/figure-samurai-red.svg"
          alt="Neo Samurai figure"
          width={190}
          height={260}
          className="w-full h-auto"
        />
      </div>
      <div className="hidden lg:block absolute right-[26%] bottom-6 w-[90px]">
        <Image
          src="/images/bricks-stack-purple.svg"
          alt="Brick stack"
          width={90}
          height={110}
          className="w-full h-auto"
        />
      </div>
      <div className="hidden lg:block absolute left-[38%] bottom-6 w-[100px]">
        <Image
          src="/images/robot-teal.svg"
          alt="Robot mascot"
          width={100}
          height={130}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
