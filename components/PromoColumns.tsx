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
    <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-2 sm:mt-3">
      {/* Anime Figure Collection Card */}
      <div className="relative bg-grad-purple rounded-xl sm:rounded-2xl overflow-hidden p-2.5 sm:p-5 lg:p-6 min-h-[105px] sm:min-h-[145px] lg:min-h-[160px] flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-[140px] h-[140px] rounded-full bg-white/[0.08] pointer-events-none" />
        <div className="relative z-10 pr-10 sm:pr-20">
          <span className="inline-block bg-white/20 text-white text-[8px] sm:text-[10.5px] font-bold rounded-full px-2 sm:px-3 py-0.5">
            New arrivals
          </span>
          <h3 className="font-[family-name:var(--font-display)] font-extrabold text-white text-[11.5px] sm:text-[18px] lg:text-[21px] leading-tight mt-1 sm:mt-2">
            Anime figure <span className="text-[#FFC93C]">collection</span>
          </h3>
          <p className="text-[#E4DAFF] text-[8px] sm:text-[11.5px] mt-0.5 sm:mt-1 leading-tight line-clamp-1">
            Limited runs · From $24.99
          </p>
        </div>

        <div className="relative z-10 mt-1.5 sm:mt-3">
          <button className="inline-flex items-center gap-1 sm:gap-1.5 bg-white hover:bg-white/95 text-[#5B22B8] font-bold text-[8.5px] sm:text-[12px] rounded-full h-5 sm:h-7 px-2 sm:px-3.5 shadow-sm active:scale-95 transition-all">
            Shop now <IconArrowRight className="w-2 h-2 sm:w-3 sm:h-3" />
          </button>
        </div>

        <div className="absolute right-0.5 sm:right-2 bottom-0 w-[44px] sm:w-[70px] lg:w-[84px] pointer-events-none">
          <Image
            src="/images/figure-newarrivals.svg"
            alt="New arrivals figure"
            width={84}
            height={150}
            className="w-full h-auto drop-shadow-sm"
          />
        </div>
      </div>

      {/* Deal of the Week Card */}
      <div className="relative bg-grad-yellow rounded-xl sm:rounded-2xl overflow-hidden p-2.5 sm:p-5 lg:p-6 min-h-[105px] sm:min-h-[145px] lg:min-h-[160px] flex flex-col justify-between">
        <div className="absolute -right-4 -bottom-10 w-[140px] h-[140px] rounded-full bg-white/25 pointer-events-none" />
        <div className="relative z-10 pr-10 sm:pr-20">
          <span className="inline-block bg-[#171136] text-white text-[8px] sm:text-[10.5px] font-bold rounded-full px-2 sm:px-3 py-0.5">
            Deal of the week
          </span>
          <h3 className="font-[family-name:var(--font-display)] font-extrabold text-[#171136] text-[11.5px] sm:text-[18px] lg:text-[21px] leading-tight mt-1 sm:mt-2">
            Up to 40% off brick sets
          </h3>
          {/* Compact Timer */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-2">
            {timer.map((t) => (
              <div
                key={t.label}
                className="bg-white/90 rounded sm:rounded-md px-1 py-0.5 sm:px-1.5 sm:py-0.5 flex flex-col items-center justify-center min-w-[18px] sm:min-w-[28px]"
              >
                <span className="font-[family-name:var(--font-display)] font-extrabold text-[8px] sm:text-[11px] text-[#171136] leading-none">
                  {t.value}
                </span>
                <span className="text-[5px] sm:text-[7.5px] font-semibold text-[#736E9B] leading-none mt-0.5">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-1.5 sm:mt-3">
          <button className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#171136] hover:bg-[#251c4a] text-white font-bold text-[8.5px] sm:text-[12px] rounded-full h-5 sm:h-7 px-2 sm:px-3.5 shadow-sm active:scale-95 transition-all">
            Grab deal <IconArrowRight className="w-2 h-2 sm:w-3 sm:h-3" />
          </button>
        </div>

        <div className="absolute right-0.5 sm:right-3 bottom-0 w-[40px] sm:w-[65px] lg:w-[78px] pointer-events-none">
          <Image
            src="/images/bricks-stack-navy.svg"
            alt="Brick stack"
            width={78}
            height={95}
            className="w-full h-auto drop-shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
