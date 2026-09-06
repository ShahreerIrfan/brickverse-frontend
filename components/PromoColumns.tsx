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
    <div className="grid grid-cols-2 gap-2.5 sm:gap-6 mt-3 sm:mt-6">
      <div className="relative bg-grad-purple rounded-2xl sm:rounded-3xl overflow-hidden p-3 sm:p-8">
        <div className="absolute -right-6 -top-6 w-[200px] h-[200px] rounded-full bg-white/[0.08]" />
        <div className="relative z-10 pr-12 sm:pr-0">
          <span className="inline-block bg-white/20 text-white text-[8.5px] sm:text-[11.5px] font-bold rounded-full px-2 sm:px-4 py-0.5 sm:py-1.5">
            New arrivals
          </span>
          <h3 className="font-[family-name:var(--font-display)] font-extrabold text-white text-[13px] sm:text-2xl lg:text-[26px] leading-snug mt-1.5 sm:mt-4">
            Anime figure <span className="text-[#FFC93C]">collection</span>
          </h3>
          <p className="text-[#E4DAFF] text-[9px] sm:text-[12.5px] mt-1 sm:mt-3 leading-snug">
            1/7 scale · limited runs · from $24.99
          </p>
          <button className="flex items-center gap-1 sm:gap-2 bg-white text-[#5B22B8] font-bold text-[9.5px] sm:text-[13.5px] rounded-full h-6 sm:h-[42px] px-2.5 sm:px-5 mt-2 sm:mt-5">
            Shop now <IconArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
        <div className="absolute right-0 sm:right-4 bottom-0 w-[52px] sm:w-[90px]">
          <Image
            src="/images/figure-newarrivals.svg"
            alt="New arrivals figure"
            width={90}
            height={160}
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="relative bg-grad-yellow rounded-2xl sm:rounded-3xl overflow-hidden p-3 sm:p-8">
        <div className="absolute -right-4 -bottom-10 w-[184px] h-[184px] rounded-full bg-white/25" />
        <div className="relative z-10 pr-11 sm:pr-0">
          <span className="inline-block bg-[#171136] text-white text-[8.5px] sm:text-[11.5px] font-bold rounded-full px-2 sm:px-4 py-0.5 sm:py-1.5">
            Deal of the week
          </span>
          <h3 className="font-[family-name:var(--font-display)] font-extrabold text-[#171136] text-[13px] sm:text-2xl lg:text-[26px] leading-snug mt-1.5 sm:mt-4">
            Up to 40% off brick sets
          </h3>
          <div className="flex gap-1 sm:gap-2.5 mt-1.5 sm:mt-5">
            {timer.map((t) => (
              <div key={t.label} className="bg-white rounded-md sm:rounded-xl w-6 sm:w-12 h-7 sm:h-[46px] flex flex-col items-center justify-center">
                <span className="font-[family-name:var(--font-display)] font-extrabold text-[9.5px] sm:text-[17px] text-[#171136] leading-none">
                  {t.value}
                </span>
                <span className="text-[5.5px] sm:text-[9px] font-semibold text-[#736E9B] mt-0.5">{t.label}</span>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-1 sm:gap-2 bg-[#171136] text-white font-bold text-[9.5px] sm:text-[13.5px] rounded-full h-6 sm:h-[42px] px-2.5 sm:px-5 mt-2 sm:mt-5">
            Grab deal <IconArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
        <div className="absolute right-0 sm:right-6 bottom-0 w-[46px] sm:w-[90px]">
          <Image
            src="/images/bricks-stack-navy.svg"
            alt="Brick stack"
            width={90}
            height={110}
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
