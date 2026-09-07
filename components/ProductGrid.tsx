import { IconArrowRight } from "./icons";
import ProductCard from "./ProductCard";
import type { ProductSection } from "./productData";

export default function ProductGrid({ section }: { section: ProductSection }) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
        <div className="border-l-4 pl-3 sm:pl-4" style={{ borderColor: section.accent }}>
          <p
            className="text-[10px] sm:text-[11.5px] font-bold tracking-wide"
            style={{ color: section.eyebrowColor }}
          >
            {section.eyebrow.toUpperCase()}
          </p>
          <div className="flex items-baseline gap-2 sm:gap-3 mt-1 flex-wrap">
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-[27px] text-[#171136] tracking-tight">
              {section.title}
            </h2>
            <span className="text-[11px] sm:text-[13px] font-medium text-[#736E9B]">{section.itemCount}</span>
          </div>
        </div>
        <button
          className="flex items-center gap-1.5 sm:gap-2 rounded-full border h-9 sm:h-[46px] px-4 sm:px-6 text-[12px] sm:text-sm font-bold"
          style={{ borderColor: section.accent, color: section.accent }}
        >
          View all <IconArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
        {section.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
