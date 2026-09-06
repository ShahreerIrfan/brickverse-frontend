import { IconHome, IconBag, IconStore, IconUser } from "./icons";

const tabs = [
  { label: "Home", icon: IconHome, active: true },
  { label: "Cart", icon: IconBag, badge: 2 },
  { label: "Shop", icon: IconStore },
  { label: "Account", icon: IconUser },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#EAE3F7] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => (
          <a
            key={tab.label}
            href="#"
            className={`relative flex flex-col items-center justify-center gap-1 py-2.5 ${
              tab.active ? "text-[#FF4D6D]" : "text-[#736E9B]"
            }`}
          >
            <span className="relative">
              <tab.icon className="w-[22px] h-[22px]" />
              {tab.badge && (
                <span className="absolute -top-1.5 -right-2 w-[15px] h-[15px] rounded-full bg-[#FF4D6D] text-white text-[8.5px] font-extrabold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </span>
            <span className={`text-[10.5px] ${tab.active ? "font-bold" : "font-medium"}`}>
              {tab.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
