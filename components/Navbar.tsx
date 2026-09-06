import Image from "next/image";
import { IconChevronRight, IconSearch, IconHeart, IconBag, IconUser } from "./icons";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <div className="bg-white border-b border-[#EAE3F7]">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-[100px] py-3 sm:py-4 flex items-center gap-2 sm:gap-4 flex-wrap lg:flex-nowrap">
        <MobileMenu />
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <Image src="/images/logo-mark.svg" alt="Brickverse" width={40} height={40} />
          <span className="flex flex-col leading-tight">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-xl tracking-tight text-[#171136]">
              Brickverse
            </span>
            <span className="font-[family-name:var(--font-body)] text-[10.5px] font-medium text-[#736E9B]">
              figures · bricks · code kits
            </span>
          </span>
        </a>

        <div className="order-3 lg:order-none w-full lg:w-auto lg:flex-1 lg:mx-6 flex items-center bg-[#F6F1FF] border border-[#EAE3F7] rounded-full h-13 px-5 gap-2 min-w-0">
          <span className="hidden sm:flex items-center gap-1.5 text-[13px] font-semibold text-[#171136] shrink-0">
            All categories
            <IconChevronRight className="w-3.5 h-3.5 text-[#736E9B]" />
          </span>
          <span className="hidden sm:block w-px h-6 bg-[#EAE3F7] shrink-0" />
          <IconSearch className="w-4 h-4 text-[#736E9B] shrink-0" />
          <input
            placeholder="Search figures, brick sets, coding kits…"
            className="bg-transparent outline-none text-[13.5px] text-[#3B3468] placeholder:text-[#736E9B] flex-1 min-w-0"
          />
          <button
            aria-label="Search"
            className="w-11 h-11 rounded-full bg-[#FF4D6D] flex items-center justify-center shrink-0"
          >
            <IconSearch className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-5 shrink-0 ml-auto lg:ml-0">
          <button aria-label="Wishlist" className="relative flex items-center justify-center">
            <IconHeart className="w-5 h-5 text-[#171136]" />
            <span className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full bg-[#FFC93C] text-[9.5px] font-extrabold text-[#171136] flex items-center justify-center">
              3
            </span>
          </button>
          <button aria-label="Bag" className="relative flex items-center gap-2">
            <span className="relative flex items-center justify-center">
              <IconBag className="w-5 h-5 text-[#171136]" />
              <span className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full bg-[#FF4D6D] text-[9.5px] font-extrabold text-white flex items-center justify-center">
                2
              </span>
            </span>
            <span className="hidden md:inline text-[12.5px] font-semibold text-[#736E9B]">
              $142.50
            </span>
          </button>
          <button className="hidden sm:flex items-center gap-2 bg-[#171136] text-white rounded-full h-12 px-5">
            <IconUser className="w-4 h-4" />
            <span className="text-sm font-semibold">Sign in</span>
          </button>
        </div>
      </div>
    </div>
  );
}
