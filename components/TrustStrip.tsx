import { IconTruck, IconReturn, IconShield, IconCard } from "./icons";

const items = [
  {
    icon: IconTruck,
    color: "#FF4D6D",
    title: "Free delivery over $60",
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
    <div className="bg-white border border-[#EAE3F7] rounded-[20px] px-3 sm:px-10 py-4 sm:py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item, i) => (
        <div
          key={item.title}
          className={`flex items-center gap-2.5 sm:gap-4 border-[#EAE3F7] pl-0 ${
            i % 2 === 1 ? "border-l pl-2.5" : ""
          } lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0`}
        >
          <span
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-[14px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${item.color}24` }}
          >
            <item.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: item.color }} />
          </span>
          <div>
            <p className="text-[11.5px] sm:text-[13.5px] font-bold text-[#171136] leading-snug">{item.title}</p>
            <p className="text-[10px] sm:text-[11.5px] text-[#736E9B] mt-0.5 leading-snug">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
