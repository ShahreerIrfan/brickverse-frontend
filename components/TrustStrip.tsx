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
    <div className="bg-white border border-[#EAE3F7] rounded-[20px] px-6 sm:px-10 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item.title} className="flex items-center gap-4 sm:border-l first:border-l-0 border-[#EAE3F7] sm:pl-6 first:pl-0">
          <span
            className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${item.color}24` }}
          >
            <item.icon className="w-5 h-5" style={{ color: item.color }} />
          </span>
          <div>
            <p className="text-[13.5px] font-bold text-[#171136]">{item.title}</p>
            <p className="text-[11.5px] text-[#736E9B] mt-0.5">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
