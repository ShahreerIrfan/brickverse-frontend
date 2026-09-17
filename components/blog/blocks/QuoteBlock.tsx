import type { BlogBlock } from "@/lib/blogTypes";

export default function QuoteBlock({ block }: { block: BlogBlock }) {
  const text: string = block.data?.text || "";
  const author: string = block.data?.author || "";
  if (!text.trim()) return null;

  return (
    <blockquote className="max-w-2xl mx-auto px-4 sm:px-8 py-4 sm:py-6 border-l-4 border-[#FF4D6D] bg-[#FFF1F4] rounded-r-2xl">
      <p className="text-sm sm:text-lg font-medium text-[#171136] leading-relaxed italic">&ldquo;{text}&rdquo;</p>
      {author && <cite className="block mt-2 sm:mt-3 text-xs sm:text-sm font-bold text-[#FF4D6D] not-italic">— {author}</cite>}
    </blockquote>
  );
}
