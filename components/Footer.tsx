import Image from "next/image";
import { IconPin, IconPhone, IconMail } from "./icons";

const columns = [
  {
    title: "Shop",
    links: ["Anime figures", "Cartoon toys", "Brick sets", "Coding kits", "New arrivals"],
  },
  {
    title: "Support",
    links: ["Help centre", "Delivery info", "Returns policy", "Track my order", "FAQ"],
  },
  {
    title: "Company",
    links: ["About us", "Careers", "Blog", "Affiliates", "Contact"],
  },
];

const social = ["f", "in", "ig", "yt"];

export default function Footer() {
  return (
    <footer className="bg-[#171136]">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr_1fr_220px] gap-6 sm:gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/images/logo-mark.svg" alt="Brickverse" width={40} height={40} />
            <span className="flex flex-col leading-tight">
              <span className="font-[family-name:var(--font-display)] font-extrabold text-xl tracking-tight text-white">
                Brickverse
              </span>
              <span className="text-[10.5px] font-medium text-[#B9B2DA]">
                figures · bricks · code kits
              </span>
            </span>
          </div>
          <p className="text-[13px] text-[#B9B2DA] leading-relaxed mt-6">
            Authentic anime figures, cartoon collectibles, brick sets and coding
            kits. Shipping Australia-wide from our Melbourne warehouse since
            2019.
          </p>
          <div className="flex items-center gap-3 mt-7">
            {social.map((s) => (
              <a
                key={s}
                href="#"
                aria-label={s}
                className="w-9 h-9 rounded-full bg-[#2A2159] flex items-center justify-center text-white text-[11.5px] font-bold"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-[family-name:var(--font-display)] font-bold text-white text-[15px]">
              {col.title}
            </h4>
            <span className="block w-[26px] h-[3px] rounded-full bg-[#FF4D6D] mt-2 mb-5" />
            <ul className="flex flex-col gap-3.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] text-[#B9B2DA] hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-[family-name:var(--font-display)] font-bold text-white text-[15px]">
            Visit us
          </h4>
          <span className="block w-[26px] h-[3px] rounded-full bg-[#FF4D6D] mt-2 mb-5" />
          <div className="flex flex-col gap-4 text-[13px] text-[#B9B2DA]">
            <div className="flex items-start gap-2.5">
              <IconPin className="w-4 h-4 text-[#FF4D6D] mt-0.5 shrink-0" />
              <span>
                14 Maribyrnong St,
                <br />
                Footscray VIC 3011
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <IconPhone className="w-4 h-4 text-[#FF4D6D] shrink-0" />
              <span>1800 246 010</span>
            </div>
            <div className="flex items-center gap-2.5">
              <IconMail className="w-4 h-4 text-[#FF4D6D] shrink-0" />
              <span>hi@brickverse.com.au</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2A2159]">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12.5px] text-[#8880B5]">
            © 2026 Brickverse Pty Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[12.5px] text-[#8880B5]">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
