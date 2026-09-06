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
    <div className="grid sm:grid-cols-2 gap-6 mt-6">
      <div className="relative bg-grad-purple rounded-3xl overflow-hidden p-8 min-h-[220px]">
        <div className="absolute -right-6 -top-6 w-[200px] h-[200px] rounded-full bg-white/[0.08]" />
        <span className="inline-block bg-white/20 text-white text-[11.5px] font-bold rounded-full px-4 py-1.5">
          New arrivals
        </span>
        <h3 className="font-[family-name:var(--font-display)] font-extrabold text-white text-2xl sm:text-[26px] leading-tight mt-4">
          Anime figure <span className="text-[#FFC93C]">collection</span>
        </h3>
        <p className="text-[#E4DAFF] text-[12.5px] mt-3">
          1/7 scale · limited runs · from $24.99
        </p>
        <button className="flex items-center gap-2 bg-white text-[#5B22B8] font-bold text-[13.5px] rounded-full h-[42px] px-5 mt-5">
          Shop now <IconArrowRight className="w-3.5 h-3.5" />
        </button>
        <div className="hidden sm:block absolute right-4 bottom-0 w-[90px]">
          <Image
            src="/images/figure-newarrivals.svg"
            alt="New arrivals figure"
            width={90}
            height={160}
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="relative bg-grad-yellow rounded-3xl overflow-hidden p-8 min-h-[220px]">
        <div className="absolute -right-4 -bottom-10 w-[184px] h-[184px] rounded-full bg-white/25" />
        <span className="inline-block bg-[#171136] text-white text-[11.5px] font-bold rounded-full px-4 py-1.5">
          Deal of the week
        </span>
        <h3 className="font-[family-name:var(--font-display)] font-extrabold text-[#171136] text-2xl sm:text-[26px] leading-tight mt-4">
          Up to 40% off brick sets
        </h3>
        <div className="flex gap-2.5 mt-5">
          {timer.map((t) => (
            <div key={t.label} className="bg-white rounded-xl w-12 h-[46px] flex flex-col items-center justify-center">
              <span className="font-[family-name:var(--font-display)] font-extrabold text-[17px] text-[#171136] leading-none">
                {t.value}
              </span>
              <span className="text-[9px] font-semibold text-[#736E9B] mt-0.5">{t.label}</span>
            </div>
          ))}
        </div>
        <button className="flex items-center gap-2 bg-[#171136] text-white font-bold text-[13.5px] rounded-full h-[42px] px-5 mt-5">
          Grab deal <IconArrowRight className="w-3.5 h-3.5" />
        </button>
        <div className="hidden sm:block absolute right-6 bottom-0 w-[90px]">
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
