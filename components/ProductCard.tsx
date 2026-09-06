import Image from "next/image";
import { IconHeart, IconBag, IconStar } from "./icons";
import type { Product } from "./productData";

export default function ProductCard({ product }: { product: Product }) {
  const fullStars = Math.round(product.rating);

  return (
    <div className="relative bg-white border border-[#EAE3F7] rounded-3xl shadow-[0_16px_0_-6px_rgba(23,17,54,0.09)] overflow-hidden flex flex-col">
      <div
        className="relative h-[220px] flex items-center justify-center"
        style={{ backgroundColor: product.cardBg }}
      >
        {product.badge && (
          <span
            className="absolute left-5 top-4 -rotate-6 text-white text-[11px] font-extrabold tracking-wide rounded-full px-3 py-1.5"
            style={{ backgroundColor: product.badgeColor }}
          >
            {product.badge}
          </span>
        )}
        <button
          aria-label="Add to wishlist"
          className="absolute right-5 top-4 w-9 h-9 rounded-full bg-white flex items-center justify-center"
        >
          <IconHeart className="w-4 h-4 text-[#736E9B]" />
        </button>
        <Image
          src={product.image}
          alt={product.name}
          width={130}
          height={170}
          className="w-[110px] sm:w-[130px] h-auto"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <span
          className="text-[10.5px] font-bold tracking-wide"
          style={{ color: product.categoryColor }}
        >
          {product.category.toUpperCase()}
        </span>
        <h3 className="font-[family-name:var(--font-display)] font-extrabold text-[17px] text-[#171136] mt-1.5">
          {product.name}
        </h3>
        <p className="text-[12.5px] text-[#736E9B] mt-1">{product.subtitle}</p>

        <div className="flex items-center gap-1.5 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStar key={i} className="w-3.5 h-3.5" filled={i < fullStars} />
          ))}
          <span className="text-[11.5px] font-medium text-[#736E9B] ml-1">
            {product.rating.toFixed(1)} ({product.reviews})
          </span>
        </div>

        <div className="border-t border-[#EAE3F7] mt-4 pt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-[21px] text-[#171136]">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[12.5px] font-medium text-[#736E9B] line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
          <button
            aria-label={`Add ${product.name} to bag`}
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: product.accent }}
          >
            <IconBag className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
