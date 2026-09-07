import { IconTruck, IconReturn, IconShield, IconCard } from "./icons";

const items = [
  {
    icon: IconTruck,
    color: "#FF4D6D",
    title: "Free delivery over ৳500",
    subtitle: "Australia-wide, 2–4 days",
  },
  {
    icon: IconReturn,
    color: "#13BFC9",
    title: "7-day easy returns",
    subtitle: "Unopened boxes, no fuss",
  },
  {
    icon: IconShield,
    color: "#7B5CFF",
    title: "100% authentic stock",
    subtitle: "Licensed importers only",
  },
  {
    icon: IconCard,
    color: "#FFC93C",
    title: "Secure checkout",
    subtitle: "Card, PayPal, Afterpay",
  },
];

export default function TrustStrip() {
  return (
    <div className="bg-white border border-[#EAE3F7] rounded-xl sm:rounded-[20px] px-3 sm:px-6 py-2.5 sm:py-4 grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-2 sm:gap-4 lg:gap-6 shadow-[0_2px_10px_rgba(23,17,54,0.03)]">
      {items.map((item, i) => (
        <div
          key={item.title}
          className={`flex items-center gap-2 sm:gap-3 border-[#EAE3F7] pl-0 ${
            i % 2 === 1 ? "border-l pl-2 sm:pl-3" : ""
          } lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0`}
        >
          <span
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-[12px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${item.color}20` }}
          >
            <item.icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" style={{ color: item.color }} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[12.5px] font-bold text-[#171136] leading-tight truncate">{item.title}</p>
            <p className="text-[8.5px] sm:text-[11px] text-[#736E9B] mt-0.5 leading-tight truncate">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
