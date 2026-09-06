import { IconArrowRight } from "./icons";
import ProductCard from "./ProductCard";
import type { ProductSection } from "./productData";

export default function ProductGrid({ section }: { section: ProductSection }) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="border-l-4 pl-4" style={{ borderColor: section.accent }}>
          <p
            className="text-[11.5px] font-bold tracking-wide"
            style={{ color: section.eyebrowColor }}
          >
            {section.eyebrow.toUpperCase()}
          </p>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[27px] text-[#171136] tracking-tight">
              {section.title}
            </h2>
            <span className="text-[13px] font-medium text-[#736E9B]">{section.itemCount}</span>
          </div>
        </div>
        <button
          className="flex items-center gap-2 rounded-full border h-[46px] px-6 text-sm font-bold"
          style={{ borderColor: section.accent, color: section.accent }}
        >
          View all <IconArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {section.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
