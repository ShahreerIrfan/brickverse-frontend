import { IconMail } from "./icons";

export default function Newsletter() {
  return (
    <div className="relative bg-grad-news rounded-[26px] overflow-hidden px-6 sm:px-12 py-12 sm:py-16 text-center">
      <div className="absolute left-[10%] top-8 w-[220px] h-[220px] rounded-full bg-white/10" />
      <div className="absolute right-[6%] bottom-[-40px] w-[240px] h-[240px] rounded-full bg-white/10" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-white text-2xl sm:text-[30px] tracking-tight">
          Get restock alerts before anyone else
        </h2>
        <p className="text-[#FFE9E2] text-sm mt-3">
          Drop days, limited runs and subscriber-only bundles. One email a week.
        </p>

        <form className="flex flex-col sm:flex-row gap-3 justify-center mt-8 max-w-lg mx-auto">
          <div className="flex items-center gap-2.5 bg-white rounded-full h-14 px-6 flex-1">
            <IconMail className="w-4 h-4 text-[#736E9B] shrink-0" />
            <input
              type="email"
              placeholder="you@email.com"
              className="outline-none text-sm text-[#171136] placeholder:text-[#736E9B] w-full bg-transparent"
            />
          </div>
          <button className="bg-[#171136] text-white font-bold text-[15px] rounded-full h-14 px-8 shrink-0">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
