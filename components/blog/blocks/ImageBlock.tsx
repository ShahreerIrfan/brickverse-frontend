import type { BlogBlock } from "@/lib/blogTypes";
import { getMediaUrl } from "@/lib/api";

export default function ImageBlock({ block }: { block: BlogBlock }) {
  const url: string = block.data?.url || "";
  const caption: string = block.data?.caption || "";
  const alt: string = block.data?.alt || caption || "";
  if (!url) return null;

  return (
    <figure className="max-w-3xl mx-auto px-3 sm:px-0">
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F6F1FF]">
        <img src={getMediaUrl(url)} alt={alt} className="w-full h-auto object-cover" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-[11px] sm:text-xs text-[#736E9B]">{caption}</figcaption>
      )}
    </figure>
  );
}
