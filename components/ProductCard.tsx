import Image from "next/image";
import { IconHeart, IconBag, IconStar } from "./icons";
import type { Product } from "./productData";

export default function ProductCard({ product }: { product: Product }) {
  const fullStars = Math.round(product.rating);

  return (
    <div className="relative bg-white border border-[#EAE3F7] rounded-2xl sm:rounded-3xl shadow-[0_16px_0_-6px_rgba(23,17,54,0.09)] overflow-hidden flex flex-col">
      <div
        className="relative h-[130px] sm:h-[220px] flex items-center justify-center"
        style={{ backgroundColor: product.cardBg }}
      >
        {product.badge && (
          <span
            className="absolute left-2.5 sm:left-5 top-2.5 sm:top-4 -rotate-6 text-white text-[9px] sm:text-[11px] font-extrabold tracking-wide rounded-full px-2 sm:px-3 py-1 sm:py-1.5"
            style={{ backgroundColor: product.badgeColor }}
          >
            {product.badge}
          </span>
        )}
        <button
          aria-label="Add to wishlist"
          className="absolute right-2.5 sm:right-5 top-2.5 sm:top-4 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center"
        >
          <IconHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#736E9B]" />
        </button>
        <Image
          src={product.image}
          alt={product.name}
          width={130}
          height={170}
          className="w-[68px] sm:w-[130px] h-auto"
        />
      </div>

      <div className="p-2.5 sm:p-6 flex flex-col flex-1">
        <span
          className="text-[8.5px] sm:text-[10.5px] font-bold tracking-wide"
          style={{ color: product.categoryColor }}
        >
          {product.category.toUpperCase()}
        </span>
        <h3 className="font-[family-name:var(--font-display)] font-extrabold text-[12.5px] sm:text-[17px] text-[#171136] mt-1 sm:mt-1.5">
          {product.name}
        </h3>
        <p className="hidden sm:block text-[12.5px] text-[#736E9B] mt-1">{product.subtitle}</p>

        <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStar key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" filled={i < fullStars} />
          ))}
          <span className="text-[9px] sm:text-[11.5px] font-medium text-[#736E9B] ml-0.5 sm:ml-1">
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div className="border-t border-[#EAE3F7] mt-2 sm:mt-4 pt-2 sm:pt-4 flex items-center justify-between gap-1">
          <div className="flex items-baseline gap-1 sm:gap-2 min-w-0">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-[14px] sm:text-[21px] text-[#171136] truncate">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="hidden sm:inline text-[12.5px] font-medium text-[#736E9B] line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
          <button
            aria-label={`Add ${product.name} to bag`}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: product.accent }}
          >
            <IconBag className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
