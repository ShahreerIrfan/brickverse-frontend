import Link from "next/link";
import { IconPhone, IconFacebook, IconInstagram } from "./icons";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop all", href: "/shop" },
  { label: "Deals", href: "/shop?deals=true", hot: true },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function NavLinks() {
  return (
    <div className="bg-white border-b border-[#EAE3F7] hidden lg:block">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-9">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              prefetch={true}
              className="relative text-sm font-medium text-[#3B3468] hover:text-[#FF4D6D] transition-colors"
            >
              {link.label}
              {link.hot && (
                <span className="absolute -top-3.5 -right-6 -rotate-6 bg-[#FF4D6D] text-white text-[9px] font-extrabold rounded-full px-1.5 py-0.5">
                  HOT
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <a
              href="https://www.facebook.com/profile.php?id=61575469209698"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kawaii Subete Facebook"
              className="w-8 h-8 rounded-full bg-[#FAF8FF] border border-[#EAE3F7] hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white flex items-center justify-center text-[#171136] transition-all"
            >
              <IconFacebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.instagram.com/kawaii.subete/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kawaii Subete Instagram"
              className="w-8 h-8 rounded-full bg-[#FAF8FF] border border-[#EAE3F7] hover:bg-gradient-to-tr hover:from-[#FD1D1D] hover:to-[#833AB4] hover:border-transparent hover:text-white flex items-center justify-center text-[#171136] transition-all"
            >
              <IconInstagram className="w-3.5 h-3.5" />
            </a>
          </div>

          <span className="w-px h-4 bg-[#EAE3F7]" />

          <a href="tel:01402494401" className="flex items-center gap-2 hover:text-[#FF4D6D] transition-colors">
            <IconPhone className="w-4 h-4 text-[#FF4D6D]" />
            <span className="text-[13px] font-semibold text-[#3B3468] hover:text-[#FF4D6D] transition-colors">01402494401</span>
          </a>
        </div>
      </div>
    </div>
  );
}
