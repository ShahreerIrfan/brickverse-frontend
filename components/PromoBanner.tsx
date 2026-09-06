import Image from "next/image";

export default function PromoBanner() {
  return (
    <div className="relative bg-grad-promo rounded-[26px] overflow-hidden px-6 sm:px-12 py-10 sm:py-14 flex flex-col lg:flex-row items-center gap-8">
      <div className="absolute right-[10%] top-10 w-[260px] h-[260px] rounded-full bg-white/[0.06]" />
      <div className="absolute right-[24%] bottom-[-40px] w-[180px] h-[180px] rounded-full bg-white/5" />

      <div className="relative z-10 max-w-xl">
        <span className="inline-block bg-[#FF4D6D] text-white text-xs font-bold rounded-full px-4 py-1.5">
          Weekend bundle
        </span>
        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-white text-[26px] sm:text-[30px] leading-tight mt-5 tracking-tight">
          Buy any two brick sets, get a mini figure free
        </h2>
        <p className="text-[#CFC6EE] text-sm mt-4">
          Mix and match across bricks, robotics and STEM kits. Ends Sunday 11:59pm.
        </p>
        <button className="bg-[#FFC93C] text-[#171136] font-bold text-sm rounded-full h-[46px] px-8 mt-6">
          Shop bundle
        </button>
      </div>

      <div className="relative z-10 flex items-end gap-6 ml-auto shrink-0">
        <Image src="/images/bricks-stack-sunny.svg" alt="Brick stack" width={110} height={130} className="w-[80px] sm:w-[110px] h-auto" />
        <Image src="/images/toon-mascot.svg" alt="Cartoon mascot" width={110} height={150} className="hidden sm:block w-[90px] h-auto" />
      </div>
    </div>
  );
}
