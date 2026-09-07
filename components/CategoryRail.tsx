import { IconChevronRight, IconGrid, IconArrowRight } from "./icons";
import { categories as defaultCategories, Category } from "./productData";

export function CategoryGlyph({ id, color }: { id: string; color: string }) {
  const common = { fill: color };
  switch (id) {
    case "figure":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <circle cx="16" cy="10" r="4.6" {...common} />
          <rect x="11" y="15" width="10" height="11" rx="4" {...common} />
        </svg>
      );
    case "toon":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <circle cx="10" cy="10" r="3.6" {...common} />
          <circle cx="22" cy="10" r="3.6" {...common} />
          <circle cx="16" cy="18" r="7.5" {...common} />
        </svg>
      );
    case "brick":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <rect x="7" y="14" width="18" height="10" rx="3" {...common} />
          <rect x="10" y="10" width="5" height="4" rx="2" {...common} />
          <rect x="17" y="10" width="5" height="4" rx="2" {...common} />
        </svg>
      );
    case "code":
      return (
        <span className="text-[11px] font-extrabold" style={{ color }}>
          {"</>"}
        </span>
      );
    case "robot":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <rect x="8" y="12" width="16" height="13" rx="4" {...common} />
          <circle cx="16" cy="7" r="2.4" {...common} />
          <line x1="16" y1="9" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "model":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <path d="M16 6l6 13H10z" {...common} />
          <rect x="12" y="20" width="8" height="5" rx="2" {...common} />
        </svg>
      );
    case "plush":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <circle cx="16" cy="17" r="7.5" {...common} />
          <circle cx="9" cy="8" r="3.4" {...common} />
          <circle cx="23" cy="8" r="3.4" {...common} />
        </svg>
      );
    case "statue":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <circle cx="16" cy="9" r="4" {...common} />
          <path d="M11 14h10l3 10H8z" {...common} />
        </svg>
      );
    case "puzzle":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <rect x="7" y="9" width="18" height="14" rx="3" {...common} />
          <circle cx="16" cy="9" r="3.4" fill="#FFF6EE" />
          <circle cx="25" cy="16" r="3.4" fill="#FFF6EE" />
        </svg>
      );
    case "game":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <rect x="7" y="9" width="18" height="14" rx="4" {...common} />
          <circle cx="12" cy="14" r="2" fill="#FFF6EE" />
          <circle cx="20" cy="18" r="2" fill="#FFF6EE" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <circle cx="16" cy="16" r="7.5" fill="none" stroke={color} strokeWidth="3" />
          <circle cx="16" cy="16" r="2.4" {...common} />
        </svg>
      );
  }
}

export default function CategoryRail({ initialCategories }: { initialCategories?: Category[] }) {
  const displayCategories = initialCategories && initialCategories.length > 0 ? initialCategories : defaultCategories;

  return (
    <aside className="hidden lg:block w-[280px] bg-white border border-[#EAE3F7] rounded-[22px] shadow-[0_16px_0_-4px_rgba(23,17,54,0.06)] overflow-hidden shrink-0">
      <div className="bg-grad-menuhead px-6 py-4 flex items-center gap-3">
        <IconGrid className="w-5 h-5 text-white" />
        <h3 className="font-[family-name:var(--font-display)] font-bold text-white text-[14.5px]">
          Browse categories
        </h3>
      </div>
      <ul className="p-2.5">
        {displayCategories.length === 0 ? (
          <li className="py-8 px-4 text-center text-xs text-[#736E9B]">
            Categories will appear here once products are created.
          </li>
        ) : (
          displayCategories.map((cat) => (
            <li key={cat.id}>
              <a
                href="#"
                className={`group flex items-center gap-3 rounded-[14px] px-3 py-2.5 relative ${
                  cat.featured ? "bg-[#FFF1F4]" : "hover:bg-[#FAF7FF]"
                }`}
              >
                {cat.featured && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-[#FF4D6D]" />
                )}
                <span
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cat.color}24` }}
                >
                  <CategoryGlyph id={cat.id} color={cat.color} />
                </span>
                <span
                  className={`text-[13.5px] flex-1 ${
                    cat.featured ? "font-bold text-[#171136]" : "font-medium text-[#3B3468]"
                  }`}
                >
                  {cat.label}
                </span>
                <IconChevronRight className="w-3.5 h-3.5 text-[#736E9B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          ))
        )}
      </ul>
      {displayCategories.length > 0 && (
        <div className="border-t border-[#EAE3F7] px-6 py-4">
          <a href="#" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#FF4D6D]">
            See all categories
            <IconArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </aside>
  );
}
