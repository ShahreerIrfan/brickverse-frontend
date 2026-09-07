import { IconPhone, IconTruck } from "./icons";

const links = [
  { label: "Home", active: true },
  { label: "Shop all" },
  { label: "Anime figures" },
  { label: "Cartoon toys" },
  { label: "Bricks & sets" },
  { label: "Deals", hot: true },
  { label: "Blog" },
];

export default function NavLinks() {
  return (
    <div className="bg-white border-b border-[#EAE3F7] hidden lg:block">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-9">
          {links.map((link) => (
            <a
              key={link.label}
              href="#"
              className={`relative text-sm ${
                link.active
                  ? "font-bold text-[#FF4D6D]"
                  : "font-medium text-[#3B3468] hover:text-[#FF4D6D]"
              }`}
            >
              {link.label}
              {link.hot && (
                <span className="absolute -top-3.5 -right-6 -rotate-6 bg-[#FF4D6D] text-white text-[9px] font-extrabold rounded-full px-1.5 py-0.5">
                  HOT
                </span>
              )}
              {link.active && (
                <span className="absolute -bottom-4 left-0 right-0 h-1 rounded-full bg-[#FF4D6D]" />
              )}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <IconPhone className="w-4 h-4 text-[#FF4D6D]" />
            <span className="text-[13px] font-semibold text-[#3B3468]">1800 246 010</span>
          </div>
          <span className="w-px h-6 bg-[#EAE3F7]" />
          <div className="flex items-center gap-2 text-[#736E9B]">
            <IconTruck className="w-4 h-4" />
            <span className="text-[13px] font-medium">Track order</span>
          </div>
        </div>
      </div>
    </div>
  );
}
