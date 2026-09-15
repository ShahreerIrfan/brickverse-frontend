import Image from "next/image";
import { IconArrowRight } from "./icons";

const timer = [
  { value: "02", label: "days" },
  { value: "14", label: "hrs" },
  { value: "36", label: "min" },
  { value: "09", label: "sec" },
];

export default function PromoColumns() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
      {/* Anime Figure Collection Card */}
      <div className="relative bg-grad-purple rounded-xl sm:rounded-2xl overflow-hidden p-2.5 sm:p-5 lg:p-7 h-[125px] sm:h-[160px] lg:h-[220px] flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-[140px] h-[140px] lg:w-[180px] lg:h-[180px] rounded-full bg-white/[0.08] pointer-events-none" />
        <div className="relative z-10 pr-10 sm:pr-20 lg:pr-24">
          <span className="inline-block bg-white/20 text-white text-[8px] sm:text-[10.5px] lg:text-[12.5px] font-bold rounded-full px-2 sm:px-3 lg:px-3.5 py-0.5 lg:py-1">
            New arrivals
          </span>
          <h3 className="font-[family-name:var(--font-display)] font-extrabold text-white text-[11.5px] sm:text-[18px] lg:text-[25px] leading-tight mt-1 sm:mt-2 lg:mt-3">
            Anime figure <span className="text-[#FFC93C]">collection</span>
          </h3>
          <p className="text-[#E4DAFF] text-[8px] sm:text-[11.5px] lg:text-[13.5px] mt-0.5 sm:mt-1 lg:mt-1.5 leading-tight line-clamp-1">
            Limited runs · From ৳2,499
          </p>
        </div>

        <div className="relative z-10 mt-1.5 sm:mt-3 lg:mt-4">
          <button className="inline-flex items-center gap-1 sm:gap-1.5 bg-white hover:bg-white/95 text-[#5B22B8] font-bold text-[8.5px] sm:text-[12px] lg:text-[14px] rounded-full h-5.5 sm:h-7.5 lg:h-9 px-2.5 sm:px-4 lg:px-5 shadow-sm active:scale-95 transition-all">
            Shop now <IconArrowRight className="w-2 h-2 sm:w-3 sm:h-3" />
          </button>
        </div>

        <div className="absolute right-0.5 sm:right-2 lg:right-3 bottom-0 w-[48px] sm:w-[75px] lg:w-[112px] pointer-events-none">
          <Image
            src="/images/figure-newarrivals.svg"
            alt="New arrivals figure"
            width={112}
            height={200}
            className="w-full h-auto drop-shadow-sm"
          />
        </div>
      </div>

      {/* Deal of the Week Card */}
      <div className="relative bg-grad-yellow rounded-xl sm:rounded-2xl overflow-hidden p-2.5 sm:p-5 lg:p-7 h-[125px] sm:h-[160px] lg:h-[220px] flex flex-col justify-between">
        <div className="absolute -right-4 -bottom-10 w-[140px] h-[140px] lg:w-[180px] lg:h-[180px] rounded-full bg-white/25 pointer-events-none" />
        <div className="relative z-10 pr-10 sm:pr-20 lg:pr-24">
          <span className="inline-block bg-[#171136] text-white text-[8px] sm:text-[10.5px] lg:text-[12.5px] font-bold rounded-full px-2 sm:px-3 lg:px-3.5 py-0.5 lg:py-1">
            Deal of the week
          </span>
          <h3 className="font-[family-name:var(--font-display)] font-extrabold text-[#171136] text-[11.5px] sm:text-[18px] lg:text-[25px] leading-tight mt-1 sm:mt-2 lg:mt-3">
            Up to 40% off brick sets
          </h3>
          {/* Compact Timer */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 mt-1 sm:mt-2 lg:mt-3">
            {timer.map((t) => (
              <div
                key={t.label}
                className="bg-white/90 rounded sm:rounded-md lg:rounded-lg px-1 py-0.5 sm:px-1.5 sm:py-0.5 lg:px-2 lg:py-1 flex flex-col items-center justify-center min-w-[18px] sm:min-w-[28px] lg:min-w-[38px]"
              >
                <span className="font-[family-name:var(--font-display)] font-extrabold text-[8px] sm:text-[11px] lg:text-[14px] text-[#171136] leading-none">
                  {t.value}
                </span>
                <span className="text-[5px] sm:text-[7.5px] lg:text-[9px] font-semibold text-[#736E9B] leading-none mt-0.5">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-1.5 sm:mt-3 lg:mt-4">
          <button className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#171136] hover:bg-[#251c4a] text-white font-bold text-[8.5px] sm:text-[12px] lg:text-[14px] rounded-full h-5 sm:h-7 lg:h-9 px-2 sm:px-3.5 lg:px-4.5 shadow-sm active:scale-95 transition-all">
            Grab deal <IconArrowRight className="w-2 h-2 sm:w-3 sm:h-3" />
          </button>
        </div>

        <div className="absolute right-0.5 sm:right-3 lg:right-4 bottom-0 w-[40px] sm:w-[65px] lg:w-[96px] pointer-events-none">
          <Image
            src="/images/bricks-stack-navy.svg"
            alt="Brick stack"
            width={96}
            height={118}
            className="w-full h-auto drop-shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
